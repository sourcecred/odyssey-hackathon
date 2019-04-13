// @flow

import React from "react";

import {type NodeAddressT, type Edge} from "../core/graph";
import type {Assets} from "../webutil/assets";
import type {LocalStore} from "../webutil/localStore";
import CheckedLocalStore from "../webutil/checkedLocalStore";
import BrowserLocalStore from "../webutil/browserLocalStore";
import Link from "../webutil/Link";
import * as d3 from "d3";
import {
  OdysseyInstance,
  type OdysseyEntityType,
} from "../plugins/odyssey/model";
import {example} from "../plugins/odyssey/example";
import {PagerankGraph} from "../core/pagerankGraph";
import * as NullUtil from "../util/null";

const BACKGROUND_COLOR = "#313131";
const EDGE_COLOR = "#111111";
const HALO_COLOR = "#90FF03";

const COLORS_BY_TYPE = {
  PERSON: ["#C4E2FF", "#2D88DC"],
  CONTRIBUTION: ["#FEBAFF", "#8600C6"],
  PRIORITY: ["#FFD3A0", "#FF8B03"],
};

const MAX_SIZE_PIXELS = 200;

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
    return <OdysseyViz instance={example()} />;
  }
}

export type OdysseyVizProps = {|
  +instance: OdysseyInstance,
|};
export type OdysseyVizState = {|
  +nodes: $ReadOnlyArray<ScoredEntity>,
  +edges: $ReadOnlyArray<Edge>,
  +selectedNode: ScoredEntity | null,
|};

export class OdysseyViz extends React.Component<
  OdysseyVizProps,
  OdysseyVizState
> {
  _pagerankGraph: PagerankGraph;

  constructor(props: OdysseyVizProps) {
    super(props);
    this._pagerankGraph = new PagerankGraph(
      this.props.instance.graph(),
      (_unused_edge) => ({toWeight: 1, froWeight: 0.1})
    );
    this.state = {
      edges: Array.from(this.props.instance.graph().edges()),
      nodes: this._computeNodes(),
      selectedNode: null,
    };
  }

  _computeNodes(): $ReadOnlyArray<ScoredEntity> {
    return Array.from(this.props.instance.entities()).map((x) => ({
      score: NullUtil.get(this._pagerankGraph.node(x.address)).score,
      ...x,
    }));
  }

  async componentDidMount() {
    await this._pagerankGraph.runPagerank({
      maxIterations: 100,
      convergenceThreshold: 1e-3,
    });
    const nodes = this._computeNodes();
    this.setState({nodes});
  }

  render() {
    const nodes = this.state.nodes;
    const edges = this.state.edges;
    const sn = this.state.selectedNode;
    let neighbors = [];
    return (
      <GraphViz
        nodes={nodes}
        edges={edges}
        selectedNode={this.state.selectedNode}
        onSelect={(selectedNode) => this.setState({selectedNode})}
      />
    );
  }
}

export type ScoredEntity = {|
  +address: NodeAddressT,
  +type: OdysseyEntityType,
  +score: number,
  +name: string,
  +description: string,
|};

export type GraphVizProps = {|
  +nodes: $ReadOnlyArray<ScoredEntity>,
  +edges: $ReadOnlyArray<Edge>,
  +selectedNode: ScoredEntity | null,
  +onSelect: (n: ScoredEntity) => void,
|};

// For graph visualization: inspiration and code from Ryan Morton:
// https://discourse.sourcecred.io/t/research-design-exploratory-data-analysis/67
// For React integration: this is a hacky mess based on the first approach described
// in this blog post: https://www.smashingmagazine.com/2018/02/react-d3-ecosystem/
export class GraphViz extends React.Component<GraphVizProps> {
  _rootNode: HTMLDivElement | null;
  simulation: any;
  _maxScore: number;

  _chart: any;
  _nodesG: any;
  _edgesG: any;
  _textG: any;
  _tooltip: any;
  _mouseOver: any;
  _mouseOff: any;
  _ticked: any;
  _selectedNodeHalo: any;
  _selectedNeighborHalo: any;

  _computeMax() {
    this._maxScore = -Infinity;
    for (const {score, type} of this.props.nodes) {
      if (score > this._maxScore) {
        this._maxScore = score;
      }
    }
  }

  _color(d: ScoredEntity) {
    const scoreRatio = d.score / this._maxScore;
    const colorEndpoints = COLORS_BY_TYPE[d.type];
    return d3.interpolate(...colorEndpoints)(scoreRatio);
  }

  _radius(d: ScoredEntity) {
    // Use the square of the score as radius, so area will be proportional to score
    const v = Math.sqrt((d.score / this._maxScore) * MAX_SIZE_PIXELS);
    if (!isFinite(v)) {
      throw new Error("bad radius");
    }
    return v;
  }

  _setupScaffold() {
    const svg = d3
      .select(this._rootNode)
      .append("svg")
      .style("flex-grow", 1);
    const rect = svg.node().getBoundingClientRect();
    this._chart = svg
      .append("g")
      .attr("transform", `translate(${rect.width / 2}, ${rect.height / 2})`);
    this._tooltip = d3
      .select(this._rootNode)
      .append("div")
      .attr("class", "toolTip")
      .style("display", "none")
      .style("position", "absolute")
      .style("min-width", "50px")
      .style("height", "auto")
      .style("background", "none repeat scroll 0 0 #ffffff");

    this._edgesG = this._chart.append("g");
    this._selectedNodeHalo = this._chart.append("g");
    this._selectedNeighborHalo = this._chart.append("g");
    this._nodesG = this._chart.append("g");
    this._textG = this._chart.append("g");

    const that = this;
    this._mouseOver = function() {
      var data = d3.select(this).data()[0];
      var textDisplay = data.score;

      that._tooltip
        .style("left", d3.event.pageX - 10 + "px")
        .style("top", d3.event.pageY - 30 + "px")
        .style("display", "inline-block")
        .html(() => {
          return `${data.name}: ${data.description}`;
        });
    };

    this._mouseOff = () => {
      this._tooltip.style("display", "none");
    };

    this._ticked = () => {
      this._nodesG
        .selectAll(".node")
        .attr("cx", (d) => {
          return d.x;
        })
        .attr("cy", (d) => {
          return d.y;
        });

      this._selectedNodeHalo
        .selectAll(".halo")
        // The hack is strong with this one!!
        .attr(
          "cx",
          this.props.selectedNode ? (this.props.selectedNode: any).x : 0
        )
        .attr(
          "cy",
          this.props.selectedNode ? (this.props.selectedNode: any).y : 0
        );

      this._selectedNeighborHalo
        .selectAll(".halo-neighbor")
        // The hack is strong with this one!!
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      this._textG
        .selectAll(".text")
        .attr("x", (d) => {
          return d.x + this._radius(d) + 5;
        })
        .attr("y", (d) => {
          return d.y + 5;
        });

      //TODO: fix arrow marker by moving back based on the node radius
      this._edgesG
        .selectAll(".edge")
        .attr("x1", (d) => {
          return d.source.x;
        })
        .attr("y1", (d) => {
          return d.source.y;
        })
        .attr("x2", (d) => {
          return d.target.x;
        })
        .attr("y2", (d) => {
          return d.target.y;
        });
    };
  }

  _updateSelectedHalo() {
    // hello mr. hack
    const selectedNode: any = this.props.selectedNode || {
      x: 0,
      y: 0,
      type: "PRIORITY",
      address: "",
      score: 0,
      description: "",
      name: "hacky phantom node",
    };
    const data = this.props.selectedNode == null ? [] : [1, 2, 3];
    const haloSelection = this._selectedNodeHalo.selectAll(".halo").data(data);
    haloSelection
      .exit()
      .transition()
      .ease(d3.easeQuad)
      .duration(1000)
      .remove();

    const newNodes = haloSelection
      .enter()
      .append("circle")
      .attr("class", "halo");

    haloSelection
      .merge(newNodes)
      .attr("stroke", HALO_COLOR)
      .attr("cx", selectedNode.x)
      .attr("cy", selectedNode.y)
      .attr("stroke-width", 1)
      .attr("opacity", (d) => 1 / (2 * d))
      .attr("fill", "none")
      .attr("r", 0)
      .transition()
      .ease(d3.easeQuad)
      .duration(500)
      .attr("r", (d) => this._radius(selectedNode) + 2 + d * d);
  }

  _updateSelectedNeighborHalo(links: any) {
    const selectedNeighbors = [];
    const seenNeighborAddresses = new Set();
    if (this.props.selectedNode != null) {
      const snAddr = this.props.selectedNode.address;
      for (const {source, target} of links) {
        let neighbor = null;
        if (snAddr == source.address) {
          neighbor = target;
        }
        if (snAddr == target.address) {
          neighbor = source;
        }
        if (
          neighbor != null &&
          !seenNeighborAddresses.has(neighbor.address) &&
          snAddr !== neighbor
        ) {
          seenNeighborAddresses.add(neighbor.address);
          selectedNeighbors.push(neighbor);
        }
      }
    }
    const haloNeighborSelection = this._selectedNeighborHalo
      .selectAll(".halo-neighbor")
      .data(selectedNeighbors);
    haloNeighborSelection
      .exit()
      .transition()
      .ease(d3.easeQuad)
      .duration(1000)
      .remove();

    const newNodes = haloNeighborSelection
      .enter()
      .append("circle")
      .attr("class", "halo-neighbor");

    haloNeighborSelection
      .merge(newNodes)
      .attr("stroke", HALO_COLOR)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("stroke-width", 1)
      .attr("opacity", (d) => 1 / 2)
      .attr("fill", "none")
      .attr("r", 0)
      .transition()
      .ease(d3.easeQuad)
      .duration(500)
      .attr("r", (d) => this._radius(d) + 3);
  }

  _updateD3() {
    this._computeMax();
    const links = this.props.edges.map((e) => ({
      source: e.src,
      target: e.dst,
      address: e.address,
    }));

    this.simulation = d3
      .forceSimulation(this.props.nodes)
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
        d3.forceCollide().radius((d) => {
          return this._radius(d) * 2;
        })
      )
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", this._ticked);

    const nodeSelection = this._nodesG
      .selectAll(".node")
      .data(this.props.nodes);
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
      .on("mouseover", this._mouseOver)
      .on("mouseout", this._mouseOff)
      .on("click", (d) => {
        this.props.onSelect(d);
      });

    nodeSelection
      .merge(newNodes)
      .transition()
      .ease(d3.easeQuad)
      .duration(1000)
      .attr("fill", this._color.bind(this))
      .attr("r", this._radius.bind(this));

    const textSelection = this._textG.selectAll(".text").data(this.props.nodes);
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
      .text((d) => {
        return Math.floor(d.score * 1000);
      })
      .attr("fill", this._color.bind(this))
      .attr("font-size", 14);

    // edge data join
    var edge = this._edgesG.selectAll(".edge").data(links);

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
      .attr("stroke-width", () => {
        return "1px";
      })
      .attr("opacity", "0.4")
      .attr("stroke", (d) => {
        const sn = this.props.selectedNode;
        if (sn) {
          if (
            d.source.address === sn.address ||
            d.target.address === sn.address
          ) {
            return HALO_COLOR;
          }
        }
        return EDGE_COLOR;
      });

    this._updateSelectedHalo();
    this._updateSelectedNeighborHalo(links);
  }

  componentDidMount() {
    this._setupScaffold();
    this._updateD3();
  }

  componentDidUpdate() {
    this._updateD3();
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
