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

const BACKGROUND_COLOR = "#313131";
const INTERPOLATE_LOW = "#00ABE1";
const INTERPOLATE_HIGH = "#90FF03";
const EDGE_COLOR = "#111111";

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
    const svg = d3
      .select(this._rootNode)
      .append("svg")
      .style("flex-grow", 1);
    const rect = svg.node().getBoundingClientRect();
    const chart = svg
      .append("g")
      .attr("transform", `translate(${rect.width / 2}, ${rect.height / 2})`);

    const tooltip = d3
      .select(this._rootNode)
      .append("div")
      .attr("class", "toolTip")
      .style("display", "none")
      .style("position", "absolute")
      .style("min-width", "50px")
      .style("height", "auto")
      .style("background", "none repeat scroll 0 0 #ffffff");

    const edgesG = chart.append("g");
    const nodesG = chart.append("g");
    const textG = chart.append("g");

    const instance = example();
    const graph = instance.graph();
    const prg = new PagerankGraph(graph, (_unused_edge) => ({
      toWeight: 1,
      froWeight: 0.1,
    }));
    await prg.runPagerank({maxIterations: 100, convergenceThreshold: 1e-3});

    function colorFor(d) {
      const scoreRatio = d.score / maxScore;
      return d3.interpolate(INTERPOLATE_LOW, INTERPOLATE_HIGH)(scoreRatio);
    }

    function mouseOver() {
      var data = d3.select(this).data()[0];
      var textDisplay = data.score;

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

    let minScore = Infinity;
    let maxScore = -Infinity;
    for (const {score} of nodes) {
      if (score < minScore) {
        minScore = score;
      }
      if (score > maxScore) {
        maxScore = score;
      }
    }

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
      return Math.sqrt((d.score / maxScore) * 200);
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
      .attr("fill", colorFor)
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
        return Math.floor(d.score * 1000);
      })
      .attr("fill", colorFor);
    //.attr("font-size", (d) => d.score * 300);

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
        return "1px";
      })
      .attr("opacity", "0.4")
      .attr("stroke", function(d) {
        return EDGE_COLOR;
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
    return (
      <div
        style={{
          backgroundColor: BACKGROUND_COLOR,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
        className="graph-container"
        ref={this._setRef.bind(this)}
      />
    );
  }
}
