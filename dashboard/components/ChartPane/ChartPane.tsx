import * as React from "react";
import * as V from "victory";

import "./style.css";

interface chartData {
    [username: string]: any[];
}

interface chartProps {
    id: string;
    description: string;
    data: chartData
}

export class ChartPane extends React.Component<chartProps, {}>{
    render() {
        console.log(this.props.data);
        return (
            <div id={this.props.id} className="chart-pane shadowed">
                <span className="pane-title">{this.props.description}</span>
                <V.VictoryChart>
                    {Object.keys(this.props.data).map((user, i) =>
                        <V.VictoryLine
                            key={i}
                            data={this.props.data[user]}
                        >
                        </V.VictoryLine>
                    )}
                </V.VictoryChart>
            </div>
        )
    }
}