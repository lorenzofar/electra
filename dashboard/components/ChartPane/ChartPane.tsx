import * as React from "react";
import * as V from "victory";

import "./style.css";

interface chartProps {
    id: string;
    description: string;
    data: any[];
    y: string;
}

export class ChartPane extends React.Component<chartProps, {}>{
    render() {
        return (
            <div id={this.props.id} className="chart-pane shadowed">
                <span className="pane-title">{this.props.description}</span>
                <V.VictoryChart>
                    <V.VictoryLine
                        animate={{
                            duration: 1000,
                            onLoad: { duration: 500 }
                        }}
                        data={this.props.data}
                        y={this.props.y}>
                    </V.VictoryLine>
                </V.VictoryChart>
            </div>
        )
    }
}