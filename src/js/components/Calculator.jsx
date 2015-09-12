let React = require("react"),
    CalculatorButton = require("./CalculatorButton.jsx"),
    CalculatorDisplay = require("./CalculatorDisplay.jsx");

// Constantize some button classes for use in the BUTTON_LAYOUT field
const CoreButtonClass = "calculator__button--core",
      OperationButtonClass = "calculator__button--operation",
      ZeroButtonClass = "calculator__button--zero";

// This rerpesents the core powerhouse component. The Calculator is the central
// tie for the internal components that get rendered out. Buttons and the display
// do little to no work on their own - most of the work is mixed with this
// component and it's modifiers (OPERATIONS and ACTIONS).
class Calculator extends React.Component {
  constructor(props) {
    super(props);

    // value {Integer?} is our current value, or null when no current value is
    //                  present.
    // tempValue {Number?} is the previous value calculated during processing.
    //                     this field is set when an operation is applied.
    // decimal {Number,Boolean} this value is a power of the base, and is used
    //                          to convert the strict integer value to a
    //                          decimal for display purposes (it was this or a
    //                          string, and I opted to keep things numeric). If
    //                          the period button has been hit yet this value
    //                          is false.
    // queuedOperation {String?} since operations happen after at least one
    //                           value has been entered, the operation is
    //                           queued to be applied later.
    // clearOnEntry {Boolean} this is used to denote whether hitting a number
    //                        button should clear the display value or add to
    //                        it. It's only used when you hit equal so that
    //                        this state can accurately been spotted from
    //                        others.
    this.state = {
      value: null,
      tempValue: null,
      decimal: false,
      queuedOperation: null,
      clearOnEntry: false
    };
    this.buttonClicked = this.buttonClicked.bind(this);
  }

  // reset simply returns to the default state (as seen in the constructor)
  reset() {
    this.setState({
      value: null,
      tempValue: null,
      decimal: false,
      queuedOperation: null,
      clearOnEntry: false
    });
  }

  // isCleared returns whether or not the current entered value has been
  // cleared or not.
  isCleared() {
    return this.state.value === null;
  }

  // getBase returns the base the calculator should be functioning in. I
  // honestly did not test other bases so they probably don't render correctly
  // and the number input handler probably doesn't handle not standard bases
  // but theorectically all number opertions rely on this for base information.
  // This is a convience to fetch a supplied base or 10 if no base was
  // explicitly set.
  getBase() {
    return this.props.base || 10;
  }

  // buttonClicked handles all button clicks for the calculator. It varies it's
  // functionality via a switch for button types.
  //  - "number" buttons represent numberic input buttons
  //  - "action" perform none binary or calculator specific behaviors such as
  //    clearing the calculator or or negating the current value
  //  - "op" buttons represent binary operations on the current and most recent
  //    input values.
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
        // We don't want numbers larger than our maximum safe number - that's
        // for sure.
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

  // setDecimalEntry determines the best approach for marking new number
  // inputs to be input as decimal values. The only special case is when
  // clearOnEntry is true.
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

  // getActualValue will return the decimal value (if a decimal value is
  // given) or the value specified. This is here so that the decision and
  // calculation is not duplicated where actual values are used.
  getActualValue() {
    if (this.state.decimal) {
      return this.state.value / this.state.decimal;
    } else {
      return this.state.value;
    }
  }

  // getDisplayValue returns the string representation of the current value.
  // There area few special cases, such as when no value is entered "0" should
  // be displayed. When a decimal is chosen before numbers are input then
  // "0." should be displayed. If you choose to begin entering decimal values
  // then then a "." is appended the display number. If there is a temporary
  // value but now current value the temporary value is displayed instead
  // (useful to see results after operations, without hitting "=")
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

  // performQueuedOperation will determine if there is a operation in queue
  // and process it. It receives an optional new operation to queue after
  // performing the current and a boolean to denote whether to set the results
  // as the current value or the temporaryValue (temporary for math operations
  // and current value for equality)
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

  // getButtons loops over the BUTTON_LAYOUT and returns CalculatorButton
  // button components for ease of rendering.
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
// For information on types see Calculator#buttonClicked
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

// This maps Operations by names used in button definitions to functions. These
// should be binary functions and therefore take an a and b numeric input
// and are expected to return numeric input.
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

// Actions differ slightly from Operations where Operations are binary functions
// applied to numeric values operations are calculator functions that change
// the state of the calculator. They can affect the numeric properties (such
// as negate which just negates the current value).
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
