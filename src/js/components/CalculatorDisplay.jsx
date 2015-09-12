var React = require("react");

// Represents the display area for the calculator values and results. It has
// pretty basic functioanlity as a simple "display" unit however it does track
// number length > 11 to aid in styling smaller fonts for displaying longer
// numeric values.
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
