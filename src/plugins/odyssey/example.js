// @flow

import {OdysseyInstance} from "./model";

export function example(): OdysseyInstance {
  const instance = new OdysseyInstance();

  // Add people
  const z = instance.addPerson("z", "mathematician and hackathon celebrity");
  const dl = instance.addPerson("dandelion", "sourcecred architect");
  const lb = instance.addPerson("lb", "genderqueer artist");
  const max = instance.addPerson("max", "leader of designers");
  const sarah = instance.addPerson("sarah", "logistics guru");
  const dennis = instance.addPerson("dennis", "business logic");
  const brian = instance.addPerson("brian litwin", "slinging that code");
  const jonathan = instance.addPerson("jonathan", "developing business");
  const irene = instance.addPerson("irene", "designer");

  // Add some priorities
  const hackathon = instance.addPriority("hackathon", "everything must happen");
  const design = instance.addPriority("design", "design is everything");
  const implementation = instance.addPriority(
    "implementation",
    "if there is no implementation, then there is nothing"
  );
  const logistics = instance.addPriority(
    "logistics",
    "logistics enables everything"
  );

  instance.addEdge(hackathon, design);
  instance.addEdge(hackathon, logistics);
  instance.addEdge(hackathon, implementation);
  instance.addEdge(implementation, design);

  // Add contributions
  const planeTickets = instance.addContribution(
    "plane tickets",
    "flights from Ukraine"
  );
  instance.addEdge(max, planeTickets);
  instance.addEdge(planeTickets, sarah);
  instance.addEdge(logistics, planeTickets);

  const hotelStay = instance.addContribution(
    "hotel stay",
    "arrangements at best western"
  );
  instance.addEdge(logistics, hotelStay);
  instance.addEdge(lb, hotelStay);
  instance.addEdge(dl, hotelStay);
  instance.addEdge(hotelStay, sarah);

  const logo = instance.addContribution("logo", "the SourceCred logo");
  const sketches = instance.addContribution(
    "logo-sketches",
    "initial SourceCred logo sketches"
  );
  const secondDraft = instance.addContribution(
    "logo-draft-2",
    "second logo draft"
  );
  instance.addEdge(logo, sketches);
  instance.addEdge(logo, secondDraft);
  instance.addEdge(secondDraft, sketches);
  instance.addEdge(design, logo);
  instance.addEdge(sketches, lb);
  instance.addEdge(sketches, dl);
  instance.addEdge(secondDraft, max);
  instance.addEdge(secondDraft, dl);

  const prg = instance.addContribution(
    "pagerankGraph improvements",
    "necessary for seed vectors"
  );
  instance.addEdge(implementation, prg);
  instance.addEdge(prg, dl);
  instance.addEdge(prg, z);

  const graphviz = instance.addContribution(
    "graph visualization",
    "fancypants ui"
  );
  instance.addEdge(implementation, graphviz);
  instance.addEdge(graphviz, dl);

  const figmaFile = instance.addContribution(
    "figma file",
    "the figma portfolio"
  );
  instance.addEdge(figmaFile, dennis);
  instance.addEdge(figmaFile, irene);
  instance.addEdge(design, figmaFile);

  const odysseyUi = instance.addContribution("odysseyUi", "the implemented UI");
  instance.addEdge(odysseyUi, brian);
  instance.addEdge(implementation, odysseyUi);
  instance.addEdge(odysseyUi, figmaFile);
  instance.addEdge(odysseyUi, graphviz);

  // interpersonal dependencies are interesting...
  instance.addEdge(max, z);
  instance.addEdge(dl, lb);
  instance.addEdge(z, dl);
  instance.addEdge(dl, z);
  instance.addEdge(max, sarah);
  instance.addEdge(irene, sarah);
  instance.addEdge(dennis, sarah);

  // the following is a crude approximation of having seed vectors.
  for (const person of Array.from(instance.people())) {
    instance.addEdge(person, hackathon);
  }

  return instance;
}
