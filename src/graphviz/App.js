// @flow

import React from "react";

import type {Assets} from "../webutil/assets";
import type {LocalStore} from "../webutil/localStore";
import CheckedLocalStore from "../webutil/checkedLocalStore";
import BrowserLocalStore from "../webutil/browserLocalStore";
import Link from "../webutil/Link";
import * as d3 from "d3";
import {example} from "../plugins/odyssey/example";
import {PagerankGraph} from "../core/pagerankGraph";
import * as NullUtil from "../util/null";

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

  async componentDidMount() {
    const width = 1500;
    const height = 800;
    const svg = d3
      .select(this._rootNode)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    const chart = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const tooltip = d3
      .select(this._rootNode)
      .append("div")
      .attr("class", "toolTip")
      .style("display", "none")
      .style("position", "absolute")
      .style("min-width", "50px")
      .style("height", "auto")
      .style("background", "none repeat scroll 0 0 #ffffff");

    const nodesG = chart.append("g");
    const edgesG = chart.append("g");
    const textG = chart.append("g");

    const instance = example();
    const graph = instance.graph();
    const prg = new PagerankGraph(graph, (_unused_edge) => ({
      toWeight: 1,
      froWeight: 0.1,
    }));
    await prg.runPagerank({maxIterations: 100, convergenceThreshold: 1e-3});

    function mouseOver() {
      var data = d3.select(this).data()[0];
      var textDisplay = data.description;

      tooltip
        .style("left", d3.event.pageX - 10 + "px")
        .style("top", d3.event.pageY - 30 + "px")
        .style("display", "inline-block")
        .html(function() {
          return textDisplay;
        });
    }

    function mouseOff() {
      tooltip.style("display", "none");
    }

    const nodes = Array.from(instance.entities()).map((x) => ({
      score: NullUtil.get(prg.node(x.address)).score,
      ...x,
    }));

    let totalUserScore = 0;
    for (const {score, type} of nodes) {
      if (type === "PERSON") {
        totalUserScore += score;
      }
    }

    const links = Array.from(graph.edges()).map((e) => ({
      source: e.src,
      target: e.dst,
      address: e.address,
    }));

    function radius(d) {
      return (d.score / totalUserScore) * 120;
    }

    const ticked = () => {
      nodesG
        .selectAll(".node")
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        });

      textG
        .selectAll(".text")
        .attr("x", function(d) {
          return d.x + radius(d);
        })
        .attr("y", function(d) {
          return d.y + radius(d);
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
      .force("charge", d3.forceManyBody().strength(-380))
      .force(
        "link",
        d3
          .forceLink()
          .id((d) => d.address)
          .links(links)
          .distance(120)
      )
      .force(
        "collide",
        d3.forceCollide().radius(function(d) {
          return radius(d) * 2;
        })
      )
      .force("x", d3.forceX())
      .force("y", d3.forceY())
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
      .attr("class", "node")
      .on("mouseover", mouseOver)
      .on("mouseout", mouseOff);

    nodeSelection
      .merge(newNodes)
      .transition()
      .ease(d3.easeQuad)
      .duration(1000)
      .attr("fill", function(d) {
        switch (d.type) {
          case "PERSON":
            return "blue";
          case "PRIORITY":
            return "gold";
          case "CONTRIBUTION":
            return "green";
          default:
            return "red";
        }
      })
      .attr("r", radius);

    const textSelection = textG.selectAll(".text").data(nodes);
    textSelection
      .exit()
      .transition()
      .ease(d3.easeQuad)
      .duration(1000)
      .remove();
    const newTexts = textSelection
      .enter()
      .append("text")
      .attr("class", "text");

    textSelection
      .merge(newTexts)
      .transition()
      .ease(d3.easeQuad)
      .duration(1000)
      .text(function(d) {
        return d.name;
      })
      .attr("font-size", (d) => d.score * 300);

    // edge data join
    var edge = edgesG.selectAll(".edge").data(links);

    // edge exit
    edge.exit().remove();

    // edge enter
    var newEdge = edge
      .enter()
      .append("line")
      .attr("class", "edge");

    edge
      .merge(newEdge)
      .transition()
      .ease(d3.easeQuad)
      .duration(1000)
      .attr("marker-end", "url(#arrow)")
      .attr("stroke-width", function(d) {
        return "1";
      })
      .attr("stroke", function(d) {
        return "#666";
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
