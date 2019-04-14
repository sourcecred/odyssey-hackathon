// @flow
import React from "react";
import ReactDOM from "react-dom";
import {AppContainer} from "react-hot-loader";
import "./index.scss";

import App from "components/App/App";

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("root")
  );
};

render(App);

// webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./components/App/App", () => {
    // if you are using harmony modules ({modules:false})
    render(App);
    // in all other cases - re-require App manually
    render(require("./components/App/App"));
  });
}
