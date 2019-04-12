// @flow

import React from "react";
import {StyleSheet, css} from "aphrodite/no-important";
import {Colors, Styles, colorForType, cssStyles} from "./styles.js";
import type {OdysseyEntity, OdysseyEntityType} from "./model";

export type EntryFormProps = {|
  +type: OdysseyEntityType,
  +name: string,
  +description: string,
  +entities: [OdysseyEntity],
  +handleSubmit: Function,
  +updateType: Function,
  +updateName: Function,
  +updateDescription: Function,
|};

export class EntryForm extends React.Component<EntryFormProps> {
  render() {
    const {
      type,
      name,
      description,
      handleSubmit,
      entities,
      updateType,
      updateName,
      updateDescription,
    } = this.props;
    const entityTypes = ["PERSON", "PRIORITY", "CONTRIBUTION"];

    const nodeList = (list) => (
      <div className={css(cssStyles.row)}>
        {list.map((x) => (
          <ul key={x.name} style={{color: colorForType(x.type)}}>
            {" "}
            {x.name}{" "}
          </ul>
        ))}
      </div>
    );

    const nodeSelected = (e) => {
      updateType(entityTypes[e.target.selectedIndex]);
    };

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <h3>Add Node </h3>
          <div className={css(cssStyles.row)}>
            <label style={{color: "white"}}>Entity Type: </label>
            <select
              onChange={nodeSelected}
              style={{marginLeft: "15px", width: "100px"}}
            >
              {entityTypes.map((e) => (
                <option onChange={nodeSelected} key={e} value={e}>
                  {e.toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className={css(cssStyles.row)}>
            <label>Name: </label>
            <input
              value={name}
              onChange={updateName}
              className={css(cssStyles.input)}
            />
          </div>
          <div className={css(cssStyles.row)}>
            <label>description: </label>
            <input
              value={description}
              onChange={updateDescription}
              className={css(cssStyles.input)}
            />
          </div>
          <div className={css(cssStyles.row)}>
            <button className={css(cssStyles.button)}>ADD NODE</button>
          </div>
        </form>
      </div>
    );
  }
}
