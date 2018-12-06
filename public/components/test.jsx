class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    render() {
        return (
            <button
                onClick={() => this.setState({ count: this.state.count + 1 })}>
                {this.state.count}
            </button>
        );
    }
}

document.querySelectorAll(".test-container").forEach(container => {
    ReactDOM.render(
        <Test></Test>,
        container
    );
});