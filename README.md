# [SourceCred](https://sourcecred.io)

[![Discourse topics](https://img.shields.io/discourse/https/discourse.sourcecred.io/topics.svg)](https://discourse.sourcecred.io)
[![Discord](https://img.shields.io/discord/453243919774253079.svg)](https://discord.gg/tsBTgc9)

This repository is a fork of [sourcecred/sourcecred] which contains the
SourceCred team's work at the [Odyssey Hackathon]. At the hackathon, we made an
'Odyssey Plugin' which can represent arbitrary contributions and connections
between them. For example, a community could define its values, and record all
of the contributions that impacted those values, whether technical or
nontechnical. Under the hood, it uses SourceCred's PageRank variant to assign
cred to every contribution, value, and person.

[sourcecred/sourcecred]: https://github.com/sourcecred/sourcecred
[Odyssey Hackathon]: https://odyssey.org/odyssey-hackathon/

For a demo, see: [sourcecred.io/odyssey-hackathon].
[sourcecred.io/odyssey-hackathon]: https://sourcecred.io/odyssey-hackathon/

To update the demo, run `./scripts/rebuild_example.sh` and commit the resultant
changes.

The code standards for this repository are significantly loewr than for
[sourcecred/sourcecred], as befits a hackathon project. We intend to clean up
this code and merge it back into mainline sourcecred.


