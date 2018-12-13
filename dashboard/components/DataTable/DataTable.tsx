import * as React from "react";

import "./style.css";

interface DataTableProps {
    data: any;
    users: any;
}

const UNDEF_VALUE = "---";

export class DataTable extends React.Component<DataTableProps, null>{
    render() {
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
                                <tr>
                                    <td>{user}</td>
                                    {Object.keys(this.props.data).map(sensor => {
                                        if (!(user in this.props.data[sensor])) return <td>{UNDEF_VALUE}</td>
                                        let userData: any[] = this.props.data[sensor][user];
                                        return <td>{userData[userData.length - 1] && (userData[userData.length - 1].y).toFixed(3) || UNDEF_VALUE}</td>
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