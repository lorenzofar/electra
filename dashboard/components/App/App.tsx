import * as React from "react";

import SocketManager from "../../providers/socketManager";

import "./style.css";

interface AppState{
    //TODO: Define app state
    loading: boolean;
}

class App extends React.Component<{}, AppState> {

    private SM: SocketManager;

    constructor(props: any){
        super(props);
        this.state = {
            loading: true
        }
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
                    console.log(data);
                    this.SM = new SocketManager(data.username, data.password);
                    console.log("I created the socket manager");
                    console.log(this.SM);
                // TODO: Call socket manager providing the fetched credentials
            });
        });
    }

    render() {
        return (
            <div id="app">
                <div id="header"></div>
                <div id="main-container"></div>
                <div id="status-bar"></div>
            </div>
        )
    };
}

export default App;