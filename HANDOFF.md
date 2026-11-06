# Handoff: structured reasoning objects

Updated 27 October 2026. Read [the project contract](docs/reasoning-objects.md) and [the inquiry trace](docs/inquiry-trace.md).

## Current foundation recommendation

Read [standards-mapping.md](docs/standards-mapping.md) first. The user challenged the apparent invention of ordinary logic and authorized a mapping to established foundations. Recommendation: model theory for ordinary entities/worlds, finite CSPs for executable consistency, an established proof calculus for certificates, and exact relational queries for views. This selects a direction for review; it does not certify a new implementation. Existing terminology is to be mapped, not reinvented.

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

PRs #1 and #4 are merged. PRs #2 (earlier tutorial), #3 (example suite), and #5 (finite snow kernel/schematic) remain unmerged. This mapping is based on main `07d54f0` and imports no unmerged implementation.

Brian rejected a detached sentence/table presentation. The subsequent complete chart still looked too symbolic; he requested connected machinery and exploration. These experiments do not approve new gate marks.

PR #4 established the inquiry graph. The current trace adds the prototype approval, feedback about the ambiguous “open” label, the request for gradual instruction, and the correction to use existing formalisms. It is a curated paraphrase, not a verbatim transcript.

## Next steps

1. Review the standards mapping and foundation recommendation.
2. Define translations linking ordinary entities and interpretations, sentence syntax, finite constraints, and an established proof calculus.
3. Produce one gradually introduced example with linked syntax/world, constraint, and proof views; Brian reviews readability.
4. Validate compilation and projection correspondence separately from visual acceptance.
5. Extend to quantified or infinite cases only within explicit bounds and semantic profiles.

“Open” describes incomplete local investigation, not a truth value or a guarantee of globally compatible possibilities. The guided tutorial should show world cases explicitly and introduce one component at a time.

Live site: https://self-reference-diagrams.pages.dev . This revision does not deploy or alter runtime pages.
