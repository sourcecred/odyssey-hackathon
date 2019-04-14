// @flow
import React, {Component} from "react";
import {hot} from "react-hot-loader";
import superagent from "superagent";
import styles from "./App.scss";

import {Header} from "../Header/Header";
import {Sidebar} from "../Sidebar/Sidebar";

import MainBgIcon from "./img/main-bg.svg";

export type ScoredPriority = {|
  +name: string,
  +num: string,
|};
const priorities: ScoredPriority[] = [
  {name: "Logistics", num: "480.1"},
  {name: "Hachathon", num: "223.1"},
  {name: "Development", num: "124.1"},
  {name: "Design", num: "223.1"},
  {name: "UX part", num: "480.1"},
  {name: "Frontend", num: "223.1"},
];

type AppState = {|
  priorities: ScoredPriority[],
  isCategoryActive: boolean,
  activeCategoryName: string,
  isEditModeActive: boolean,
|};
class App extends Component<{}, AppState> {
  state = {
    priorities: [],
    isCategoryActive: false,
    activeCategoryName: "",
    isEditModeActive: false,
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

    this.setState({
      priorities: priorities,
    });
  }

  handleCategoryClick = (ev, categoryName) => {
    ev.preventDefault();

    this.setState({
      isCategoryActive: true,
      activeCategoryName: categoryName,
    });
  };

  getCategoties = () => {
    const {priorities} = this.state;

    return priorities.map((currEl, index) => (
      <div
        key={index}
        className={styles.categoryItem}
        onClick={(ev) => this.handleCategoryClick(ev, currEl.name)}
      >
        <div className={styles.categoryName}>{currEl.name}</div>
        <div className={styles.categoryNum}>Cred {currEl.num}</div>
      </div>
    ));
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
      isCategoryActive: false,
      isEditModeActive: false,
    });
  };

  render() {
    const {isCategoryActive, activeCategoryName, isEditModeActive} = this.state;

    return (
      <div className={styles.app}>
        <Header
          isEditModeActive={isEditModeActive}
          isCategoryActive={isCategoryActive}
          changeMode={this.changeMode}
        />

        <div className={styles.priorities}>
          <h1 className={styles.prioritiesTitle}>Our projects priorities</h1>
          <div>{this.getCategoties()}</div>
        </div>

        {isCategoryActive ? (
          <Sidebar
            activeCategoryName={activeCategoryName}
            isEditModeActive={isEditModeActive}
            clearActiveCategory={this.clearActiveCategory}
          />
        ) : null}

        <div className={styles.chartContainer}>
          {isCategoryActive ? (
            <h1 className={styles.exploringTitle}>
              <span>Exploring:</span>
              <span>{activeCategoryName}</span>
            </h1>
          ) : null}
        </div>

        <div className={styles.bgLayout}>
          <MainBgIcon />
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
