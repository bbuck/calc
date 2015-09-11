let React = require("react"),
    CalculatorButton = require("./CalculatorButton.jsx"),
    CalculatorDisplay = require("./CalculatorDisplay.jsx");

const CoreButtonClass = "calculator__button--core",
      OperationButtonClass = "calculator__button--operation",
      NumberButtonClass = "caclulator__button--operation",
      ZeroButtonClass = "calculator__button--zero";

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      tempValue: null
    };
    this.buttonClicked = this.buttonClicked.bind(this);
  }

  isCleared() {
    return this.state.value !== null;
  }

  getBase() {
    return this.props.base || 10;
  }

  buttonClicked(type, value) {
    let currentValue = this.state.value || 0,
        temp = this.state.tempValue;
    switch (type) {
      case "number":
        console.log(currentValue, value);
        currentValue = currentValue * this.getBase() + parseInt(value, 10);
        this.setState({value: currentValue});
        break;
      case "op":
        if (temp) {
          this.setState({
            value: Calculator.OPERATIONS[value](temp, currentValue),
            tempValue: null
          });
        } else {
          this.setState({
            tempValue: currentValue,
            value: null
          });
        }
        break;
    }
  }

  getDisplayValue() {
    if (this.state.value) {
      let value = this.state.value.toString(this.getBase());
      if (this.state.decimal && this.state.value !== Math.floor(this.state.value)) {
        value += ".";
      }
      return value;
    } else {
      return "0";
    }
  }

  getButtons() {
    return Calculator.BUTTON_LAYOUT.map(btnData => {
      let [type, value, classes] = btnData,
          text;
      if (type !== "number") {
        if (typeof Calculator.BUTTON_MAP[value] === "function") {
          text = Calculator.BUTTON_MAP[value](this);
        } else {
          text = Calculator.BUTTON_MAP[value];
        }
      } else {
        text = value.toString();
      }
      if (classes) {
        if (Array.isArray(classes)) {
          classes = classes.join(" ");
        }
      } else {
        classes = "";
      }
      return (
        <CalculatorButton onClick={this.buttonClicked} btnType={type} btnValue={value} className={classes}>
          {text}
        </CalculatorButton>
      );
    });
  }

  render() {
    return (
      <div className="calculator">
        <CalculatorDisplay currentValue={this.getDisplayValue()} />
        {this.getButtons()}
      </div>
    );
  }
}

// styles determine rows, this is a linear button layout
Calculator.BUTTON_LAYOUT = [
  ["action", "clear", CoreButtonClass],
  ["action", "negate", CoreButtonClass],
  ["op", "percent", CoreButtonClass],
  ["op", "div", OperationButtonClass],
  ["number", 7, NumberButtonClass],
  ["number", 8, NumberButtonClass],
  ["number", 9, NumberButtonClass],
  ["op", "mult", OperationButtonClass],
  ["number", 4, NumberButtonClass],
  ["number", 5, NumberButtonClass],
  ["number", 6, NumberButtonClass],
  ["op", "sub", OperationButtonClass],
  ["number", 1, NumberButtonClass],
  ["number", 2, NumberButtonClass],
  ["number", 3, NumberButtonClass],
  ["op", "add", OperationButtonClass],
  ["number", 0, [NumberButtonClass, ZeroButtonClass]],
  ["action", "decimal", NumberButtonClass],
  ["op", "equal", OperationButtonClass]
];

Calculator.BUTTON_MAP = {
  clear(calculator) {
    if (calculator.isCleared()) {
      return "AC";
    } else {
      return "C";
    }
  },
  negate: "+/-",
  percent: "%",
  div: "÷",
  mult: "x",
  sub: "-",
  add: "+",
  decimal: ".",
  equal: "="
};

Calculator.OPERATIONS = {
  add: (a, b) => { a + b},
  sub: (a, b) => { a - b},
  div: (a, b) => { a / b},
  mult: (a, b) => { a * b }
};

Calculator.ACTIONS = {
  clear(calculator) {
    if (calculator.cleared) {
      calculator.reset();
    } else {
      calcualtor.setState({value: null});
    }
  },
  negate(calculator) {
    calculator.setState({value: -calculator.state.value});
  },
  decimal(calculator) {
    calculator.setState({decimal: true});
  }
};

module.exports = Calculator;
