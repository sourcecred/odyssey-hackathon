// @flow
import React, {Component} from "react";
import cx from "classnames";
import styles from "./Header.scss";

import LogoIcon from "./img/logo.svg";
import BeaconIcon from "./img/beacon.svg";
import ConfigIcon from "./img/config.svg";
import WatchIcon from "./img/watch.svg";
import EditIcon from "./img/edit.svg";

export type Props = {|
  +highlightHomeButton: boolean,
  +resetSelection: Function,
|};
export class Header extends Component<Props> {
  render() {
    const {resetSelection} = this.props;

    return (
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logo} />
          <div className={styles.name}>
            <span>SourceCred</span>
            <LogoIcon />
          </div>
        </div>

        <div
          onClick={() => this.props.resetSelection()}
          className={cx(styles.config, {
            [styles.active]: this.props.highlightHomeButton,
          })}
        >
          Home
          <BeaconIcon />
        </div>
      </div>
    );
  }
}
