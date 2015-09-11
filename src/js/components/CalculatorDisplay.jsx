var React = require("react");

module.exports = class extends React.Component {
  render() {
    return <div className="calculator__display">{this.props.currentValue}</div>;
  }
}
