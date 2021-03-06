import * as React from "react";
import * as V from "victory";

import "./style.css";

interface chartData {
    [username: string]: any[];
}

interface chartStrokes {
    [username: string]: string;
}

interface chartProps {
    id: string;
    description: string;
    data: chartData;
    strokes: chartStrokes;
}

export class ChartPane extends React.Component<chartProps, {}>{
    render() {
        return (
            <div id={this.props.id} className="chart-pane shadowed">
                <span className="pane-title">{this.props.description}</span>
                <V.VictoryChart >
                    <V.VictoryAxis
                        dependentAxis={true}
                        tickFormat={(t) => `${t}`}>
                    </V.VictoryAxis>
                    <V.VictoryAxis></V.VictoryAxis>
                    {Object.keys(this.props.data).map((user, i) =>
                        <V.VictoryLine
                            key={i}
                            data={this.props.data[user]}
                            style={
                                { data: { stroke: this.props.strokes[user] } }
                            }
                            interpolation={"monotoneX"}
                        >
                        </V.VictoryLine>
                    )}
                </V.VictoryChart>
            </div>
        )
    }
}