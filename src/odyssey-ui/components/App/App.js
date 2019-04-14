// @flow
import React, {Component} from "react";
import {hot} from "react-hot-loader";
import superagent from "superagent";
import styles from "./App.scss";

import {Header} from "../Header/Header";
import {Sidebar} from "../Sidebar/Sidebar";
import {type ScoredEntity} from "../../../graphviz/OdysseyGraphViz";

import {OdysseyViz} from "../../../graphviz/OdysseyViz";
import {OdysseyInstance} from "../../../plugins/odyssey/model";

import MainBgIcon from "./img/main-bg.svg";

type AppState = {|
  entities: $ReadOnlyArray<ScoredEntity>,
  selectedEntity: ScoredEntity | null,
  isEditModeActive: boolean,
  instance: OdysseyInstance,
|};
class App extends Component<{}, AppState> {
  state = {
    entities: [],
    selectedEntity: null,
    isEditModeActive: false,
    instance: new OdysseyInstance(),
  };

  componentDidMount() {
    // =============> GET CATEGORIES
    // superagent
    //   .get('some_path')
    //   .then(res => {
    // this.setState({
    //   priorities: res.data
    // });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    //  this.setState({
    //      priorities: priorities,
    //    });
  }

  handleEntitySelection = (ev, entity) => {
    ev.preventDefault();

    this.setState({
      selectedEntity: entity,
    });
  };

  getCategoties = () => {
    const {entities} = this.state;

    const entries = entities.map((entity, index) => (
      <div
        key={index}
        className={styles.categoryItem}
        onClick={(ev) => this.handleEntitySelection(ev, entity)}
      >
        <div className={styles.categoryName}>{entity.name}</div>
        <div className={styles.categoryNum}>Cred {entity.score}</div>
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

  render() {
    const {selectedEntity, isEditModeActive} = this.state;

    return (
      <div className={styles.app}>
        <Header
          isEditModeActive={isEditModeActive}
          isCategoryActive={selectedEntity != null}
          changeMode={this.changeMode}
        />

        <div className={styles.priorities}>
          <h1 className={styles.prioritiesTitle}>Our projects priorities</h1>
          <div>{this.getCategoties()}</div>
        </div>

        {selectedEntity != null ? (
          <Sidebar
            activeCategoryName={selectedEntity.name}
            isEditModeActive={isEditModeActive}
            clearActiveCategory={this.clearActiveCategory}
          />
        ) : null}

        <div className={styles.chartContainer}>
          {selectedEntity != null ? (
            <h1 className={styles.exploringTitle}>
              <span>Exploring:</span>
              <span>{selectedEntity.name}</span>
            </h1>
          ) : null}
          <OdysseyViz instance={this.state.instance} />
        </div>

        <div className={styles.bgLayout}>
          <MainBgIcon />
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
