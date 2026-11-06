# Instructions for agents working in this repository

Read `HANDOFF.md`, `docs/standards-mapping.md`, `docs/reasoning-objects.md`, and `docs/inquiry-trace.md`.
Before changing notation, read `docs/foundation.md` section 10 and `docs/specification.md`.

- PRs target main; never build on an unmerged PR.
- Show Brian a mock before implementing new visual notation or deploying.
- Record each new mark and its meaning in foundation section 10 before adoption.
- Map each component to an established definition before extending the schema. Cite sources and distinguish proposed translations from proved results.
- A new primitive needs a demonstrated expressive gap, explicit semantics, and a preservation obligation; unfamiliar terminology is not a gap.
- Separate formal correctness from human intelligibility.
- Update the inquiry trace when requirements change, preserving reasons and superseded decisions.
- Run `bash tests/run-all.sh` before claiming implemented behavior and after changes to `src/`.
