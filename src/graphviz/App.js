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
import {OdysseyViz} from "./OdysseyViz";

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
