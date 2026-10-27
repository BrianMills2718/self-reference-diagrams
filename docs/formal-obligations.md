# Formal object and proof obligations

Status: proposed contract with finite executable witnesses. This refines the project goal; it does not certify the existing implementation as a complete realization. No visual marks are added by this document.

## 1. Supported finite setting

Fix a vocabulary Σ with sorted predicates and roles, a finite nonempty domain D of named things, and an ordered list A of closed sentence definitions. The current main engine uses five fixed named things and supports ordinary predicate claims, named sentence references through IsTrue, conjunction, negation and existential thing quantification. Universal quantification is the usual abbreviation not-exists-not. Equality, function symbols and quantification over sentences are outside the checked fragment.

A retains the syntax tree/graph: sentence names, operator occurrences, ordered areas, role fillers and binding scopes. An implementation of coordinated views must give those occurrences stable identifiers. Their identity cannot be reconstructed from truth conditions alone.

Let W be the ordinary interpretations under consideration, excluding IsTrue's candidate extension. Worlds may be enumerated or symbolically represented. A reduced world space must declare which facts vary and which are fixed or irrelevant. Let V = {F,T}^n for n sentence definitions.

For w in W and v in V, interpret IsTrue(S_i) as v_i and recursively evaluate each definition under w. This defines F_w(v), the vector of evaluated sentence bodies, and values for every subexpression. Define:

    U = W × V
    C = { (w,v) in U : F_w(v) = v }

The proposed object O retains (Σ,D,A,W,U,F,C) together with links between syntax occurrences and evaluated subexpressions. This is a specification of information that must remain available, not a requirement to materialize every tuple. C may be represented by constraints. A nontrivial cycle of the update map is not a fixed point, and the presence of a cycle does not establish absence of other fixed points. Arrows in an update view denote evaluation, not physical time.

Sources and connections: ordinary compositional satisfaction follows the existing foundation; the fixed-point equations are made explicit above. Constraint factorization has an established graphical basis in Kschischang, Frey and Loeliger, *Factor Graphs and the Sum-Product Algorithm* (2001), [paper](https://www.isiweb.ee.ethz.ch/papers/arch/aloe-2001-1.pdf). That is a possible representation, not an assertion that this repository already implements factor graphs or that cyclic message passing is an exact solver.

## 2. Views and their contracts

Each view carries the identity of O, selected syntax occurrence IDs, active filters, visible dimensions, and enough provenance to recover its source cases. The abstract operations below use ordinary set selection and projection.

**Filtering.** For a predicate P on configurations, select U_P = {u in U : P(u)}. Examples include a fixed ordinary world, a chosen candidate value, or consistency. Filtering restricts the question being asked and must be displayed as a restriction.

**Projection.** For visible coordinates J, π_J(U_P) contains the distinct restrictions u|J. Each displayed tuple retains its witness set {u in U_P : u|J = a}. Hiding a world coordinate does not choose a world. Expanding a displayed tuple restores exactly its witnesses, including multiplicity if the interface aggregates distinct configurations.

**Aggregation.** For a nonempty witness set B, distinguish “some consistent” (there exists u in B∩C), “all consistent” (B⊆C), and “none consistent” (B∩C is empty). An empty group is explicitly “no cases,” not an unqualified truth verdict. Preserve correlated alternatives: separate projections of A and B cannot imply that all recombinations of their values are possible. E06b has two joint assignments, not four.

**Structural view.** Hide valuation annotations while retaining A, its scopes and occurrence IDs. This is not semantic projection that identifies equivalent formulas. Collapsing a syntax region keeps its hidden internal structure; expansion restores it without regeneration or reinterpretation.

**Constraint removal is not projection.** In F05 the global solution set is empty. Hiding the liar does not make it nonempty. An interface that solves Q independently is changing the constraint set, and must say so.

**Partial computation.** “Not computed,” “unsupported,” “budget exhausted,” and “no model” are distinct statuses. Only a completed exact decision, a verified witness for existence, or a checked proof can justify its corresponding claim. A found witness proves existence; finding no witness before a limit does not prove nonexistence. Do not report “all” or exact model counts from an incomplete search.

## 3. Proof and verification ledger

| Obligation | Required statement | Present evidence | Remaining work |
| --- | --- | --- | --- |
| Formation and binding | Every supported expression has an unambiguous syntax with sorted roles and correct scope | Existing grammar, named quantifier fixtures, malformed-diagram tests | Complete validator coverage; stable occurrence IDs and rules for all view objects |
| Recoverability | Read(Draw(A)) equals A up to explicitly allowed canonical variable renaming; views can recover hidden source structure | Existing random checks plus 114 new layout round trips | Full inductive proof for the implemented grammar and concrete readers; arbitrary rendered-image recovery is not claimed |
| Semantic preservation | Evaluating the formula and its recovered abstract diagram agrees for every supported w,v | Existing finite checks and named expected models | Structural-induction proof, including variable environments and quantifier scope |
| Fixed-point correctness | C contains exactly the assignments satisfying all definitions | Exhaustive small families; elementary proofs for F01–F05 | Prove any optimized/symbolic solver sound and complete; do not infer this from sample agreement |
| View correctness | Selection, projection, grouping and expansion obey section 2 and do not mutate O | E05 finite witness tests and E06b correlation example | Production view representation, generalized tests/proofs, stable ID correspondence across views |
| Conservative extension | Extending the language preserves interpretations and results for unchanged old-language texts | Existing examples form a future regression corpus | Per-extension construction/proof; sentence quantification and arithmetic are not yet supported |
| Large-object representation | Compact storage and partial views retain omitted constraints and alternatives | Large AST/layout round trips only | Symbolic representation, complexity analysis, exact query semantics and resource accounting |
| Visual adequacy | Readers can recover meaning and diagnose consistency from the diagram | A defined review protocol | User review of all six teaching stages; no proof or automated test establishes pedagogical success |

For conservative extension, distinguish expanding the available vocabulary from adding new asserted definitions. Adding an inconsistent sentence may legitimately eliminate all models of the joint system; this is not a failure of vocabulary conservativity.

## 4. Proof outlines to complete

Recoverability and semantic preservation require one case per constructor: atomic claim, conjunction/ordered area, negation/enclosure and existential binding. The quantifier case must preserve scope and assignment environments; alpha-renaming must be capture-avoiding. Normalization needs its own conditions and is not character-for-character recovery of arbitrary input syntax.

View proofs should first establish the relational laws independently of layout: filtering preserves source identity; projection is many-to-one with exact witnesses; expansion unions those witnesses; existential/universal summaries quantify over the displayed group's source cases. Then prove each renderer consumes that data without silently removing constraints or merging syntax occurrences.

F01–F05 have elementary mathematical arguments in the example suite. Those arguments are separate from both the finite automated tests and any future mechanically checked proof. Large examples demonstrate coverage and representation limits; they cannot replace the general proofs.
