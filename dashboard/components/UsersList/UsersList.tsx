import * as React from "react";

import UserCard from "../UserCard/UserCard";

import "./style.css";

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
                {
                    Object.keys(this.props.users).length > 0 ?
                        Object.keys(this.props.users).map(user =>
                            <UserCard key={user} username={user} color={this.props.users[user]} />
                        )
                        :
                        <span> No user is connected at the moment </span>
                }
            </div>
        );
    }
}

