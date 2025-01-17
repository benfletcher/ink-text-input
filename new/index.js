"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UncontrolledTextInput = exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ink = require("ink");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ARROW_UP = '\u001B[A';
const ARROW_DOWN = '\u001B[B';
const ARROW_LEFT = '\u001B[D';
const ARROW_RIGHT = '\u001B[C';
const ENTER = '\r';
const CTRL_C = '\x03';
const BACKSPACE = '\x08';
const DELETE = '\x7F';

class TextInput extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      cursorOffset: (this.props.value || '').length,
      cursorWidth: 0
    });

    _defineProperty(this, "isMounted", false);

    _defineProperty(this, "handleInput", data => {
      const {
        value: originalValue,
        focus,
        showCursor,
        mask,
        onChange,
        onSubmit
      } = this.props;
      const {
        cursorOffset: originalCursorOffset
      } = this.state;

      if (focus === false || this.isMounted === false) {
        return;
      }

      const s = String(data);

      if (s === ARROW_UP || s === ARROW_DOWN || s === CTRL_C) {
        return;
      }

      if (s === ENTER) {
        if (onSubmit) {
          onSubmit(originalValue);
        }

        return;
      }

      let cursorOffset = originalCursorOffset;
      let value = originalValue;
      let cursorWidth = 0;

      if (s === ARROW_LEFT) {
        if (showCursor && !mask) {
          cursorOffset--;
        }
      } else if (s === ARROW_RIGHT) {
        if (showCursor && !mask) {
          cursorOffset++;
        }
      } else if (s === BACKSPACE || s === DELETE) {
        value = value.substr(0, cursorOffset - 1) + value.substr(cursorOffset, value.length);
        cursorOffset--;
      } else {
        value = value.substr(0, cursorOffset) + s + value.substr(cursorOffset, value.length);
        cursorOffset += s.length;

        if (s.length > 1) {
          cursorWidth = s.length;
        }
      }

      if (cursorOffset < 0) {
        cursorOffset = 0;
      }

      if (cursorOffset > value.length) {
        cursorOffset = value.length;
      }

      this.setState({
        cursorOffset,
        cursorWidth
      });

      if (value !== originalValue) {
        onChange(value);
      }
    });
  }

  render() {
    const {
      value,
      placeholder,
      showCursor,
      focus,
      mask,
      highlightPastedText
    } = this.props;
    const {
      cursorOffset,
      cursorWidth
    } = this.state;
    const hasValue = value.length > 0;
    let renderedValue = value;
    const cursorActualWidth = highlightPastedText ? cursorWidth : 0; // Fake mouse cursor, because it's too inconvenient to deal with actual cursor and ansi escapes

    if (showCursor && !mask && focus) {
      renderedValue = value.length > 0 ? '' : _chalk.default.inverse(' ');
      let i = 0;

      for (const char of value) {
        if (i >= cursorOffset - cursorActualWidth && i <= cursorOffset) {
          renderedValue += _chalk.default.inverse(char);
        } else {
          renderedValue += char;
        }

        i++;
      }

      if (value.length > 0 && cursorOffset === value.length) {
        renderedValue += _chalk.default.inverse(' ');
      }
    }

    if (mask) {
      renderedValue = mask.repeat(renderedValue.length);
    }

    return _react.default.createElement(_ink.Color, {
      dim: !hasValue && placeholder
    }, placeholder ? hasValue ? renderedValue : placeholder : renderedValue);
  }

  componentDidMount() {
    const {
      stdin,
      setRawMode
    } = this.props;
    this.isMounted = true;
    setRawMode(true);
    stdin.on('data', this.handleInput);
  }

  componentWillUnmount() {
    const {
      stdin,
      setRawMode
    } = this.props;
    this.isMounted = false;
    stdin.removeListener('data', this.handleInput);
    setRawMode(false);
  }

}

_defineProperty(TextInput, "propTypes", {
  value: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string,
  focus: _propTypes.default.bool,
  mask: _propTypes.default.string,
  highlightPastedText: _propTypes.default.bool,
  showCursor: _propTypes.default.bool,
  stdin: _propTypes.default.object.isRequired,
  setRawMode: _propTypes.default.func.isRequired,
  onChange: _propTypes.default.func.isRequired,
  onSubmit: _propTypes.default.func
});

_defineProperty(TextInput, "defaultProps", {
  placeholder: '',
  showCursor: true,
  focus: true,
  mask: undefined,
  highlightPastedText: false,
  onSubmit: undefined
});

class TextInputWithStdin extends _react.PureComponent {
  render() {
    return _react.default.createElement(_ink.StdinContext.Consumer, null, ({
      stdin,
      setRawMode
    }) => _react.default.createElement(TextInput, _extends({}, this.props, {
      stdin: stdin,
      setRawMode: setRawMode
    })));
  }

}

exports.default = TextInputWithStdin;

class UncontrolledTextInput extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      value: ''
    });

    _defineProperty(this, "setValue", this.setValue.bind(this));
  }

  setValue(value) {
    this.setState({
      value
    });
  }

  render() {
    return _react.default.createElement(TextInputWithStdin, _extends({}, this.props, {
      value: this.state.value,
      onChange: this.setValue
    }));
  }

}

exports.UncontrolledTextInput = UncontrolledTextInput;
//# sourceMappingURL=index.js.map