# Handoff: structured reasoning objects

Updated 27 October 2026. Read [the project contract](docs/reasoning-objects.md) and [the inquiry trace](docs/inquiry-trace.md).

## Purpose and decisions in force

Build a machine-checkable substrate whose instances contain linked sentences, worlds, facts, candidate values, suppositions, reasoning histories, and conflicts. A sentence is a component, not the whole object. Question-directed visual views expose this structure. Infinite possibilities may have finite descriptions.

Worlds are not permanently inputs. Supposition, entailment, derivation, and search are distinct. A branch is not a world. Hiding a constraint does not remove it. Machine-checkability does not imply universal solvability.

Priorities: soundness and explicit scope; recoverable structure; intelligible schematics; correct views; simple examples and stress families; broader extensions with justified assumptions.

## How to work

- PRs target main. Never build on an unmerged PR.
- Show a schematic mock before implementing new visual notation or rebuilding/deploying the tutorial.
- Read foundation section 10 before changing marks; record meanings before adopting new marks.
- Cite established mathematics; identify proposed synthesis and unproved obligations.
- Separate formal correctness from human intelligibility. Brian reviews the latter, not proof certification.
- Run `bash tests/run-all.sh` after engine changes and before claiming implemented behavior. Finite tests do not prove universal results.
- Preserve corrections in the inquiry graph. Label paraphrases and distinguish proposals from approvals.

## Implementation status

- `src/engine.js`: vocabulary, generation, Peirce layout, structured read-back, semantics, bounded unfolding.
- `src/graph.js`: graph layout/read-back, pure-loop layers, finite consistency checks.
- `src/layers.js`: finite value constraints.
- `src/render.js`, `src/layers_render.js`: existing visual grammar.
- `tutorial-src/`: earlier tutorial; rebuild with `python3 tutorial-src/build.py`.
- HTML pages embed source copies; engine changes require synchronizing affected copies.

Read-back consumes structured geometry, not arbitrary images. Pure-cycle connectivity has a parity criterion; a figure-eight crossing is a rendering choice. Curve counting is not a general conjunction solver. Bounded unfolding can remain unfinished without deciding consistency.

The general object schema, context-aware derivations, query-preserving views, and new schematic tutorial are not implemented. Existing tutorial/reference pages are legacy prototypes. Nonclassical theories and arithmetic/program reasoning are not certified by current tests.

## Work in review and conversation history

PR #1 is merged. PR #2 (earlier tutorial) and PR #3 (example suite/view obligations) remain unmerged at this revision. This documentation change is based directly on main and imports neither.

Brian rejected a detached sentence/table presentation. The subsequent complete chart still looked too symbolic; he requested connected machinery and exploration. These experiments do not approve new gate marks.

No inquiry graph existed on main. This revision establishes a curated trace from the available conversation, not a verbatim transcript or an exhaustive history of earlier sessions.

## Next steps

1. Review the contract and inquiry for fidelity.
2. Specify the minimal finite schema and rule-checking contract.
3. Mock ordinary claim, truth-teller, liar, and snow-dependent self-reference within a connected schematic.
4. After visual review, implement and compare against independent finite enumeration; verify view contracts.
5. Extend through interacting cycles, conjunctions, quantifier scope, and hidden conflicts.
6. Address Gödel/halting only with actual encodings and assumptions. Adding predicates or one-way arrows is not a proof.

Live site: https://self-reference-diagrams.pages.dev . This revision does not deploy or alter runtime pages.

## Research continuation: 28 October 2026

The [six-plate review atlas](research/diagram-demo/index.html) now provides
ordinary inference, teller/liar, all snow candidates, scoped investigations,
correlation-preserving views, and a signed-cycle signature with a counterexample
outside its scope. Its [README](research/diagram-demo/README.md) assesses primary
sources, explains the finite translation/checker, and accounts for the full zoo.
The independent Python experiment retains syntax, candidate failures, scoped
branch certificates, and projection witnesses in `evidence.json`. It does not
extend the production engine or establish visual approval. The next checkpoint
is intelligibility of these actual drawings. PRs #3, #5, and #6 were still open;
this continuation was built directly on main, without importing their code.
