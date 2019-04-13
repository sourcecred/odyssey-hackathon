// @flow

import {OdysseyInstance, EdgePrefix} from "./model";
import deepEqual from "lodash.isequal";
import {EdgeAddress} from "../../core/graph";

describe("plugins/odyssey/model", () => {
  const example = () => {
    const instance = new OdysseyInstance();
    const expectedEntities = [];

    // Add people
    const me = instance.addPerson("me", "the author of the code");
    expectedEntities.push(me);
    // You can add an entity using the generic API if you prefer
    const myPartner = instance.addEntity(
      "my partner",
      "a wonderful human being",
      "PERSON"
    );
    expectedEntities.push(myPartner);

    // Add some priorities
    const hackathonPriority = instance.addPriority(
      "hackathon",
      "it's what we're working on"
    );
    expectedEntities.push(hackathonPriority);
    const testingPriority = instance.addPriority(
      "testing",
      "it's very important"
    );
    expectedEntities.push(testingPriority);

    // Add contributions
    const odysseyModule = instance.addContribution(
      "odyssey/model.js",
      "some nice looking source code"
    );
    expectedEntities.push(odysseyModule);
    const thisFile = instance.addContribution(
      "odyssey/model.test.js",
      "a very fine test file"
    );
    expectedEntities.push(thisFile);

    // Helper function to make it easy to check the edges
    const expectedEdges = [];
    function addEdge(src, dst) {
      instance.addEdge(src, dst);
      expectedEdges.push({src, dst});
    }

    // Relate priorities to other entities
    addEdge(hackathonPriority, testingPriority);
    addEdge(testingPriority, thisFile);
    addEdge(hackathonPriority, odysseyModule);

    // Connect files to their authors
    addEdge(thisFile, me);
    addEdge(odysseyModule, me);

    // Connect files to their src code dependencies
    addEdge(thisFile, odysseyModule);

    // Also, I was supported by my partner
    addEdge(me, myPartner);

    return {
      instance,
      me,
      myPartner,
      hackathonPriority,
      testingPriority,
      thisFile,
      odysseyModule,
      expectedEdges,
      expectedEntities,
    };
  };

  it("can retrieve people", () => {
    const {instance, me, myPartner} = example();
    const people = Array.from(instance.people());
    expect(people).toEqual([me, myPartner]);
  });

  it("can retrieve priorities", () => {
    const {instance, testingPriority, hackathonPriority} = example();
    const priorities = Array.from(instance.priorities());
    expect(priorities).toEqual([hackathonPriority, testingPriority]);
  });

  it("can retrieve contributions", () => {
    const {instance, odysseyModule, thisFile} = example();
    const contributions = Array.from(instance.contributions());
    expect(contributions).toEqual([odysseyModule, thisFile]);
  });

  it("can retrieve all entities", () => {
    const {instance, expectedEntities} = example();
    const allEntities = Array.from(instance.entities());
    expect(allEntities).toHaveLength(expectedEntities.length);
    for (const entity of expectedEntities) {
      const index = allEntities.findIndex((x) => deepEqual(x, entity));
      expect(index).not.toBe(-1);
    }
  });

  it("errors if a name is duplicated (even across types)", () => {
    const {instance, me} = example();
    const fail = () => instance.addContribution(me.name, "foo bar");
    expect(fail).toThrowError("Name conflict");
  });

  it("accurately reports which names are available", () => {
    const {instance, me} = example();
    expect(instance.hasName(me.name)).toEqual(true);
    expect(instance.hasName("foo bar baz")).toEqual(false);
  });

  it("graph snapshots as expected", () => {
    const {instance} = example();
    expect(instance.graph().toJSON()).toMatchSnapshot();
  });

  it("adding a duplicate node is an error", () => {
    const {instance, me} = example();
    expect(() => instance.addPerson(me.name, me.description)).toThrowError(
      "Name conflict"
    );
  });

  it("adding a duplicate edge is no problem", () => {
    const {instance, me, myPartner} = example();
    const g1 = instance.graph().copy();
    instance.addEdge(me, myPartner);
    expect(instance.graph().equals(g1)).toBe(true);
  });

  it("all edges are as expected", () => {
    const {instance, expectedEdges} = example();
    const allEdges = Array.from(instance.graph().edges());
    expect(allEdges).toHaveLength(expectedEdges.length);
    for (const {src, dst} of expectedEdges) {
      const matchingEdge = {
        address: EdgeAddress.append(EdgePrefix, src.name, dst.name),
        src: src.address,
        dst: dst.address,
      };
      const actualIndex = allEdges.findIndex((x) => deepEqual(x, matchingEdge));
      expect(actualIndex).not.toBe(-1);
    }
  });
});
