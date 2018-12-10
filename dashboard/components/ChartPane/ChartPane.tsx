import * as React from "react";
import * as V from "victory";

import "./style.css";

interface chartProps {
    description: string;
    data: any[];
    y: string;
}

export class ChartPane extends React.Component<chartProps, {}>{
    render() {
        return (
            <div className="chart-pane shadowed">
                <span className="pane-title">{this.props.description}</span>
                <V.VictoryChart>
                    <V.VictoryLine
                        data={this.props.data}
                        y={this.props.y}>
                    </V.VictoryLine>
                </V.VictoryChart>
            </div>
        )
    }
}