var React = require("react");

module.exports = class extends React.Component {
  render() {
    let classes = ["calculator__display-text"],
        numLen = this.props.currentValue.toString().length;
    if (numLen >= 11) {
      classes.push(`calculator__display-text--${numLen}-digits`)
    }

    return (
      <div className="calculator__display">
        <span className={classes.join(" ")}>
          {this.props.currentValue}
        </span>
      </div>
    );
  }
}
