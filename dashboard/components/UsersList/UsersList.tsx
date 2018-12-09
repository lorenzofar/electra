import * as React from "react";

import SocketManager from "../../providers/socketManager";


interface UsersListState {
    users: string[];
}

interface UserCardProps {
    username: string;
}

interface initialCacheEntry {
    username: string;
    data: any[];
}


export class UsersList extends React.Component<{}, UsersListState>{

    constructor(props: any) {
        super(props);
        this.state = { users: [] };
        this.handleUserConnection = this.handleUserConnection.bind(this);
        this.handleUserDisconnection = this.handleUserDisconnection.bind(this);
        this.handleInitialCache = this.handleInitialCache.bind(this);
    }

    componentDidMount() {
        SocketManager.subscribe("deviceconnected", this.handleUserConnection);
        SocketManager.subscribe("devicedisconnected", this.handleUserDisconnection);
        SocketManager.subscribe("welcome", this.handleInitialCache);
    }

    handleInitialCache(data: initialCacheEntry[]) {
         // Populate list of users with data retrieved from the welcome message
        let initialUsers = data.map(entry => entry.username);
        this.setState({ users: initialUsers });
    }

    handleUserConnection(username: string) {
        console.log("A device connected")
        let currentUsers = this.state.users;
        currentUsers.push(username);
        this.setState({ users: currentUsers });
    }

    handleUserDisconnection(username: string) {
        console.log("A device disconnected");
        let currentUsers = this.state.users;
        let index = currentUsers.indexOf(username);
        currentUsers.splice(index, 1);
        this.setState({ users: currentUsers });
    }

    render() {
        // Show the list of all connected users
        return (
            this.state.users.map((user, i) =>
                <UserCard key={i} username={user} />
            )
        );
    }
}

class UserCard extends React.Component<UserCardProps, {}>{
    render() {
        return (
            <div>
                <p>{this.props.username}</p>
            </div>
        )
    }
}