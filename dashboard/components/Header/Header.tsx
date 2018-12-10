import * as React from "react";

import "./style.css"

interface HeaderProps {
    username: string;
}

export class Header extends React.Component<HeaderProps, {}>{
    render() {
        return (
            <div id="header">
                <div id="logo">Electra</div>

                <div id="userinfo">
                    <span>{this.props.username}</span>
                    <a href="/logout">
                        <div id="logout-btn"/>
                    </a>
                </div>
            </div>
        );
    }
}