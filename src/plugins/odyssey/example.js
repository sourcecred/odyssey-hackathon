// @flow

import {OdysseyInstance} from "./model";

export function example(): OdysseyInstance {
  const instance = new OdysseyInstance();

  // Add people
  const lb = instance.addPerson("lb", "genderqueer artist");
  const max = instance.addPerson("max", "leader of designers");
  const sarah = instance.addPerson("sarah", "logistics guru");

  // Add some priorities
  const hackathon = instance.addPriority("hackathon", "everything must happen");
  const design = instance.addPriority("design", "design is everything");
  const logistics = instance.addPriority(
    "logistics",
    "logistics enables everything"
  );

  instance.addEdge(hackathon, design);
  instance.addEdge(hackathon, logistics);

  // Add contributions
  const planeTickets = instance.addContribution(
    "plane tickets",
    "flights from Ukraine"
  );
  instance.addEdge(max, planeTickets);
  instance.addEdge(planeTickets, sarah);
  instance.addEdge(logistics, planeTickets);

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

  return instance;
}
