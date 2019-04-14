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
  NodePrefix,
} from "../plugins/odyssey/model";
import {example} from "../plugins/odyssey/example";
import {PagerankGraph} from "../core/pagerankGraph";
import * as NullUtil from "../util/null";

import {OdysseyGraphViz} from "./OdysseyGraphViz";
import type {ScoredEntity} from "./OdysseyGraphViz";

export type OdysseyVizProps = {|
  +instance: OdysseyInstance,
|};
export type OdysseyVizState = {|
  +nodes: $ReadOnlyArray<ScoredEntity>,
  +edges: $ReadOnlyArray<Edge>,
  +selectedNode: NodeAddressT | null,
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
    const selectedNodes = Array.from(
      this.props.instance.graph().nodes({prefix: NodePrefix.priority})
    );
    const seed = {type: "SELECTED_SEED", selectedNodes, alpha: 0.3};
    await this._pagerankGraph.runPagerank(seed, {
      maxIterations: 100,
      convergenceThreshold: 1e-3,
    });
    const nodes = this._computeNodes();
    this.setState({nodes});
  }

  async updateSelectedNode(node: NodeAddressT) {
    this.setState({selectedNode: node});
    const seed = {
      type: "SELECTED_SEED",
      selectedNodes: [node],
      alpha: 0.3,
    };
    await this._pagerankGraph.runPagerank(seed, {
      maxIterations: 100,
      convergenceThreshold: 1e-3,
    });
    const nodes = this._computeNodes();
    console.log("about to apply PRG changes");
    this.setState({nodes});
  }

  render() {
    const nodes = this.state.nodes;
    const edges = this.state.edges;
    return (
      <OdysseyGraphViz
        nodes={nodes}
        edges={edges}
        selectedNode={this.state.selectedNode}
        onSelect={(selectedNode) => this.updateSelectedNode(selectedNode)}
      />
    );
  }
}
