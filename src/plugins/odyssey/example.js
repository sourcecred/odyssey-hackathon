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
  const design = instance.addPriority("design", "design is everything");
  const implementation = instance.addPriority(
    "implementation",
    "if there is no implementation, then there is nothing"
  );
  const logistics = instance.addPriority(
    "logistics",
    "logistics enables everything"
  );

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

  return instance;
}

export function commonStackExample() {
  const instance = new OdysseyInstance();

  // teams
  const teamOne = instance.addContribution(
    "Team 1",
    "Crowdfunding the commons"
  );
  const teamTwo = instance.addContribution("Team 2", "Momentum Voting");
  const teamThree = instance.addContribution(
    "Team 3",
    "Moprheus Proposal Engine"
  );
  const teamFour = instance.addContribution("Team 4", "XS Exchange");
  const teamFive = instance.addContribution("Team 5", "SourceCred");
  const jedi = instance.addContribution("Jedi", "");

  const sara = instance.addPerson("Sara", "SourceCred logistics coordinator");
  instance.addEdge(teamFive, sara);

  const bryan = instance.addPerson("Bryan", "Team 4 engineer and visionary");
  instance.addEdge(teamFour, bryan);
  const bryanContr = instance.addContribution("Coordinating with Team 5", "");
  instance.addEdge(bryanContr, bryan);

  const zargham = instance.addPerson(
    "Zargham",
    "Commons Stack celebrity and mathmetician"
  );
  instance.addEdge(teamFive, zargham);

  const kris = instance.addPerson("kris", "Jedi coordinator and synergist");
  instance.addEdge(jedi, kris);

  const josh = instance.addPerson(
    "Josh",
    "Vocal jedi leader and coordinator; great listenr"
  );
  instance.addEdge(jedi, josh);

  const jeff = instance.addPerson(
    "Jeff",
    "Content-creator and inter-team facilitator "
  );
  instance.addEdge(jedi, jeff);

  const will = instance.addPerson(
    "Will",
    "Interops between teams; built shared React components "
  );
  instance.addEdge(teamOne, will);

  const zoltan = instance.addPerson("Zoltan", "Front-end engineer");
  instance.addEdge(teamTwo, zoltan);

  const marko = instance.addPerson(
    "Marko",
    "Works on design and enabling otheres"
  );

  const sergei = instance.addPerson(
    "Sergei",
    "Says yes to everything; communicator"
  );
  instance.addEdge(teamTwo, sergei);

  const kay = instance.addPerson(
    "Kay",
    "Team-wide technical and narrative support specialist"
  );
  instance.addEdge(teamTwo, kay);

  const emily = instance.addPerson("Emily", "");
  instance.addEdge(teamTwo, emily);

  const mike = instance.addPerson("Mike", "");
  instance.addEdge(teamTwo, mike);

  const lb = instance.addPerson("LB", "");
  instance.addEdge(lb, teamFive);
  const artwork = instance.addPriority(
    "Artwork",
    "Art helps communicate vision"
  );
  instance.addEdge(teamFive, artwork);
  instance.addEdge(artwork, lb);

  const griff = instance.addPerson("Griff", "");
  instance.addEdge(teamThree, griff);
  instance.addEdge(teamOne, griff);
  instance.addEdge(teamTwo, griff);
  instance.addEdge(teamFour, griff);
  instance.addEdge(teamFive, griff);

  const daniel = instance.addPerson("Daniel", "");
  instance.addEdge(teamFour, daniel);

  const pavle = instance.addPerson("Pavle", "");
  instance.addEdge(teamOne, pavle);

  const abbey = instance.addPerson("Abbey", "");
  instance.addEdge(teamOne, abbey);

  const sponnet = instance.addPerson("Sponnet", "");
  instance.addEdge(teamTwo, sponnet);

  const ome = instance.addPerson("Ome", "");
  instance.addEdge(teamThree, ome);

  const deam = instance.addPerson("Deam", "");
  instance.addEdge(teamThree, deam);

  const thomas = instance.addPerson("Thomas", "");
  instance.addEdge(teamFour, thomas);

  const roberto = instance.addPerson("Roberto", "");
  instance.addEdge(teamFour, roberto);
  instance.addEdge(bryanContr, roberto);

  const beth = instance.addPerson("Beth", "");
  instance.addEdge(teamFour, beth);

  const brian = instance.addPerson("Brian", "");
  instance.addEdge(teamFive, brian);

  const max = instance.addPerson("Max", "");
  instance.addEdge(teamFive, max);

  const denis = instance.addPerson("Denis", "");
  instance.addEdge(teamFive, denis);

  const irene = instance.addPerson("Irene", "");
  instance.addEdge(teamFive, irene);

  const maxS = instance.addPerson("Max s", "");
  instance.addEdge(teamThree, maxS);

  const andreas = instance.addPerson("Andreas", "");
  instance.addEdge(teamThree, andreas);

  const sebastian = instance.addPerson("Sebastian", "");
  instance.addEdge(teamThree, sebastian);

  const maxVD = instance.addPerson("Max vd", "");
  instance.addEdge(teamFour, maxVD);

  const rinke = instance.addPerson("Rinke", "");
  instance.addEdge(teamOne, rinke);

  // Priority: Networking
  const networking = instance.addContribution("networking", "");
  instance.addEdge(networking, griff);
  instance.addEdge(networking, josh);

  // Priority: Design
  const design = instance.addPriority("Design", "");
  instance.addEdge(design, josh);
  instance.addEdge(design, marko);
  instance.addEdge(design, sergei);
  instance.addEdge(design, abbey);
  instance.addEdge(design, sponnet);
  instance.addEdge(design, beth);
  instance.addEdge(design, max);
  instance.addEdge(design, denis);
  instance.addEdge(design, irene);

  // Priority: Narrative
  const narrative = instance.addPriority("Narrative", "");
  instance.addEdge(narrative, kay);
  instance.addEdge(narrative, pavle);
  instance.addEdge(narrative, abbey);
  instance.addEdge(narrative, sponnet);

  // Priority: Communication
  const communication = instance.addPriority("Communication", "");
  instance.addEdge(communication, kris);

  // Priority: Smart Contracts
  const smartContracts = instance.addContribution("Smart Contracts", "");
  instance.addEdge(smartContracts, mike);
  instance.addEdge(smartContracts, sebastian);
  instance.addEdge(smartContracts, rinke);

  // medium article
  const medArticle = instance.addContribution("Bonding Curves Article", "");
  instance.addEdge(medArticle, zargham); // med article depended on z's research
  instance.addEdge(communication, medArticle);
  instance.addEdge(medArticle, josh);
  instance.addEdge(teamOne, medArticle);

  // Jeff's article
  const jeffArticle = instance.addContribution(
    "Commons Stack Medium Article",
    ""
  );
  instance.addEdge(jeff, jeffArticle);
  instance.addEdge(zargham, jeffArticle);
  instance.addEdge(communication, jeffArticle);
  instance.addEdge(teamTwo, jeffArticle);

  // max launching wiki
  const maxWiki = instance.addContribution("Github Wiki", "");
  instance.addEdge(maxWiki, maxS);
  instance.addEdge(communication, maxWiki);

  const projectManagement = instance.addPriority("projectManagement", "");
  instance.addEdge(projectManagement, abbey);
  instance.addEdge(projectManagement, maxS);
  instance.addEdge(projectManagement, sponnet);

  const math = instance.addPriority("AI Expertise", "");
  instance.addEdge(math, zargham);
  instance.addEdge(math, sponnet);
  instance.addEdge(math, rinke);
  instance.addEdge(math, medArticle);
  instance.addEdge(math, jeffArticle);

  // Priority: logistics
  const logistics = instance.addPriority("Logistics", "");
  const boat = instance.addContribution("Boat housing", "");
  instance.addEdge(logistics, boat);
  instance.addEdge(boat, griff);
  const planeTickets = instance.addContribution(
    "Arranging plane tickets",
    "enables contributors to contribute!"
  );
  instance.addEdge(logistics, planeTickets);
  instance.addEdge(planeTickets, sara);
  instance.addEdge(brian, planeTickets);
  instance.addEdge(denis, planeTickets);
  instance.addEdge(max, planeTickets);
  instance.addEdge(teamOne, boat);
  instance.addEdge(teamTwo, boat);
  instance.addEdge(teamThree, boat);
  instance.addEdge(teamFour, boat);
  instance.addEdge(teamFive, boat);

  const telegramComms = instance.addContribution(
    "Telegram Communication",
    "Coordinating and energizing the Giveth community through a Telegram channel"
  );
  instance.addEdge(telegramComms, josh);

  // Giveth meeting
  const givethMeeting = instance.addContribution(
    "Giveth meeting",
    "Connecting the Giveth teams"
  );
  instance.addEdge(givethMeeting, griff);
  instance.addEdge(givethMeeting, kris);
  instance.addEdge(givethMeeting, jeff);
  instance.addEdge(teamOne, givethMeeting);
  instance.addEdge(teamTwo, givethMeeting);
  instance.addEdge(teamThree, givethMeeting);
  instance.addEdge(teamFour, givethMeeting);
  instance.addEdge(teamFive, givethMeeting);

  const enthusiasm = instance.addPriority(
    "Enthusiasm",
    "Bringing energy and lifting up your community with a positive attitude"
  );
  instance.addEdge(enthusiasm, griff);
  instance.addEdge(enthusiasm, josh);
  instance.addEdge(enthusiasm, sergei);

  const softwareDev = instance.addPriority(
    "Software Development",
    "Builiding the tools for the future"
  );
  const dandelion = instance.addPerson("Dandelion", "Types fast");
  instance.addEdge(softwareDev, dandelion);
  instance.addEdge(softwareDev, pavle);
  instance.addEdge(softwareDev, will);
  instance.addEdge(softwareDev, zoltan);

  const orangeVests = instance.addContribution(
    "Coordinated Orange Vests",
    "Giveth swarm theme!"
  );
  instance.addEdge(orangeVests, griff);
  instance.addEdge(orangeVests, kris);
  instance.addEdge(teamOne, orangeVests);
  instance.addEdge(teamTwo, orangeVests);
  instance.addEdge(teamThree, orangeVests);
  instance.addEdge(teamFour, orangeVests);
  instance.addEdge(teamFive, orangeVests);

  const emotionalLabor = instance.addPriority(
    "Emotional Labor",
    "Creating the inspiration to energize development and community building"
  );
  instance.addEdge(jeffArticle, emotionalLabor);
  instance.addEdge(medArticle, emotionalLabor);
  instance.addEdge(enthusiasm, emotionalLabor);
  instance.addEdge(emotionalLabor, griff);

  const interTeamCoordination = instance.addPriority(
    "Inter-team coordination",
    "Synergizing the Giveth vision and community"
  );

  instance.addEdge(interTeamCoordination, kris);
  instance.addEdge(interTeamCoordination, deam);
  instance.addEdge(interTeamCoordination, abbey);

  const technicalLeadership = instance.addPriority(
    "Technical Leadership",
    "People that groups can rely on to make decisions on the technical direction of a project"
  );
  instance.addEdge(technicalLeadership, dandelion);
  instance.addEdge(technicalLeadership, roberto);
  instance.addEdge(technicalLeadership, zargham);
  return instance;
}
