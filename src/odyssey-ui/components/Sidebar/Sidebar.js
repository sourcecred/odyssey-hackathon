// @flow
import React, {Component} from "react";
import cx from "classnames";
import styles from "./Sidebar.scss";

import ArrowIcon from "./img/arrow.svg";

// REMOVE THIS:
const scoreboard = [
  {name: "IreneYung", num: "480.1"},
  {name: "ArtemS89", num: "223.1"},
  {name: "FrankLloyd", num: "124.1"},
  {name: "IreneYung", num: "223.1"},
  {name: "ArtemS89", num: "480.1"},
  {name: "FrankLloyd", num: "223.1"},
];

// REMOVE THIS:
const entities = [
  {name: "Contribute in team collaboration"},
  {name: "Meeting in the main hall"},
  {name: "Take two peaces of something"},
  {name: "Take the peacesof something"},
  {name: "Meeting in the main hall"},
  {name: "FranTake two peaces of somethingkLloyd"},
  {name: "FranTake two peaces of somethingkLloyd"},
];

export class Sidebar extends Component {
  state = {
    scoreboardList: [],
    entitiesList: [],
  };

  componentWillMount() {
    // =============> GET scoreboardList
    // superagent
    //   .post('some_path')
    //   .send({
    //     name: this.props.activeCategoryName
    //   })
    //   .then(res => {
    //     this.setState({
    //       scoreboardList: res.data
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    // REMOVE THIS:
    this.setState({
      scoreboardList: scoreboard,
    });

    // =============> GET entitiesList
    // superagent
    //   .post('some_path')
    //   .send({
    //     name: this.props.activeCategoryName
    //   })
    //   .then(res => {
    //     this.setState({
    //       entitiesList: res.data
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    // REMOVE THIS:
    this.setState({
      entitiesList: entities,
    });
  }

  getScoreboard = () => {
    const {scoreboardList} = this.state;

    return scoreboardList.map((currItem, index) => (
      <div key={index} className={styles.scoreboardItem}>
        <div className={styles.scoreboardName}>{currItem.name}</div>
        <div className={styles.scoreboardNum}>{currItem.num}</div>
      </div>
    ));
  };

  getEntities = () => {
    const {entitiesList} = this.state;

    return entitiesList.map((currItem, index) => (
      <div key={index} className={styles.entitiesItem}>
        {currItem.name}
      </div>
    ));
  };

  render() {
    const {isEditModeActive, clearActiveCategory} = this.props;

    return (
      <div className={styles.sidebar}>
        <div
          className={styles.returnBtn}
          onClick={(ev) => clearActiveCategory(ev)}
        >
          <ArrowIcon />
          Back to priorities
        </div>
        <div className={styles.divider} />
        <h1 className={styles.title}>
          {isEditModeActive ? "List of entities" : "Scoreboard"}
        </h1>
        {!isEditModeActive ? this.getScoreboard() : this.getEntities()}
      </div>
    );
  }
}
