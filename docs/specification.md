# Formal specification of the diagram language

Live, editable version: https://claude.ai/artifact/TDwPd5ZwysuhdLndL42We8 (a Claude Doc; this file is a copy made on 27 October 2026). Companion to [foundation.md](foundation.md).

## 0. What this specification guarantees

1. **Recoverability.** A supported formula in area normal form can be drawn and read back with its canonical variable names. Normalization does not preserve arbitrary original grouping or spelling. The program reads structured shape data; it does not parse pixels or arbitrary SVG files.
2. **Extensibility.** A new construct is added by a fixed recipe (section 8) without disturbing anything already defined.

Three layers are kept apart, as Dau does for Peirce's graphs and ISO Common Logic does for conceptual graphs:

- a **formula**, the standard symbolic form;
- an **abstract diagram**, the drawing's structure with positions removed;
- a **picture**, one layout of an abstract diagram. There are two layouts: the Peirce drawing and the graph form.

Values, worlds and arrows of reasoning are **annotations**, computed from an abstract diagram, a world and a logic; they never change the diagram. **Transformation rules** turn one abstract diagram into another: that is how the unfolding of entailment is drawn.

## 1. Abstract syntax

Fix a **vocabulary** Σ: sorts (*thing*, *sentence*), names with sorts, predicates with named, sorted roles.

| Part | What it is |
| --- | --- |
| **Sentence box** | A sentence name and one top-level area |
| **Area** | An *ordered list* of items (claims and enclosures), plus its home lines |
| **Enclosure** | Belongs to one area; has its own inner area ("not") |
| **Line of identity** | A sort and a home area (where its "something" sits) |
| **Claim** | A predicate in one area; each role filled by a thing name, a sentence name or a line |

Areas nest into a tree per sentence box. **Well-formedness:** sorts match; a line fills only claims inside its home area; no idle lines; area order is kept (so recovery is exact, not up to reordering).

## 2. Formation rules

Grammar ("and" taken as a list of any length):

> φ ::= P(r₁: t₁, …, rₙ: tₙ) | ¬φ | φ₁ ∧ … ∧ φₖ | ∃x φ; a text is a list of definitions S := φ.

| Formula | Contribution to an area |
| --- | --- |
| P(r₁: t₁, …) | One claim of P, roles filled by the tᵢ |
| ¬φ | One enclosure whose inner area is Area(φ) |
| φ₁ ∧ … ∧ φₖ | Area(φ₁), then Area(φ₂), …; k = 0 gives the empty area (true) |
| ∃x φ | A new line of x's sort with home here, then Area(φ) |
| S := φ | A sentence box S whose area is Area(φ) |

**Area normal form:** "and" is flat, and a "something" covers its whole area. Every formula can be put in this form without changing its meaning; variables are named in order (x, y, z, …). ¬¬φ stays two enclosures.

## 3. Translation and the recoverability theorem

Formula(D) reads area by area: an area with items i₁…iₖ and home lines ℓ₁…ℓₘ gives ∃x₁…∃xₘ (Formula(i₁) ∧ … ∧ Formula(iₖ)); an enclosure gives ¬( … ); a claim gives P(r: t, …); a box gives S := ….

**Theorem.** For every φ in area normal form, Formula(Draw(φ)) = φ; for every well-formed D, Draw(Formula(D)) = D. Each translation clause undoes one formation rule, so the proof has one case per construct.

## 4. Concrete syntax and read-back

### Layout 1: the Peirce drawing

| Rule | Statement |
| --- | --- |
| D1 Nesting | Outlines never cross; an item belongs to the smallest outline containing it |
| D2 Order | Items read top to bottom, left to right within a row |
| D3 Roles | A role arrow starts on its claim's edge and ends on the outline of what fills it, with its role name and sort tag |
| D4 Lines | A heavy line's home is the outermost area it reaches; it meets each claim at the claim's edge |
| D5 Sentences | Each box is one definition; never inside an enclosure |
| D6 Annotations | Circles, colours, implication arrows, cells and outlines sit on a separate layer the read-back ignores |

Read-back: sort shapes into marks; build the containment tree; place and order items; fill roles from arrows and lines; check well-formedness, naming the failed rule.

### Layout 2: the graph form

Every link is an edge: **says** (sentence to its parts), **inside** ("not" to its parts), **home** (where a "something" sits), **role** edges (claim to filler; blue when the filler is a sentence).

| Rule | Statement |
| --- | --- |
| G1 Edges | Every edge runs from one node's outline to another's |
| G2 Tree | Every node except sentences and things has exactly one parent |
| G3 Roles | Every role has exactly one role edge, to a node of the right sort |
| G4 Scope | A something node fills only claims below its home |

Read-back follows edges, never nesting. The read-back theorem holds for both layouts.

## 5. Semantics

A world gives objects per sort, an object per name and an extension per predicate (except IsTrue). Satisfaction is defined directly on abstract diagrams (Dau): an area is true when some choice of objects for its home lines makes every item true; an enclosure when its inner area is not true; a claim when its role-filling is in the extension. By the theorem in section 3 this agrees with Tarski on the formula.

IsTrue's extension must agree with satisfaction; a **logic** says what "agree" means: classical fixed points (true, false, *either*, *paradox*), Kripke's least fixed point with Kleene tables (*neither*), Gaifman's rules (*gap*, jump rule), revision (settles or cycles). Each logic is an institution; diagrams never depend on the logic.

## 6. Annotations

Computed from (diagram, world or all worlds, logic): values of parts; verdicts; truth conditions; candidate values (T and F circles); implication arrows and set outlines; loops; equivalence.

### The value layers: drawing the implication graph

Every node once on a **true layer** and once on a **false layer**; a value keeps its layer along edges and **crosses** at each "not". The arrows form **closed curves**.

**Curve criterion.** For a *pure loop* (each sentence says (not)ᵏ IsTrue(next)), an even number of "not"s gives two separate curves (either value holds); an odd number gives one curve through both copies of each sentence (no consistent value). A figure-eight appearance is a layout choice; connectivity between opposite value copies is the invariant. This is the 2-SAT test drawn; the layers are the signed graph's double cover (Zaslavsky).

**Limit.** Through an "and", curves branch at junctions ("both", "one of"); the verdict is then read from which nodes can be chosen together (fixed points), not by counting curves.

## 7. Dynamics

A **derivation** is a sequence of abstract diagrams, one rule at one place per step; every step is an ordinary diagram.

| Rule | May | Where |
| --- | --- | --- |
| Erasure | remove an item | positive area |
| Insertion | add an item | negative area |
| Iteration / deiteration | copy an item inward / remove such a copy | anywhere |
| Double cut | add or remove two enclosures with nothing between | anywhere |
| Unfold / fold | replace IsTrue(S′) by a copy of S′'s area, or back | Tarski's T-schema |
| Look up | replace a claim about things by true or false in a given world | the world's facts |

(Peirce's rules: Roberts, Shin, Dau; lines of identity have matching rules.)

**Unfolding demonstration.** `evaluate` applies unfold and look up, simplifying with double cut. Its return describes this particular rewriting strategy: a true/false endpoint, a repeated drawing, an unsupported operation, or a step limit. It is not a complete semantic evaluator, and its termination is not a definition of groundedness. In particular, variable instantiation is unsupported and an early self-reference can starve a later conjunct.

**Classical verdicts.** `src/semantics.js` supplies `solveClassical(text, world, options)`, a separate finite-model evaluator. It enumerates candidate truth assignments and retains exactly those satisfying all definitions simultaneously. Supported operators are conjunction, negation and existential quantification over a finite, nonempty domain of named things (the engine's five objects by default). The world must supply a fact set for every ordinary predicate used; IsTrue is assigned by the solver. Predicate roles, variable scope and sentence references are validated first.

Only `status: complete` supplies verdicts: `true`, `false`, `either`, or `no-model`. “Either” means distinct consistent assignments, not simultaneous truth and falsity. “No-model” concerns the entire supplied system; it must not be interpreted as a proof that each independent sentence is intrinsically paradoxical. Assignment or work limits return `status: limit`; unsupported inputs return `status: unsupported`. Neither provides verdicts or partial candidate results. This is classical fixed-point semantics, not a Kripke or Gaifman implementation.

**Derivations and curves.** For a pure loop, unfold steps per lap equal the length of the curve through the starting sentence.

**Tableaux.** Branch on suppositions; a branch closes on an empty enclosure; all branches closed means no supposition survives (Beth, Smullyan).

## 8. Extension protocol

A new construct supplies, all at once: its grammar rule; formation rule; translation clause; drawing and read-back rules (both layouts); satisfaction clause for every logic; transformation rules if any; its mark in the foundation's list. Nothing else may change; the verification in section 9 must pass first.

Planned: or and if (from not and and); every (already drawn); identity; quantifying over sentences; **Provable** and **Halts** predicates with one-way rules (for Gödel and Turing; see HANDOFF.md).

## 9. Verification (run `tests/run-all.sh`)

| Check | Result on 27 October 2026 |
| --- | --- |
| Peirce round trip, random texts | 400 / 400 |
| Diagram semantics vs Tarski, random worlds | all agree |
| Broken Peirce drawings rejected with the right rule (D1, D3, D4, D5) | all |
| Derivation steps read back; examples halt or cycle as expected | 31 / 31; all |
| Graph-form round trip | 400 / 400 |
| Broken graph pictures rejected (G1, G2) | 200 / 200 each |
| Curve criterion on random pure loops | 500 / 500 |
| Derivation laps = curve length | 500 / 500 |

## Sources

Dau (2003); Shin (2002); Roberts (1973); Sowa (1984); ISO/IEC 24707 Common Logic; Tarski (1933); Kripke (1975); Gaifman (1992); Gupta and Belnap (1993); Goguen and Burstall (1992); Beth (1955); Smullyan (1968); Turing (1936); Zaslavsky (signed graphs); Aspvall, Plass and Tarjan (1979); Moody (2009); Lawvere (1969) and Yanofsky (2003) for the unifying fixed-point view. Cited from memory; check before treating as final.

