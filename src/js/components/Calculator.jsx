let React = require("react"),
    CalculatorButton = require("./CalculatorButton.jsx"),
    CalculatorDisplay = require("./CalculatorDisplay.jsx");

const CoreButtonClass = "calculator__button--core",
      OperationButtonClass = "calculator__button--operation",
      ZeroButtonClass = "calculator__button--zero";

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      tempValue: null,
      decimal: false,
      queuedOperation: null,
      clearOnEntry: false
    };
    this.buttonClicked = this.buttonClicked.bind(this);
  }

  reset() {
    this.setState({
      value: null,
      tempValue: null,
      decimal: false,
      queuedOperation: null,
      clearOnEntry: false
    });
  }

  isCleared() {
    return this.state.value === null;
  }

  getBase() {
    return this.props.base || 10;
  }

  buttonClicked(type, value) {
    let {tempValue: temp, queuedOperation} = this.state,
        currentValue = this.getActualValue() || 0;
    switch (type) {
      case "number":
        let newState;
        if (this.state.clearOnEntry) {
          currentValue = parseInt(value, this.getBase());
        } else {
          currentValue = this.state.value * this.getBase() + parseInt(value, this.getBase());
        }
        if (currentValue <= Number.MAX_SAFE_INTEGER) {
          newState = {
            value: currentValue,
            clearOnEntry: false
          };
          if (this.state.decimal) {
            newState.decimal = this.state.decimal * this.getBase();
          }
          this.setState(newState);
        }
        break;
      case "op":
        if (!queuedOperation) {
          // If no operation already specified, then store current value and
          // reset the value, record the requested operation.
          this.setState({
            value: null,
            tempValue: currentValue,
            queuedOperation: value,
            decimal: false,
            clearOnEntry: false
          });
        } else {
          this.performQueuedOperation(value);
        }
        break;
      case "action":
        Calculator.ACTIONS[value](this);
        break;
    }
  }

  setDecimalEntry() {
    if (this.state.clearOnEntry) {
      this.setState({
        value: null,
        decimal: 1,
        clearOnEntry: false
      });
    } else {
      this.setState({
        decimal: 1
      });
    }
  }

  // Calculate actual current value (determing if it has a decimal value)
  getActualValue() {
    if (this.state.decimal) {
      return this.state.value / this.state.decimal;
    } else {
      return this.state.value;
    }
  }

  getDisplayValue() {
    let value = this.getActualValue();
    if (value || this.state.decimal) {
      let valueStr = value ? value.toString(this.getBase()) : "0";
      // If the decimal button has been hit and we either have no value, or have a non-decimal value already
      // we add a decimal to the output
      if (this.state.decimal && (value === null || value === Math.floor(value))) {
        valueStr += ".";
      }

      return valueStr;
    } else {
      return this.state.tempValue ? this.state.tempValue.toString(this.getBase()) : "0";
    }
  }

  performQueuedOperation(newOp, setValue) {
    setValue = setValue || false;
    newOp = newOp || null;
    let newState = {
      value: null,
      tempValue: null,
      queuedOperation: newOp,
      decimal: false,
      clearOnEntry: false
    };
    if (this.state.queuedOperation) {
      let op = Calculator.OPERATIONS[this.state.queuedOperation];
      if (setValue) {
        newState.value = op(this.state.tempValue, this.getActualValue());
        newState.clearOnEntry = true;
      } else {
        newState.tempValue = op(this.state.tempValue, this.getActualValue());
      }
      this.setState(newState);
    } else {
      this.setState({
        clearOnEntry: true
      });
    }
  }

  getButtons() {
    return Calculator.BUTTON_LAYOUT.map((btnData, idx) => {
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
        <CalculatorButton key={idx} onClick={this.buttonClicked} btnType={type} btnValue={value} className={classes}>
          {text}
        </CalculatorButton>
      );
    });
  }

  render() {
    console.log(this.state);
    return (
      <div className="calculator">
        <CalculatorDisplay currentValue={this.getDisplayValue()} />
        {this.getButtons()}
      </div>
    );
  }
}

// This is the order in which buttons will appear on the calculator. I chose
// not to handle layout at this stage - I will handle layout via styles. This
// simply determines type and order of buttons. Classes added here should be
// in additon to the standard "calculator__button" class for special styles.
// Classes can be a single value or array.
Calculator.BUTTON_LAYOUT = [
  ["action", "clear", CoreButtonClass],
  ["action", "negate", CoreButtonClass],
  ["op", "percent", CoreButtonClass],
  ["op", "div", OperationButtonClass],
  ["number", 7],
  ["number", 8],
  ["number", 9],
  ["op", "mult", OperationButtonClass],
  ["number", 4],
  ["number", 5],
  ["number", 6],
  ["op", "sub", OperationButtonClass],
  ["number", 1],
  ["number", 2],
  ["number", 3],
  ["op", "add", OperationButtonClass],
  ["number", 0, ZeroButtonClass],
  ["action", "decimal"],
  ["action", "equal", OperationButtonClass]
];

// Maps button names to display values. Possible values are functions that
// receive the calculator (for state dependant renderings) or JavaScript values
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

// Store operations by name for buttons, adding operatiosn is as easy as
// defining new functions
Calculator.OPERATIONS = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  div: (a, b) => a / b,
  mult: (a, b) => a * b,
  percent(a, b) {
    // what percent a is of b
    return (a / b) * 100;
  }
};

Calculator.ACTIONS = {
  clear(calculator) {
    if (calculator.isCleared()) {
      calculator.reset();
    } else {
      calculator.setState({value: null, decimal: false});
    }
  },
  negate(calculator) {
    calculator.setState({value: -calculator.state.value});
  },
  decimal(calculator) {
    calculator.setDecimalEntry();
  },
  equal(calculator) {
    // no operation to queue, but set value instead of temporary value
    calculator.performQueuedOperation(null, true);
  }
};

module.exports = Calculator;
