import * as React from "react";

import "./style.css";

interface UserCardProps {
    username: string;
}

interface UserListProps {
    users: string[];
}

export class UsersList extends React.Component<UserListProps, {}>{

    // TODO: Just use app props and do not rely on an internal state

    constructor(props: any) {
        super(props);
    }

    render() {
        // Show the list of all connected users
        return (
            <div id="users-list" className="shadowed">
                <span className="pane-title">Connected users</span>
                <br></br>
                {this.props.users.map((user, i) =>
                    <UserCard key={i} username={user} />
                )}
            </div>
        );
    }
}

class UserCard extends React.Component<UserCardProps, {}>{
    render() {
        return (
            <p>{this.props.username}</p>
        )
    }
}