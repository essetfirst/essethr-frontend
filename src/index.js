import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";

import "./index.css";

import App from "./App";

// Barcode reader
(function () {
  var _timeoutHandler = 0,
    _inputString = "",
    _onKeypress = function (e) {
      if (_timeoutHandler) {
        clearTimeout(_timeoutHandler);
      }
      _inputString += e.key;

      _timeoutHandler = setTimeout(function () {
        if (_inputString.length <= 3) {
          _inputString = "";
          return;
        }
        console.log(
          "Before dispatch: ",
          String(_inputString).replace(/Enter/, "")
        );
        window.dispatchEvent(
          new CustomEvent("barcodescanned", {
            detail: {
              code: String(_inputString).replace(/Enter/, "") || _inputString,
            },
          })
        );

        // $(e.target).trigger("barcodescanned", _inputString);

        _inputString = "";
      }, 20);
    };
  window.addEventListener("keypress", _onKeypress);
  // $(document).on({
  //   keypress: _onKeypress,
  // });
})();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
