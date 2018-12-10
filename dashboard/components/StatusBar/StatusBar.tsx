import * as React from "react";

import "./style.css";

interface StatusBarState {
    connectedUsers: number; // Total number of connected users (monitored)
}

interface StatusBarProps {
    connected: boolean;
}

export class StatusBar extends React.Component<StatusBarProps, StatusBarState>{

    constructor(props: StatusBarProps) {
        super(props);
    }

    render() {
        return (
            <div id="status-bar">
                <span>
                    {this.props.connected ? "Connected to server" : "Not connected to server"}
                </span>
            </div>
        )
    }
}