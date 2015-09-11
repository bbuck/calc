var React = require("react");

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
