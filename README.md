# A visual language for self-reference

Diagrams for self-referential sentences such as the liar ("This sentence is false"), built so that:

1. **every drawing reads back into exactly one formula**, checked by program on hundreds of random sentences, and
2. **paradox has a visible shape**: drawn on a true layer and a false layer, the liar is one loop that crosses itself (a figure 8); the truth-teller is two separate loops.

Live site: https://self-reference-diagrams.pages.dev

## Pages

| Page | What it is |
| --- | --- |
| `index.html` | Landing page |
| `shapes.html` | **The shapes of self-reference**: value layers for the liar, the truth-teller, disguised liars and a loop through an "and" |
| `tutorial.html` | Thirteen-lesson interactive tutorial |
| `roundtrip.html` | **Round-trip test**: random sentences drawn and read back in both layouts, broken drawings rejected, the figure-8 rule checked |
| `gallery.html` | Every tutorial sentence drawn by the tested engine and read back |
| `reference.html` | Interactive reference page (v0.2) |
| `v0.1/` | The first guide, spec and stepper, archived |

## How it is built

New here? Read [`HANDOFF.md`](HANDOFF.md) first.

The design follows a written foundation and formal specification, in [`docs/foundation.md`](docs/foundation.md) and [`docs/specification.md`](docs/specification.md):

- **Foundation**: the standard objects (sorts, names, predicates and roles, operators and truth values, sentences, worlds, satisfaction, truth conditions, the truth predicate, theories of truth) and the closed list of marks that draw them, one mark per object.
- **Specification**: abstract syntax, formation rules, translation in both directions, two layouts (Peirce drawings and the graph form) with their read-back rules, semantics, computed annotations, transformation rules (Peirce's rules plus Tarski's T-schema), the value layers and the curve criterion, and the extension protocol.

## Source and tests

- `src/engine.js`: generator, Peirce layout, read-back, semantics (Tarski and diagram-based), evaluation as a derivation with cycle detection
- `src/graph.js`: graph-form layout and read-back; value layers for pure loops
- `src/layers.js`: implication graph and fixed points for loops through an "and"
- `src/render.js`, `src/layers_render.js`: drawing in the visual grammar
- `tutorial-src/`: sources of `tutorial.html`; rebuild with `python3 tutorial-src/build.py`

Run every check (needs Node):

```
tests/run-all.sh
```

Current results: Peirce round trip 400/400; semantics agreement on every random world; broken drawings rejected with the right rule; graph-form round trip 400/400; one curve exactly when there is no consistent value, 500/500 random loops.

## Sources

Peirce's existential graphs (Roberts, Shin, Dau); Sowa's conceptual graphs and ISO Common Logic; Tarski; Kripke 1975; Gaifman 1992; Gupta and Belnap 1993; Goguen and Burstall's institutions; Zaslavsky's signed graphs; Aspvall, Plass and Tarjan's 2-SAT; Moody's *Physics of Notations*.

## Deploying

Static files only, no build step:

```
wrangler pages deploy . --project-name self-reference-diagrams
```
