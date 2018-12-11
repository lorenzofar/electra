import * as React from "react";

import "./style.css";

interface UserCardProps {
    username: string;
    color: string;
}

interface usersMap {
    [username: string]: string; // store the color of the user
}

interface UserListProps {
    users: usersMap;
}

export class UsersList extends React.Component<UserListProps, {}>{

    constructor(props: any) {
        super(props);
    }

    render() {
        // Show the list of all connected users
        return (
            <div id="users-list" className="shadowed">
                <span className="pane-title">Connected users</span>
                <br></br>
                {Object.keys(this.props.users).map(user =>
                    <UserCard key={user} username={user} color={this.props.users[user]} />
                )}
            </div>
        );
    }
}

class UserCard extends React.Component<UserCardProps, {}>{
    render() {
        return (
            <p style={{ color: this.props.color }}>{this.props.username}</p>
        )
    }
}