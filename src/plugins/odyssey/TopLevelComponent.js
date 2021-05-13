import React from "react";
import {StyleSheet, css} from "aphrodite/no-important";
import {Styles, Colors, colorForType} from "./styles.js";
import {OdysseyInstance} from "./model";
import {EntryForm} from "./EntryForm";
import {AddEdge} from "./AddEdge";

export class TopLevelComponent extends React.Component {
  state = {
    type: "PERSON",
    name: "",
    description: "",
    entities: [],
    model: new OdysseyInstance(),
  };

  render() {
    const {
      type,
      name,
      description,
      dstNodes,
      srcNodes,
      entities,
      model,
    } = this.state;

    const addEdge = (srcNode, dstNode) => {
      model.addEdge(srcNode, dstNode);
      const edges = Array.from(model.graph().edges());
      console.log(edges);
    };

    const createNode = (e) => {
      e.preventDefault();
      if (model.hasName(e.name)) {
        return;
      }

      const newEntity = model.addEntity(name, description, type);
      const entities = Array.from(model.entities()).sort();

      this.setState({
        entities,
        name: "",
        description: "",
      }); // to get data to reload
    };

    return (
      <div style={{display: "flex"}}>
        <div
          style={{
            color: "white",
            width: "30vw",
            background: Colors.primaryBlack,
            padding: "20px",
            height: "100vh",
          }}
        >
          <EntryForm
            type={type}
            name={name}
            description={description}
            handleSubmit={createNode}
            entities={entities}
            updateType={(type) => {
              this.setState({type});
            }}
            updateName={(e) => {
              this.setState({name: e.target.value});
            }}
            updateDescription={(e) => {
              this.setState({description: e.target.value});
            }}
          />
          <div style={{height: "25px"}} />
          <AddEdge entities={entities} addEdge={addEdge} />
        </div>
        <div
          style={{
            flex: 1,
            height: "100vh",
            overflow: "auto",
            background: "red",
            padding: "20px",
          }}
        >
          {" "}
          <GraphSpace model={model} />
        </div>
      </div>
    );
  }
}

class GraphSpace extends React.Component {
  render() {
    const {model} = this.props.model;

    return <div>Something</div>;
  }
}
