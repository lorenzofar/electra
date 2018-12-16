import * as React from "react";

import "./style.css";

interface UserCardProps {
    username: string;
    color: string;
}

export default class UserCard extends React.Component<UserCardProps, {}>{
    render() {
        return (
            <div className="user-entry">
                <div className="user-dot" style={{ backgroundColor: this.props.color }} />
                <span className="user-name">{this.props.username}</span>
            </div>
        )
    }
}