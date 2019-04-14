// @flow
import React, {Component} from "react";
import {hot} from "react-hot-loader";
import superagent from "superagent";
import styles from "./App.scss";

import {Header} from "../Header/Header";
import {type ScoredEntity} from "../../../graphviz/OdysseyGraphViz";
import {PagerankGraph} from "../../../core/pagerankGraph";
import {type NodeAddressT, type Edge} from "../../../core/graph";

import {OdysseyGraphViz} from "../../../graphviz/OdysseyGraphViz";
import {OdysseyInstance, NodePrefix} from "../../../plugins/odyssey/model";
import {example, commonStackExample} from "../../../plugins/odyssey/example";
import * as NullUtil from "../../../util/null";

import MainBgIcon from "./img/main-bg.svg";

type AppProps = {|
  //+instance: OdysseyInstance,
|};

type AppState = {|
  entities: $ReadOnlyArray<ScoredEntity>,
  selectedEntity: ScoredEntity | null,
  isEditModeActive: boolean,
  highlightedNode: NodeAddressT | null,
|};

class App extends Component<AppProps, AppState> {
  _pagerankGraph: PagerankGraph;
  _instance: OdysseyInstance;

  constructor(props) {
    super(props);
    this._instance = commonStackExample();
    this._pagerankGraph = new PagerankGraph(
      this._instance.graph(),
      (_unused_edge) => ({toWeight: 1, froWeight: 0.1})
    );
    this.state = {
      entities: this._computeNodes(),
      selectedEntity: null,
      highlightedNode: null,
      isEditModeActive: false,
    };
  }

  _computeNodes(): $ReadOnlyArray<ScoredEntity> {
    const entities = Array.from(this._instance.entities()).map((x) => ({
      score: NullUtil.get(this._pagerankGraph.node(x.address)).score,
      ...x,
    }));
    let totalUserScore = 0;
    for (const {score, type} of entities) {
      if (type === "PERSON") {
        totalUserScore += score;
      }
    }
    return entities.map((x) => ({
      ...x,
      score: (x.score / totalUserScore) * 1000,
    }));
  }

  async componentDidMount() {
    await this.defaultPagerank();
  }

  async defaultPagerank() {
    const selectedNodes = Array.from(
      this._instance.graph().nodes({prefix: NodePrefix.priority})
    );
    await this.rerunPagerankFor(selectedNodes);
  }

  async unselect() {
    this.setState({selectedEntity: null});
    await this.defaultPagerank();
  }

  async rerunPagerankFor(selectedNodes: NodeAddressT[]) {
    const seed = {type: "SELECTED_SEED", selectedNodes, alpha: 0.3};
    await this._pagerankGraph.runPagerank(seed, {
      maxIterations: 100,
      convergenceThreshold: 1e-3,
    });
    const entities = this._computeNodes();
    this.setState({entities});
  }

  handleEntitySelection = async (ev, entity) => {
    ev.preventDefault();

    this.setState({
      selectedEntity: entity,
    });
    await this.rerunPagerankFor([entity.address]);
  };

  getCategoties = (filterType) => {
    const {entities} = this.state;

    const entries = entities
      .filter(({type}) => type === filterType)
      .sort((a, b) => b.score - a.score)
      .map((entity, index) => (
        <div
          key={index}
          className={styles.categoryItem}
          onClick={(ev) => this.handleEntitySelection(ev, entity)}
        >
          <div className={styles.categoryName}>{entity.name}</div>
          <div className={styles.categoryNum}>{entity.score.toFixed(0)} ¤</div>
        </div>
      ));

    return <React.Fragment>{entries}</React.Fragment>;
  };

  changeMode = (ev, isEditModeActive) => {
    ev.preventDefault();

    this.setState({
      isEditModeActive: isEditModeActive,
    });
  };

  clearActiveCategory = (ev) => {
    ev.preventDefault();

    this.setState({
      selectedEntity: null,
    });
  };

  updateSelectedNode(node: NodeAddressT) {
    this.setState({highlightedNode: node});
  }

  render() {
    const {selectedEntity, isEditModeActive} = this.state;

    return (
      <div className={styles.app}>
        <Header
          highlightHomeButton={this.state.selectedEntity != null}
          resetSelection={() => this.unselect()}
        />

        <div className={styles.entitiesContainer}>
          <div className={styles.priorities}>
            <h1 className={styles.prioritiesTitle}>Our Values</h1>
            <div>{this.getCategoties("PRIORITY")}</div>
          </div>

          <div className={styles.priorities}>
            <h1 className={styles.prioritiesTitle}>Our People</h1>
            <div>{this.getCategoties("PERSON")}</div>
          </div>
        </div>

        <div className={styles.chartContainer}>
          {selectedEntity != null ? (
            <div>
              <h1 className={styles.exploringTitle}>
                <span>Exploring:</span>
                <span>{selectedEntity.name}</span>
              </h1>
            </div>
          ) : null}
          <OdysseyGraphViz
            nodes={this.state.entities}
            edges={Array.from(this._instance.graph().edges())}
            selectedNode={this.state.highlightedNode}
            onSelect={(selectedNode) => this.updateSelectedNode(selectedNode)}
          />
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
