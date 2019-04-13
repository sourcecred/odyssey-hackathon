// @flow

import React from "react";

import type {Assets} from "../webutil/assets";
import type {LocalStore} from "../webutil/localStore";
import CheckedLocalStore from "../webutil/checkedLocalStore";
import BrowserLocalStore from "../webutil/browserLocalStore";
import Link from "../webutil/Link";
import * as d3 from "d3";

export class AppPage extends React.Component<{|
  +assets: Assets,
|}> {
  static _LOCAL_STORE = new CheckedLocalStore(
    new BrowserLocalStore({
      version: "2",
      keyPrefix: "cred-explorer",
    })
  );

  render() {
    return <GraphViz _rootNode={null} />;
  }
}

export class GraphViz extends React.Component<{}> {
  _rootNode: HTMLDivElement | null;

  componentDidMount() {
    const svg = d3
      .select(this._rootNode)
      .append("svg")
      .attr("width", 700)
      .attr("height", 700);
    svg
      .append("circle")
      .attr("cx", 20)
      .attr("cy", 30)
      .attr("r", 3);
  }

  componentDidUpdate() {
    return;
  }

  componentWillUnmount() {
    return;
  }

  _setRef(componentNode: HTMLDivElement | null) {
    this._rootNode = componentNode;
  }

  render() {
    return <div className="graph-container" ref={this._setRef.bind(this)} />;
  }
}
