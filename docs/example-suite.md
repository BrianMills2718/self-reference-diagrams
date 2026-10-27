# Example suite and visual review sequence

## Purpose and present status

One formal object should retain sentence structure, ordinary-world facts, candidate truth assignments, and consistency constraints. A view selects or hides part of that object; it must not invent a different underlying interpretation.

This document fixes the first teaching examples, expected classical results, scalable validation families, and review criteria. Executable fixtures are in [`examples/catalog.js`](../examples/catalog.js); checks are in [`tests/test-example-suite.js`](../tests/test-example-suite.js). Run `tests/run-all.sh` with Node and Bash.

This suite is based on main, independently of the unmerged tutorial/evaluator PR #2. It uses main's existing formula evaluator, Peirce reader and graph reader. It neither adopts that PR's three-lesson preview as the final design nor introduces new visual marks. It is not a proof that the whole proposed language is fully formalized. See the [formal obligations](formal-obligations.md).

## Six teaching stages, eight named fixtures

Here `T(A)` abbreviates `IsTrue(A)`, `p` means Falling(Snow), and `q` means Blowing(Wind). These are notation in this document, not new diagram marks. A candidate assignment is consistent exactly when every sentence's assumed value equals its evaluated body. All verdicts in this suite are classical.

| Stage / fixture | Sentence definitions | Complete expected result | Teaching purpose |
| --- | --- | --- | --- |
| 1 / E01 | S := p | p false: S false; p true: S true | Distinguish a sentence from a world and a candidate assignment. |
| 2 / E02a | S := not p | p false: S true; p true: S false | Negation constrains the value. |
| 2 / E02b | S := p and q | One consistent assignment in each of four worlds; S true only when both facts hold | Conjunction combines two independent ordinary facts. |
| 3 / E03 | S := T(S) | Two models: S false and S true | Alternatives are separate assignments, not simultaneous truth and falsity. |
| 4 / E04 | S := not T(S) | No model | Neither classical candidate satisfies the definition. |
| 5 / E05 | S := p and not T(S) | p false: S false only; p true: no model | Worlds change consistency; all four world–candidate combinations belong to one object. |
| 6 / E06a | A := not T(B); B := T(A) | No model | Self-reference can be distributed across two sentences. |
| 6 / E06b | A := not T(B); B := not T(A) | Exactly (A false, B true) and (A true, B false) | A second negation changes the global constraint. |

The complete candidate spaces have respectively 4, 4, 8, 2, 2, 4, 4 and 4 configurations. E01/E02/E05 worlds vary precisely their listed ordinary facts. The other examples have one relevant ordinary-world class. Unmentioned facts do not affect these sentences; these are classes of worlds agreeing on all relevant facts, not an enumeration of every possible physical world.

### The E05 object, explicitly

| World p | Supposed S | Body p and not S | Consistent? |
| --- | --- | --- | --- |
| False | False | False | Yes |
| False | True | False | No |
| True | False | True | No |
| True | True | False | No |

This table is a test oracle, not a mandated tutorial layout. The notation should eventually make this structure visible in the sentence/world drawing itself. The entire space must remain representable even when a view shows only part of it.

## Visual review checkpoint

Review these stages in order, using one sentence identity across views. Before implementing new notation, show a proposed drawing of E05 containing both worlds and both candidates together. The existing one-case controls and detached chart are not the acceptance target.

| E05 view | Cases retained or hidden | Required observation |
| --- | --- | --- |
| Sentence structure | Show the syntax; hide assignment annotations | Read back the same sentence and the same reference to S. This is a structural view, not a projection that merges formulas. |
| Complete space | Four cases | Both worlds and both candidates can be seen simultaneously. |
| One world: no falling snow | Two cases | False survives; true fails. |
| One world: falling snow | Two cases | Neither candidate survives. |
| One supposition: S false | Two cases, one in each world | It succeeds in one world and fails in the other. |
| Consistent interpretations | One case | The hidden cases are excluded by a stated consistency filter. |
| Hide world, keep S | Two visible candidate groups, each with two underlying cases | S false is consistent in some worlds, not all worlds. Expansion restores the witnesses. |

Every view names its filters and hidden dimensions. Selection must refer to the same sentence/operator occurrence across views. Collapsing a section must retain the information needed to expand it. A computation budget limit must not look like an empty solution set.

The review question is: **Can a reader explain the result from the drawing and its constraints, and identify what a partial view omits?** If only the prose/table explains it, the drawing still needs work. Passing code tests does not answer this usability question.

## Larger families

| ID | Family and expected property | Executable checks now | Larger obligation |
| --- | --- | --- | --- |
| F01 | n-sentence pure cycle; odd negative-edge parity gives zero models, even parity gives two | Exhaustive n=1..10 with zero, one and (where possible) two negative edges; both layout round trips | A 128-sentence odd cycle is checked structurally only. Its zero-model result follows from the parity proof below, not enumeration. |
| F02 | n independent truth-tellers; exactly 2^n models | Exhaustive n=1..12; both layouts | 64 sentences are checked structurally; 2^64 models follows from independence. No claim that these have been enumerated. |
| F03 | k independent branching blocks: A_i := not(T(B_i) and T(C_i)); B_i := T(A_i); C_i := p_i | Exhaustive all worlds/candidates for k=1..3 | Five blocks are checked structurally. They span 2^5 worlds and 2^15 candidates per world. Only the all-false ordinary world has a model. |
| F04 | EachSome := every x, some y, Loves(x,y); SomeAll := some y, every x, Loves(x,y) | Both layouts; empty relation gives (F,F), identity relation (T,F), a common-loved-object relation (T,T) on the engine's five objects | Five objects permit 2^25 ordinary relation interpretations. Ten objects would permit 2^100, but the current main evaluator's domain is fixed at five. Exhaustive relation-world checking and a configurable domain are not implemented here. |
| F05 | L := not T(L), Q := p | Both ordinary worlds and all candidates: zero global models, while Q's body evaluates exactly to p | Component-sensitive explanations must distinguish local evaluability from global satisfiability. |
| X01 | Quantifying over sentence objects | Not implemented | Supply the domain, binding rules, interpretation of truth and corresponding view rules before claiming support. |
| X02 | Provability, arithmetic diagonalization, and halting | Not implemented | Specify the theory/machine, encoding and assumptions, then prove the relevant results. Adding predicate labels alone is insufficient. |

### Elementary family proofs

**F01.** In a pure cycle, each definition imposes either v_i = v_(i+1) or v_i = not v_(i+1). Composing once around the cycle imposes v_0 = v_0 for even parity, or v_0 = not v_0 for odd parity. The latter has no Boolean solution. In the former, either initial value uniquely determines all remaining values, yielding exactly two solutions. This argument applies for every positive cycle length. It does not apply to branching conjunctions. The related double-cover connectivity criterion is Zaslavsky, *Signed Graphs* (1982), section 6, proposition 6.2: [paper](https://davinci.fmph.uniba.sk/~matok1/diplomovka/sources/Zaslavsky-former.pdf).

**F02.** Each equation v_i = v_i permits both Boolean values independently. The Cartesian product of n two-element sets has size 2^n. This counts assignments; it does not identify them with simultaneous truth and falsity.

**F03.** Since C_i = p_i and B_i = A_i, the first equation becomes A_i = not(A_i and p_i). If p_i is false, A_i and B_i must be true and C_i false. If p_i is true, A_i = not A_i has no solution. Independent blocks have a global model exactly when every p_i is false, and that model is unique. This is a branching constraint argument, not curve counting.

**F04.** For any domain of at least two objects, the identity relation lets every object love itself, but has no object loved by everyone. The relation consisting of every object loving a single fixed object satisfies both formulas. The empty relation satisfies neither on a nonempty domain. An unrestricted binary relation on n named objects independently chooses n^2 ordered pairs, hence has 2^(n^2) possible interpretations, including self-pairs.

**F05.** The L equation is unsatisfiable independently of Q. Therefore the joint system has no model. Q's body still has the value p under every candidate assignment. A projection of the empty global solution set is empty; removing L's constraint is a different operation and must be labelled as such.

## Evidence boundaries

The named expected results above are checked against the existing formula evaluator; layout round trips check preservation of the normalized syntax in both layouts. Existing tests separately compare formula and diagram interpretations. These are not a new independent SAT implementation or a mechanically checked general proof. The E05 view tests implement the stated finite relational operations locally in the test; they are not a production view engine. Larger structural examples test representability, not speed, browser legibility, or exhaustive evaluation.

The existing state-space sketches can motivate the work, but they do not themselves preserve every operator occurrence. The eventual object must retain the syntax as well as its interpretations; logically equivalent but syntactically distinct formulas must not be silently identified.
