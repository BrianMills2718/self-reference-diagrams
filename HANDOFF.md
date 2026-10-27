# Handoff: A visual language for self-reference

Read this first. Written 27 October 2026 for any agent or person taking over.

## 1. What the project is for

Brian wants a visual language in which **paradoxes have a specific, identifiable shape that is not apparent in symbols**, in the spirit of Feynman diagrams, while **every drawing reads back into exactly one formula**. Both matter: the shape is only trustworthy because the drawing provably says what the sentences say.

The central result so far (Brian's own idea, made exact): draw each sentence on a **true layer** and a **false layer**; a value keeps its layer except at a "not", where it crosses. Then

- **the liar is one closed curve that crosses itself, a figure 8**: no value can hold;
- **the truth-teller is two separate loops**: either value holds;
- disguised liars (A: "B is false", B: "A is true") have the same figure 8.

This is the double cover of a signed graph (Zaslavsky), equivalently the 2-SAT implication test. Natural next targets: Gödel's incompleteness theorem and the halting problem (section 7).

## 2. How to work with Brian

These were learned the hard way; follow them.

1. **Visual first.** Brian judges by looking. He does not read formal text closely and says so. Explain in plain words, show a picture, keep jargon to named standard terms.
2. **Show a mock in chat before building or deploying.** Big rebuilds go wrong when skipped.
3. **Nothing novel.** Search for the standard formalism first and cite it. Brian's recurring worry is that we reinvent what logicians already worked out. So far every piece maps to a standard source (see `docs/`).
4. **The closed list of marks.** Every picture uses only the marks in `docs/foundation.md` section 10. A new mark needs an amendment there first, proposed to Brian. Inventing ad hoc pictures (rings, timelines, stacks) caused weeks of going in circles.
5. **Every claim is checked by program** (`tests/run-all.sh`) before it is written into the docs or shown as true.
6. **Act as project manager.** Brian asks you to decide, explain the decision briefly, and propose the next step. Ask at most one question at a time. Do not offer menus of options.
7. **Be honest about limits** (for example, curve counting is exact only for pure loops).

## 3. History in brief (what failed and why)

- v0.1 (25 to 26 Oct): Peirce-style drawings plus T and F "ports" with magenta implication arrows; deployed to the site and repo.
- v0.2 (26 Oct): typed drawings, possible-worlds grid, three logics (classical, Kripke, Gaifman), the 13-lesson tutorial.
- 27 Oct: several attempts to **animate** the liar (moving dots, wires, call stacks, timelines, rings) were rejected because positions had no meaning and the drawing hid the loop. Lessons: separate the statement from its evaluation; fix the ontology before drawing; every mark one meaning.
- Then: the **foundation** (standard ontology: sorts, signature, operators, worlds, satisfaction, truth predicate, theories of truth, institutions) and the **formal specification** (abstract syntax, two layouts with read-back, semantics, Peirce's transformation rules plus Tarski's T-schema, extension protocol), the **tested engine**, the **graph form** (loops as closed paths), and the **value layers** (figure 8).

## 4. What exists and where

| Thing | Where |
| --- | --- |
| Live site | https://self-reference-diagrams.pages.dev (planned custom domain selfref.brianmills.dev, DNS not yet set) |
| Repository | https://github.com/BrianMills2718/self-reference-diagrams |
| Foundation (objects and marks) | `docs/foundation.md`; live Claude Doc https://claude.ai/artifact/V3ahWhPUDtTRbY1N3PmT8D |
| Formal specification | `docs/specification.md`; live Claude Doc https://claude.ai/artifact/TDwPd5ZwysuhdLndL42We8 |
| Shapes of self-reference | `shapes.html`; artifact https://claude.ai/artifact/7b4EPHhytxbHbAeZ9zCxM2 |
| Round-trip test | `roundtrip.html`; artifact https://claude.ai/artifact/V2U8aydTHk2extR9VjTJps |
| Tutorial sentences, engine-drawn | `gallery.html`; artifact https://claude.ai/artifact/XhRmVWYpRPDtvuvHGfg6Pt |
| Tutorial (13 lessons, v0.2 style) | `tutorial.html`, built from `tutorial-src/`; artifact https://claude.ai/artifact/LsXWGXCWKYmu29AURe6EhC |
| Interactive reference (v0.2) | `reference.html`; artifact https://claude.ai/artifact/2xaSBPunghg6rUJDtVd6EQ |
| Older docs (superseded) | Spec v0.2 https://claude.ai/artifact/8RXZcdpdTgyW7asYwCf7km; decision record https://claude.ai/artifact/K6sMhYfRWwZkVQBASNGJTf |
| v0.1 pages | `v0.1/` |

Claude Docs and artifacts are private to Brian's account until shared. The `docs/` copies are the public record; the live docs are the editable originals.

## 5. Repository map

- `src/engine.js`: vocabulary; random text generator (area normal form); Peirce layout (rules D1 to D6); read-back from geometry; formula printer; semantics on formulas (Tarski) and on diagrams (Dau-style); evaluation as a derivation (unfold, look up, double cut) with cycle detection.
- `src/graph.js`: graph-form layout and read-back (rules G1 to G4); `valueLayers` (curves for pure loops); `pureLoop` generator; brute-force consistency check.
- `src/layers.js`: implication graph with "both" and "one of" junctions; fixed points.
- `src/render.js`, `src/layers_render.js`: drawing in the visual grammar (browser).
- `tests/`: `run-all.sh` runs every check (needs Node).
- `tutorial-src/`: sources for `tutorial.html`; `python3 tutorial-src/build.py` rebuilds it byte-for-byte. It takes the drawing engine and styles from `reference.html`.
- The HTML pages embed copies of `src/` code; after changing `src/`, re-embed (the pages were assembled by inserting the files into the `<script>` block).

Deploy: `wrangler pages deploy . --project-name self-reference-diagrams` (Cloudflare account and `gh` are set up in WSL Ubuntu 24.04 on Brian's Windows laptop, project folder `~/projects/self-reference-diagrams`). Claude has pushed via the Desktop Commander connector running on that laptop.

## 6. Decisions in force (ranked requirements)

Judge every decision in this order: (1) recoverable from the picture, (2) verdict visible, (3) nothing novel, cite sources, (4) ease of use.

- One abstract diagram, two layouts: the **Peirce drawing** shows what is said; the **graph form** shows loops. Values, worlds, implication arrows and value layers are **computed annotations**.
- Marks: sort tags on roles; "and" as a dashed divider; neutral dashed "not"; − on references inside odd numbers of "not"s; colour carries value only (green true, orange false, grey neither).
- Theory of truth is a setting (classical, Kripke, Gaifman); worlds stay classical for Gaifman.
- T and F circles are candidate worlds for IsTrue.
- Unfolding of entailment is drawn as a derivation (Peirce's rules plus the T-schema), never with a new kind of picture.

## 7. Next steps, in order

1. **Rebuild the tutorial** on the foundation's order, drawing everything with the tested engine: (1) the language (a sentence about a thing; not; and), (2) worlds and truth (a world and its facts; true in a world, rule by rule; truth conditions; other logics), (3) relations and quantifiers (Loves; something and every; valid and invalid arguments), (4) truth itself (a sentence about a sentence; truth-teller; liar; hidden loop; when the world decides; theories of truth), then **spot the liar in disguise**. For each self-referential sentence: Peirce drawing read back mark by mark, then graph form, then value layers. Fix the red "not" clash and replace the old dot animations. Show Brian lesson mocks first.
2. **Gödel and Turing.** Add Provable and Halts predicates through the extension protocol, with **one-way** rules (provable implies true, not conversely). Expected picture: the liar's figure 8 cut open by a one-way edge, forcing "G is true but not provable"; Turing's D gives a figure 8 that refutes the assumed halting decider. Sources: Lawvere's fixed-point theorem (1969); Yanofsky (2003). Mock three panels (liar, Gödel, Turing) for Brian first.
3. Polish: branching value layers (loops through an "and"); layout of reference arrows in engine drawings.
4. Tests for Kripke and Gaifman semantics (only classical is machine-checked so far).
5. Constructs: or and if examples; identity; quantifying over sentences.
6. Check every citation against the original.
7. Set the DNS CNAME selfref.brianmills.dev to self-reference-diagrams.pages.dev; retire superseded artifacts.

## 8. Known issues

- `tutorial.html` still uses red for "not", the older T/F reasoning layer as its main picture, and dot animations Brian rejected.
- `reference.html` predates the foundation and specification.
- The engine draws but does not yet animate derivations in the browser.
- Engine-drawn reference arrows between distant boxes are functional, not pretty.
