import * as React from "react";
const randomcolor = require("randomcolor");

import SocketManager from "../../providers/socketManager";

/* ===== LOAD COMPONENTS ===== */
import { UsersList } from "../UsersList/UsersList";
import { Header } from "../Header/Header";
import { StatusBar } from "../StatusBar/StatusBar";
import { ChartPane } from "../ChartPane/ChartPane";

/* ===== LOAD MODELS ===== */
import DataPoint from "../../../src/models/dataPoint";

import "./style.css";

interface AppState {
    loading: boolean;
    connected: boolean;
    username: string;
    cache: AppCache;
    users: usersMap;
}

interface incomingData {
    username: string,
    data: DataPoint
}

interface AppCacheSensorData {
    [username: string]: any[];
};

interface AppCache {
    [sensor: string]: AppCacheSensorData;
}

interface usersMap {
    [username: string]: string; // store the color of the user
}

interface initialCacheEntry {
    username: string;
    data: any[];
}

const CACHE_LIMIT = 50;

class App extends React.Component<{}, AppState> {

    private SM: SocketManager;

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            connected: false,
            username: "",
            cache: {},
            users: {}
        }
        this.handleConnectedStatus = this.handleConnectedStatus.bind(this);
        this.handleInitialCache = this.handleInitialCache.bind(this);
        this.handleNewData = this.handleNewData.bind(this);
        this.handleUserConnection = this.handleUserConnection.bind(this);
        this.handleUserDisconnection = this.handleUserDisconnection.bind(this);

        /* ===== SOCKET SUBSSCRIPTIONS ===== */
        SocketManager.subscribe("welcome", this.handleInitialCache);
        SocketManager.subscribe("deviceconnected", this.handleUserConnection);
        SocketManager.subscribe("devicedisconnected", this.handleUserDisconnection);
        SocketManager.subscribe("datapoint", this.handleNewData);
    }

    //TODO: How to determine and handle page loading: 
    // Maybe use a mutex?

    componentDidMount() {
        /**
         * The app has been initialized
         * If the page has opened, it means that the user
         * has provided a valid token.
         * Hence we now request credentials to open a socket connection
         */

        fetch("/credentials").then(res => {
            return res.json().then(data => {
                this.setState({ username: data.username });
                this.SM = new SocketManager(data.username, data.password, this.handleConnectedStatus);
            });
        });
    }


    handleInitialCache(initialData: initialCacheEntry[]) {
        let cache = this.state.cache; // It is anyway an empty map

        let users: usersMap = {};

        initialData.forEach(entry => {
            users[entry.username] = randomcolor(); // TODO: Generate random color
        });

        // After having the list of users, use it to build the cache
        // Get a sample data point
        if (initialData.length) {
            // Here we create the structure
            let sampleData = initialData[0].data;
            if (sampleData.length) {
                let samplePoint = sampleData[0].data;
                // Iterate over the sensors
                Object.keys(samplePoint).forEach(sensor => {
                    cache[sensor] = {};
                    Object.keys(users).forEach(user => {
                        cache[sensor][user] = [];
                    })
                })
            }

            // Here we load data into the cache
            initialData.forEach(entry => {
                // Get username 
                let username = entry.username;
                let userData = entry.data; // Get user data

                // Cap the data to only the most recent values
                userData = userData.slice(Math.max(userData.length - CACHE_LIMIT, 0));
                // Get sample point

                userData.forEach(dp => {
                    let data = dp.data;
                    let sensors = Object.keys(data); // Get sensors
                    sensors.forEach(sensor => {
                        cache[sensor][username].push({ y: data[sensor] });
                    })
                })
            })

        }

        this.setState({ cache: cache, users: users });
    }

    handleNewData(DataPoint: incomingData) {
        let username = DataPoint.username;
        let data = DataPoint.data;

        let cache = this.state.cache; // Get cache 

        // Get structure of data point
        let sensors = Object.keys(data.data);

        sensors.forEach(sensor => {
            if (!(sensor in cache)) {
                cache[sensor] = {};
            }
            if (!(username in cache[sensor])) {
                cache[sensor][username] = [];
            }
            let totalCount = cache[sensor][username].push({ y: data.data[sensor] });
            if (totalCount > CACHE_LIMIT) cache[sensor][username].shift();
        });

        this.setState({ cache: cache }); // Update state
    }

    handleUserConnection(username: string) {
        let cache = this.state.cache;
        let users = this.state.users;
        users[username] = randomcolor(); // TODO: Generate random color
        Object.keys(cache).forEach(sensor => {
            cache[sensor][username] = []; // initialize cache for the user
        })
        this.setState({ cache: cache, users: users });
    }

    handleUserDisconnection(username: string) {
        let cache = this.state.cache;
        let users = this.state.users;

        if (username in users) delete users[username]; // remove user from list

        // Iterate over sensors in cache and remove user's data
        Object.keys(cache).forEach(sensor => {
            if (username in cache[sensor]) {
                delete cache[sensor][username];
            }
        })

        this.setState({ cache: cache, users: users });
    }

    /**
     * This function handles changes in connection to the socket
     * It provides the status as a state property, which is passed to status bar
     * in order to show connection status to the user
     * @param connected 
     */
    handleConnectedStatus(connected: boolean) {
        this.setState({ connected: connected });
    }

    render() {
        return (
            <div id="app">
                <Header username={this.state.username} />
                <div id="main-container">
                    <UsersList users={this.state.users} />
                    {Object.keys(this.state.cache).map((sensor, i) =>
                        <ChartPane
                            key={i}
                            description={sensor}
                            data={this.state.cache[sensor]}
                            strokes={this.state.users}
                            id={sensor}>
                        </ChartPane>
                    )}
                </div>
                <StatusBar connected={this.state.connected}></StatusBar>

            </div>
        )
    };
}

export default App;