import React from "react";
import {Colors, cssStyles} from "./styles.js";
import {StyleSheet, css} from "aphrodite/no-important";

export class AddEdge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      srcNode: null,
      dstNode: null,
    };
  }

  render() {
    const {entities} = this.props;
    const {srcNode, dstNode} = this.state;

    const addSrc = (e) => {
      const index = e.target.selectedIndex - 1;
      const entity = entities[index];
      console.log(entities);
      this.setState({srcNode: entity});
    };

    const addDst = (e) => {
      const index = e.target.selectedIndex - 1;
      const entity = entities[index];
      this.setState({dstNode: entity});
    };

    const addEdge = () => {
      if ((srcNode != null) & (dstNode != null)) {
        this.props.addEdge(srcNode, dstNode);
      }
    };

    return (
      <div>
        <h3>Add Edge </h3>
        <div className={css(cssStyles.row)}>
          <EntitySelect entities={entities} add={addSrc} />
        </div>
        <div className={css(cssStyles.row)}>
          <label>Depends on: </label>
        </div>
        <div className={css(cssStyles.row)}>
          <EntitySelect entities={entities} add={addDst} />
        </div>
        <div className={css(cssStyles.row)}>
          <button className={css(cssStyles.button)} onClick={addEdge}>
            ADD EDGE
          </button>
        </div>
      </div>
    );
  }
}

class EntitySelect extends React.Component {
  render() {
    const {entities, add} = this.props;

    return (
      <div>
        <select onChange={add} style={{minWidth: "200px", display: "block"}}>
          {
            <option key="choose entity" value="">
              --Choose Entity--
            </option>
          }
          {entities.map((entity, i) => (
            <option key={entity.name} value={entity.name}>
              {entity.type}: {entity.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
