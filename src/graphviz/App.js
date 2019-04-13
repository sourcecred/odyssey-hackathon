// @flow

import React from "react";

import type {Assets} from "../webutil/assets";
import type {LocalStore} from "../webutil/localStore";
import CheckedLocalStore from "../webutil/checkedLocalStore";
import BrowserLocalStore from "../webutil/browserLocalStore";
import Link from "../webutil/Link";
import * as d3 from "d3";
import {example} from "../plugins/odyssey/example";

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
  simulation: any;

  componentDidMount() {
    const width = 1000;
    const height = 1000;
    const svg = d3
      .select(this._rootNode)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    const chart = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const nodesG = chart.append("g");
    const edgesG = chart.append("g");

    const instance = example();
    const graph = instance.graph();
    const nodes = Array.from(instance.entities());

    const links = Array.from(graph.edges()).map((e) => ({
      source: e.src,
      target: e.dst,
      address: e.address,
    }));

    const ticked = () => {
      nodesG
        .selectAll(".node")
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        });

      //TODO: fix arrow marker by moving back based on the node radius
      edgesG
        .selectAll(".edge")
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });
    };
    this.simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody(-30))
      .force(
        "link",
        d3
          .forceLink()
          .id((d) => d.address)
          .links(links)
          .distance(30)
      )
      .force("collide", d3.forceCollide().radius(5))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .alphaTarget(1)
      .on("tick", ticked);

    const nodeSelection = nodesG.selectAll(".node").data(nodes);
    nodeSelection
      .exit()
      .transition()
      .ease(d3.easeQuad)
      .duration(1000)
      .remove();
    const newNodes = nodeSelection
      .enter()
      .append("circle")
      .attr("class", "node");
    nodeSelection
      .merge(newNodes)
      .transition()
      .ease(d3.easeQuad)
      .duration(1000)
      .attr("fill", function(d) {
        return "steelblue";
      })
      .attr("r", function(d) {
        return 5;
      });
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
