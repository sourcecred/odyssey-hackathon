// @flow
import React, {Component} from "react";
import cx from "classnames";
import styles from "./Header.scss";

import LogoIcon from "./img/logo.svg";
import ConfigIcon from "./img/config.svg";
import WatchIcon from "./img/watch.svg";
import EditIcon from "./img/edit.svg";

export class Header extends Component {
  render() {
    const {isEditModeActive, isCategoryActive, changeMode} = this.props;

    return (
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logo}>OpenSourceProject</div>
          <div className={styles.name}>
            <span>SourceCred</span>
            <LogoIcon />
          </div>
        </div>

        {isCategoryActive ? (
          <div className={styles.mode}>
            <span>Mode</span>
            <WatchIcon
              className={cx(styles.watchIcon, {
                [styles.activeMode]: !isEditModeActive,
              })}
              onClick={(ev) => changeMode(ev, false)}
            />
            <EditIcon
              className={cx(styles.editIcon, {
                [styles.activeMode]: isEditModeActive,
              })}
              onClick={(ev) => changeMode(ev, true)}
            />
          </div>
        ) : null}

        <div className={styles.config}>
          Configure weights
          <ConfigIcon />
        </div>
      </div>
    );
  }
}
