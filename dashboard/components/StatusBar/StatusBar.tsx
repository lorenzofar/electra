import * as React from "react";

interface StatusBarState{
    connectedUsers: number; // Total number of connected users (monitored)

}

interface StatusBarProps{
    id: string;
    connected: boolean;
}

export class StatusBar extends React.Component<StatusBarProps, StatusBarState>{

    constructor(props: StatusBarProps){
        super(props);
    }
    
    render(){
        console.log(this.props.connected);
        return(
            <div id={this.props.id}>
                {this.props.connected ? "Connected to server" : "Not connected to server"}
            </div>
        )
    }
}