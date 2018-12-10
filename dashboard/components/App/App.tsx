import * as React from "react";

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
    //TODO: Define app state
    loading: boolean;
    connected: boolean;
    username: string;
    cache: AppCache
}

interface incomingData {
    username: string,
    data: DataPoint
}

interface AppCache {
    [username: string]: DataPoint[];
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
            cache: {}
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
         * Hence we now request credentials to open a socket connection (TODO:)
         */


        // TODO: Subscribe to welcome event

        fetch("/credentials").then(res => {
            return res.json().then(data => {
                this.setState({ username: data.username });
                this.SM = new SocketManager(data.username, data.password, this.handleConnectedStatus);
            });
        });
    }


    handleInitialCache(initialData: initialCacheEntry[]) {
        console.log("Handling initial cache");
        let cache = this.state.cache; // It is anyway an empty map
        initialData.forEach(entry => {
            cache[entry.username] = entry.data;
            console.log(`Adding row for ${entry.username}`);
        });
        this.setState({ cache: cache });
    }

    handleNewData(DataPoint: incomingData) {
        let username = DataPoint.username;
        let data = DataPoint.data;

        let cache = this.state.cache; // Get cache 

        if (!(username in cache)) cache[username] = []; // Initialize if needed

        let userData = cache[username];
        let totalCount = userData.push(data); // Add data
        if (totalCount > CACHE_LIMIT) userData.shift(); // Check cache length limit

        this.setState({ cache: cache }); // Update state
    }

    handleUserConnection(username: string) {
        let cache = this.state.cache;
        cache[username] = [];
        this.setState({ cache: cache });
        console.log("[APP] a new user connected");
    }

    handleUserDisconnection(username: string) {
        let cache = this.state.cache;
        if (username in cache) delete cache[username];
        this.setState({ cache: cache });
        console.log("[APP] a user disconnected");
    }

    /**
     * This function handles changes in connection to the socket
     * It provides the status as a state property (TODO:), which is passed to status bar
     * in order to show connection status to the user
     * @param connected 
     */
    handleConnectedStatus(connected: boolean) {
        console.log(connected);
        this.setState({ connected: connected });
    }


    render() {
        return (
            <div id="app">
                <Header username={this.state.username} />
                <div id="main-container">
                    <UsersList users={Object.keys(this.state.cache)} />

                </div>
                <StatusBar connected={this.state.connected}></StatusBar>

            </div>
        )
    };
}

export default App;