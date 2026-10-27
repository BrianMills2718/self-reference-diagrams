# A visual language for self-reference

The goal is a **machine-checkable substrate** (formal construction and reasoning rules) whose instances are **structured reasoning objects**: linked sentences, worlds, facts, candidate values, suppositions, derivations, and conflicts. Question-directed visual views should make small examples inspectable even when the complete space of possibilities is too large or infinite to enumerate.

The sentence is one component of an object. Worlds are not permanently inputs; an investigation can ask which sentence assignments a world permits or which worlds permit an assignment. A reasoning history is not a possible world.

## Current direction and status

Start with the [standards mapping and foundation recommendation](docs/standards-mapping.md): ordinary model theory, finite constraint satisfaction, established proof calculi, and relational views. The linked reasoning object is an application record assembled from these structures, not a newly invented ontology.

- [Project contract](docs/reasoning-objects.md): goals, terminology, formal kernel, view guarantees, and acceptance criteria.
- [Inquiry graph and conversation trace](docs/inquiry-trace.md): how the requirements developed, including corrections and open questions.
- [Machine-readable inquiry graph](docs/inquiry-graph.json): typed nodes, relations, and paraphrased conversational evidence.
- [Handoff](HANDOFF.md): implementation status and next steps.
- [Foundation](docs/foundation.md) and [specification](docs/specification.md): existing sentence grammar and its place within the larger target.

**This architecture is a design commitment, not an implemented general solver or a completed formalization.** Current code implements sentence layouts, structured read-back, selected semantic checks, and finite loop examples. The tutorial predates the current direction. Tests on finite samples are evidence, not universal proofs.

For pure signed reference cycles, an odd number of negations joins the true and false copies into one component; an even number gives two. A literal figure-eight crossing is a layout choice. This criterion does not by itself solve arbitrary conjunctions or quantify over programs.

## Existing pages

Live site: https://self-reference-diagrams.pages.dev

| Page | Status and purpose |
| --- | --- |
| `index.html` | Earlier landing page |
| `shapes.html` | Existing value-layer illustrations |
| `tutorial.html` | Earlier thirteen-lesson tutorial; not the new reasoning-object tutorial |
| `roundtrip.html` | Structured layout/read-back checks |
| `gallery.html` | Engine-drawn example sentences |
| `reference.html` | Earlier v0.2 reference |
| `v0.1/` | Archived first guide |

## Source and validation

- `src/engine.js`: sentence generation, Peirce layout/read-back, semantic evaluation, and bounded unfolding.
- `src/graph.js`: graph layout/read-back and pure-loop value layers.
- `src/layers.js`: finite consistency machinery.
- `src/render.js`, `src/layers_render.js`: existing visual grammar.
- `tutorial-src/`: sources of the earlier tutorial; rebuild with `python3 tutorial-src/build.py`.

Run `bash tests/run-all.sh` (requires Node). Read-back consumes structured geometric data, not arbitrary pixels. A bounded unfolding failure is not a proof of inconsistency.

PR #4's contract is merged. The example suite in PR #3, earlier tutorial in PR #2, and finite prototype in PR #5 remain separate, unmerged work as of this revision. This standards mapping is based directly on main and depends on none of those PRs.

## Sources and deployment

The existing grammar draws on Peirce, Sowa, Tarski, and the sources recorded in the foundation. The new architectural synthesis and its unproved obligations are identified explicitly in the project contract.

Static deployment remains `wrangler pages deploy . --project-name self-reference-diagrams`. No deployment is part of this documentation revision.
