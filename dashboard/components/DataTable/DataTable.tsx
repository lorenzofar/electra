import * as React from "react";

import UserCard from "../UserCard/UserCard";

import "./style.css";

interface DataTableProps {
    data: any;
    users: any;
}

const UNDEF_VALUE = "---";

interface maxmin_entry {
    user: string;
    val: number;
}

interface maxmin {
    max: maxmin_entry;
    min: maxmin_entry;
};

interface maxminMap {
    [sensor: string]: maxmin;
}

export class DataTable extends React.Component<DataTableProps, null>{

    // Find the maximum value
    //
    render() {

        let maxminMap: maxminMap = {};

        Object.keys(this.props.data).map(sensor => {
            let sensorData = this.props.data[sensor];
            maxminMap[sensor] = { max: { user: null, val: null }, min: { user: null, val: null } };
            Object.keys(sensorData).forEach(user => {
                let userData = sensorData[user];
                let point = userData[userData.length - 1].y;
                if (maxminMap[sensor].max.val == null || maxminMap[sensor].max.val < point) {
                    maxminMap[sensor].max.val = point;
                    maxminMap[sensor].max.user = user;
                }
                if (maxminMap[sensor].min.val == null || maxminMap[sensor].min.val > point) {
                    maxminMap[sensor].min.val = point;
                    maxminMap[sensor].min.user = user;
                }
            });
        });

        return (
            <div id="data-table" className="shadowed">
                <table className="table header-fixed">
                    <thead>
                        <tr>
                            <th>user</th>
                            {Object.keys(this.props.data).map(sensor => <th key={sensor}>{sensor}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.props.users).map(user => {
                            return (
                                <tr key={user}>
                                    <td><UserCard color={this.props.users[user]} username={user} /></td>
                                    {Object.keys(this.props.data).map(sensor => {
                                        if (!(user in this.props.data[sensor])) return <td>{UNDEF_VALUE}</td>
                                        let userData: any[] = this.props.data[sensor][user];
                                        return (
                                            <td
                                                key={`${sensor}${user}`}
                                                className={
                                                    `${maxminMap[sensor].max.user === user ? "max" : ""}
                                                    ${maxminMap[sensor].min.user === user ? "min" : ""}`
                                                }>
                                                {userData[userData.length - 1] && (userData[userData.length - 1].y).toFixed(3) || UNDEF_VALUE}
                                            </td>
                                        )
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}