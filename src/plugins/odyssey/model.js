// @flow

/**
 * Core "model" logic for the Odyssey plugin.
 * Basically allows creating a data store of priorities, contributions, and people,
 * and compiling that data store into a cred Graph.
 */
import {
  Graph,
  EdgeAddress,
  NodeAddress,
  type NodeAddressT,
} from "../../core/graph";

import * as NullUtil from "../../util/null";

export type OdysseyEntityType = "PERSON" | "PRIORITY" | "CONTRIBUTION";

const NODE_PREFIX = NodeAddress.fromParts(["sourcecred", "odyssey"]);
export const NodePrefix = Object.freeze({
  base: NODE_PREFIX,
  person: NodeAddress.append(NODE_PREFIX, "PERSON"),
  priority: NodeAddress.append(NODE_PREFIX, "PRIORITY"),
  contribution: NodeAddress.append(NODE_PREFIX, "CONTRIBUTION"),
});

export const EdgePrefix = EdgeAddress.fromParts(["sourcecred", "odyssey"]);

export type OdysseyEntity = {|
  +type: OdysseyEntityType,
  +address: NodeAddressT,
  +name: string,
  +description: string,
|};

/**
 * Core data structure backing an Odyssey instance.
 * Right now we identify nodes by human-chosen name.
 * This is very convenient to implement but means that renaming will be a pain.
 * We should probably change it to use a more robust identifier system in the future.
 * (We will also want to give careful thought to how to reconcile multiple simultaneous
 * edits, again in the future.)
 */
export class OdysseyInstance {
  _graph: Graph;
  _addressToEntity: Map<NodeAddressT, OdysseyEntity>;
  _names: Set<string>;

  constructor() {
    this._graph = new Graph();
    this._names = new Set();
    this._addressToEntity = new Map();
  }

  addEntity(
    name: string,
    description: string,
    type: OdysseyEntityType
  ): OdysseyEntity {
    if (this.hasName(name)) {
      throw new Error(`Name conflict: ${name}`);
    }
    this._names.add(name);
    const address = NodeAddress.append(NODE_PREFIX, type, name);
    this._graph.addNode(address);
    const e: OdysseyEntity = {type, name, description, address};
    this._addressToEntity.set(address, e);
    return e;
  }

  *_entitiesOfPrefix(prefix: NodeAddressT): Iterator<OdysseyEntity> {
    for (const a of this._graph.nodes({prefix})) {
      yield NullUtil.get(this._addressToEntity.get(a));
    }
  }

  entities(): Iterator<OdysseyEntity> {
    return this._entitiesOfPrefix(NodePrefix.base);
  }

  // Returns whether the given name is present in the instance.
  // If it is, then no node with this name may be added.
  hasName(name: string): boolean {
    return this._names.has(name);
  }

  // Add a new Priority node. May error if this name was ever used before.
  addPriority(name: string, description: string): OdysseyEntity {
    return this.addEntity(name, description, "PRIORITY");
  }

  priorities(): Iterator<OdysseyEntity> {
    return this._entitiesOfPrefix(NodePrefix.priority);
  }

  // Add a new Person node. May error if this name was ever used before.
  addPerson(name: string, description: string): OdysseyEntity {
    return this.addEntity(name, description, "PERSON");
  }

  people(): Iterator<OdysseyEntity> {
    return this._entitiesOfPrefix(NodePrefix.person);
  }

  // Add a new Contribution node. May error if this name was ever used before.
  addContribution(name: string, description: string): OdysseyEntity {
    return this.addEntity(name, description, "CONTRIBUTION");
  }

  contributions(): Iterator<OdysseyEntity> {
    return this._entitiesOfPrefix(NodePrefix.contribution);
  }

  // Cred for these edge flows from src to dst.
  // So if e.g. a contribution was made by a person and supports a priority,
  // there should be an edge from Priority -> Contribution and from
  // Contribution -> Priority.
  addEdge(src: OdysseyEntity, dst: OdysseyEntity): OdysseyInstance {
    const edge = {
      src: src.address,
      dst: dst.address,
      address: EdgeAddress.append(EdgePrefix, src.name, dst.name),
    };
    this._graph.addEdge(edge);
    return this;
  }

  /**
   * Returns the graph underlying this instance.
   * You may use this Graph e.g. to run PageRank on the graph.
   * DO NOT MODIFY THIS GRAPH INDEPENDENTLY.
   * It is owned by the OdysseyInstance.
   * You can always make a copy if you want to make changes.
   * //TODO: Actually make a ReadOnly graph subtype.
   */
  graph(): Graph {
    return this._graph;
  }
}
