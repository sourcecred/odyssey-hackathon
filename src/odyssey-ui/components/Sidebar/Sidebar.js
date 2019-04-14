// @flow
import React, {Component, type Node as ReactNode} from "react";
import cx from "classnames";
import styles from "./Sidebar.scss";

import ArrowIcon from "./img/arrow.svg";

export type SidebarProps = {|
  +isEditModeActive: boolean,
  +clearActiveCategory: Function,
  +activeCategoryName: string,
|};
export type SidebarState = {|
  scoreboardList: Array<Object>,
  entitiesList: Array<Object>,
|};
