# Formal specification of the diagram language

Historical external copy: https://claude.ai/artifact/TDwPd5ZwysuhdLndL42We8 . Later repository revisions may differ. Companion to [foundation.md](foundation.md).

## 0. Scope and obligations

The [project contract](reasoning-objects.md) governs the broader architecture. This document concerns the existing sentence component. The following are obligations, not machine-checked universal guarantees.

1. **Recoverability.** Supported normalized syntax must survive drawing/read-back under a stated bound-variable naming convention.
2. **Extensibility.** New constructs require section 8's obligations; the recipe alone does not prove preservation.

Three layers are kept apart, as Dau does for Peirce's graphs and ISO Common Logic does for conceptual graphs:

- a **formula**, the standard symbolic form;
- an **abstract diagram**, the drawing's structure with positions removed;
- a **picture**, one layout of an abstract diagram. There are two layouts: the Peirce drawing and the graph form.

The existing renderer treats values, worlds, and reasoning as annotations. In the target architecture these are linked components of a larger object. Hiding their display must not delete constraints. Transformation rules describe derivations; suppositions and exploration steps require separate types and contexts.

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

**Structural proof obligation.** For every φ in area normal form, Formula(Draw(φ)) = φ; for every well-formed D, Draw(Formula(D)) = D. The intended proof has one case per construct. Exactness is relative to normalization and bound-name conventions. Random tests do not replace a general proof or establish total rejection of malformed geometry.

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

IsTrue's extension must agree with satisfaction; a **logic** says what "agree" means: classical fixed points (Boolean assignments; *either* and *paradox* summarize multiple or absent assignments), Kripke's least fixed point with Kleene tables (*neither*), Gaifman's rules (*gap*, jump rule), revision (settles or cycles). An institution-style account requires signatures, models, satisfaction, and compatibility laws; these are not established merely by a logic selector.

## 6. Annotations

Computed from (diagram, world or all worlds, logic): values of parts; verdicts; truth conditions; candidate values (T and F circles); implication arrows and set outlines; loops; equivalence.

### The value layers: drawing the implication graph

Every node once on a **true layer** and once on a **false layer**; a value keeps its layer along edges and **crosses** at each "not". The arrows form **closed curves**.

**Curve criterion.** For a *pure loop* (each sentence says (not)ᵏ IsTrue(next)), an even number of "not"s gives two separate curves (either value holds); an odd number gives one connected curve through both value copies (no consistent assignment). A figure-eight crossing is a layout choice. This is the 2-SAT test drawn; the layers are the signed graph's double cover (Zaslavsky).

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

**Implemented evaluation** is bounded sequential unfolding with selected simplifications and cycle detection. It is not a complete semantic decision procedure. A limit is not paradox; an operational cycle is not generally proof of no fixed point. Finite sentence text alone does not guarantee a finite unfolding state space.

**Derivations and curves.** For a pure loop, unfold steps per lap equal the length of the curve through the starting sentence.

**Tableaux** (branching proof searches): retain scoped suppositions and close branches only with justified contradictions. Exhaustive sound closure can establish unsatisfiability; bounded or abandoned searches cannot. The general context-aware history representation remains proposed.

## 8. Extension protocol

A new construct supplies, all at once: its grammar rule; formation rule; translation clause; drawing and read-back rules (both layouts); satisfaction clause for every logic; transformation rules if any; its mark in the foundation's list. Nothing else may change; the verification in section 9 must pass first.

Planned: or and if (from not and and); every (already drawn); identity; quantifying over sentences; **Provable** and **Halts** only with explicit arithmetic/program encodings and assumptions. Predicate names and one-way arrows alone do not establish those theorems.

## 9. Historical finite verification (run `tests/run-all.sh`)

These earlier sample results do not certify the new architecture or general completeness. Read-back consumes structured geometry, not pixels.

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
