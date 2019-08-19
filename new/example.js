"use strict";

var _react = _interopRequireDefault(require("react"));

var _ink = require("ink");

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Example() {
  const [input0, input0Set] = _react.default.useState('');

  const [input1, input1Set] = _react.default.useState('');

  const [focus, focusSet] = _react.default.useState(0);

  const [focusPrior, focusPriorSet] = _react.default.useState(false);

  const handleSubmit = (finalInput, {
    focusPrior
  }) => {
    focusPriorSet(focusPrior);

    if (focus === 0) {
      input0Set(finalInput);
    } else {
      input1Set(finalInput);
    }

    if (focusPrior && focus > 0) {
      focusSet(n => n - 1);
    } else {
      focusSet(n => n + 1);
    }
  };

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_ink.Box, {
    minHeight: 1
  }, "focusPrior: ", String(focusPrior)), _react.default.createElement(_ink.Box, {
    minHeight: 1
  }, focus === 0 ? _react.default.createElement(_index.default, {
    value: input0,
    onChange: input0Set,
    onSubmit: handleSubmit
  }) : String(input0)), _react.default.createElement(_ink.Box, {
    minHeight: 1
  }, focus === 1 ? _react.default.createElement(_index.default, {
    value: input1,
    onChange: input1Set,
    onSubmit: handleSubmit
  }) : String(input1)));
}

(0, _ink.render)(_react.default.createElement(Example, null), {
  debug: true
});
//# sourceMappingURL=example.js.map