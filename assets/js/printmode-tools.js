// Import bootstrap
import "bootstrap";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html";

// Import react
import React from "react";
import ReactDOM from "react-dom";

// Import react-chartjs-2 to configure defaults
import { defaults } from "react-chartjs-2";
defaults.font.family = "Fira Sans";
defaults.font.size = 16;

// Import local dependencies
import App from "./printmode-tools/App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("printmode-tools")
);
