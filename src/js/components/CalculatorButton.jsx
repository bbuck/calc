var React = require("react");

// Represents a button on a calculator. Does not do anything special other than
// wrap a click handler passed down to it from a parent.
module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.btnType, this.props.btnValue);
  }

  render() {
    return (
      <button className={this.props.className + " calculator__button"} onClick={this.onClick}>
        {this.props.children}
      </button>
    );
  }
}
