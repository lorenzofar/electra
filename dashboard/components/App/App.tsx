import * as React from "react";

import SocketManager from "../../providers/socketManager";

/* ===== LOAD COMPONENTS ===== */
import { UsersList } from "../UsersList/UsersList";
import { Header } from "../Header/Header";
import { StatusBar } from "../StatusBar/StatusBar";

import "./style.css";



interface AppState {
    //TODO: Define app state
    loading: boolean;
    connected: boolean;
    username: string;
}

class App extends React.Component<{}, AppState> {

    private SM: SocketManager;

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            connected: false,
            username: ""
        }
        this.handleConnectedStatus = this.handleConnectedStatus.bind(this);
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

        fetch("/credentials").then(res => {
            return res.json().then(data => {
                this.setState({ username: data.username });
                this.SM = new SocketManager(data.username, data.password, this.handleConnectedStatus);
            });
        });
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
                    <UsersList />
                </div>
                <StatusBar id="status-bar" connected={this.state.connected}></StatusBar>

            </div>
        )
    };
}

export default App;