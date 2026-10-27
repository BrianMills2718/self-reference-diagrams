# Structured reasoning objects: project contract

Status: agreed direction from the conversation of 27 October 2026. The mathematical kernel below is a proposed specification; a general object schema, verified inference engine, and visual notation remain to be implemented. This contract supersedes the older sentence-only account of the project's scope. Existing sentence grammar remains a component.

The [standards mapping](standards-mapping.md) identifies established definitions for these components and recommends their composition. “Substrate” denotes a representation and its checking contracts, not a new logical foundation. New primitives require a concrete expressive gap in the selected established structures.

## 1. Goal and priorities

Define a formal substrate (rules for constructing objects, assigning meaning, and checking reasoning) and instances broad enough to contain sentences, ordinary worlds, facts, truth-value candidates, suppositional contexts, derivations, branching histories, and conflicts. Provide question-directed views of those instances.

Priorities:
1. Explicit distinctions and sound reasoning (every claimed inference follows under its recorded assumptions).
2. Recoverable sentence structure and accountable links among all components.
3. Humanly intelligible schematics with visible suppositions, consequences, and conflicts.
4. Correct complete and partial views.
5. Simple worked examples followed by parameterized stress cases and explicit proof obligations.
6. Broader extensions only with their actual semantics and assumptions.

The Feynman-diagram analogy is an aspiration for an inspectable graphical calculus, not a mathematical identification. Circuit and multiway analogies guide prototypes; no particular gate symbols, propagation schedule, or universal ontology are approved by those analogies.

## 2. What an instance contains

These are proposed storage/component types, not new ontological primitives or a finalized serialization schema. Their standard mathematical counterparts are specified in the standards mapping.

| Component | Meaning and required distinction |
| --- | --- |
| Syntax | Sentences, operator occurrences, bindings, and references with stable identities. Equal truth conditions do not imply identical syntax. |
| Domain entities and interpretation links | Represent ordinary entities separately from their symbols. Denotation, variable binding, and sentence-registry identification are distinct relationships. |
| World specification | Ordinary domains and predicate interpretations, possibly a symbolically specified family. A fact is relative to a world. |
| Value assignment | Candidate values for named sentences and, where needed, subexpressions. A candidate is not an established result. |
| Constraint | A condition on combinations of world facts and values, with a link to the syntax or semantic rule generating it. |
| Suppositional context | Explicit temporary assumptions and their scope; child branches inherit their parent assumptions. |
| Derivation | Rule-labelled steps with premises, conclusions, and context. Assumption edges and inference edges have different types. |
| Exploration | Branching histories, witnesses, conflicts, and unfinished searches. Multiple histories may describe the same configuration. |
| View specification | The question, retained dimensions, hidden dependencies, aggregation policy, and exact or approximate guarantee. |

“Includes” permits finite generative descriptions (rules specifying potentially infinite objects). It does not require eager enumeration or storing every derivation. Metadata types here are not new object-language sorts: the existing Thing/Sentence distinction does not classify worlds or inference records.

## 3. Proposed finite classical kernel

This is a finite constraint-satisfaction encoding of a declared Boolean theory. It does not constitute a new theory of truth. The standards mapping supplies the concrete encoding and a correspondence argument for the snow example.

Fix sentence syntax A, an explicitly bounded family W of ordinary worlds, and n named sentences. Let V = {F,T}^n. Evaluate each sentence body with ordinary facts from w and IsTrue(S_i) interpreted by v_i, obtaining F_w(v).

The complete candidate space is U = W × V. Its consistent configurations are

    C = {(w,v) in U : F_w(v) = v}.

An instance must retain A and the incidence of constraints (which components each condition connects), not merely C. C alone loses syntax and excludes the failed candidates needed to explain conflicts. An exploration can inspect inconsistent candidates without treating them as models.

W must declare its scope. “All worlds” means all worlds of that declared signature, domain, and interpretation policy; it does not silently mean every mathematically possible structure. An implementation may represent W, U, and C symbolically.

A supposition H selects C_H = {c in C : c satisfies H}. A conclusion Q is entailed when every member of C_H satisfies Q. When C_H is empty, report conflict separately: classical entailment is vacuous there (every conclusion passes the universal test), which is not informative confirmation.

For each world distinguish:
- no consistent assignment;
- some consistent assignments satisfy Q;
- all consistent assignments satisfy Q, with at least one assignment.

Existence and universal claims are distinct query types. A search budget exhausted is “unknown/incomplete,” never “no assignment.” This kernel does not yet cover unrestricted programs, arithmetic, or quantified sentence objects.

## 4. One worked object

S := p AND NOT IsTrue(S), where p means Falling(Snow). The consistency condition is s = p AND NOT s.

| p | Candidate s | Body value | Consistent? |
| --- | --- | --- | --- |
| F | F | F | yes |
| F | T | F | no |
| T | F | T | no |
| T | T | F | no |

Suppose s=T. Conjunction forces p=T and NOT s=T; negation forces s=F, yielding a conflict.
Suppose s=F. Negation gives NOT s=T; the false conjunction then requires p=F.
Suppose p=F. The body is F and consistency requires s=F.
Suppose p=T. Consistency would require s=NOT s; neither Boolean value works.

These are different investigations of one object. World conditions can be fixed, inferred, or left open. “Input” and “output” describe a query, not permanent types.

## 5. Machinery and histories

Constraint propagation (deriving restrictions through local conditions) is an established method. Our selection of rules, scheduling, and proof-record format is an implementation proposal. Its rules need soundness checks. It is not automatically complete (able to discover every consequence). Branching may be necessary.

Each exploration step must record whether it is:
- adding a supposition;
- applying a justified rule;
- detecting a conflict with its supporting premises;
- backtracking to a parent context;
- merging states under a specified equivalence.

Histories may branch and reconverge. Merging identical assignments must not discard distinct assumptions or proof provenance. A minimal prototype can retain a tree and postpone merging.

An update cycle is behavior of a specified procedure, not by itself a new truth value or a proof that no fixed point exists. Circuit timing and revision semantics must not be smuggled into classical consistency.

## 6. Views and their obligations

| Operation | Contract |
| --- | --- |
| Restriction | Keep configurations satisfying an explicit condition; identify that condition. |
| Projection | Hide dimensions but preserve visible combinations supported by complete configurations. Keep witness links or an equivalent exact constraint representation. |
| Collapse | Hide internal display detail while retaining the component and its constraints. |
| Abstraction | Summarize structure; state exactly what is preserved and whether results are approximate. |
| History selection | Display selected derivations without claiming they enumerate all possibilities. |

Projection is not constraint deletion. In A=NOT B, B=NOT A, the two solutions are anticorrelated; listing each variable independently as “T or F” loses the joint constraint. A hidden, disconnected liar leaves the full joint solution set empty, even if a visible ordinary sentence can be evaluated locally. Label local evaluation separately.

A question-directed view must declare its question and preservation obligation: e.g. existence of a satisfying extension, truth in all nonempty compatible configurations, or a selected derivation's premises. Automatically finding a useful small view may itself be expensive or impossible in general.

## 7. Review and verification are different

**Formal acceptance:** well-formedness checks; reproducible local inference verification; exact finite enumeration as an independent oracle; explicit scope for completeness claims; preservation arguments for views; provenance retained through branching.

**Human acceptance:** can a reader place and recognize a supposition, follow why a consequence follows, locate a conflict, and navigate without mistaking hidden structure for absent structure? Brian reviews this; he is not expected to certify proofs.

A finite test suite is not a universal proof. A type-checkable representation is not a universal decision procedure. A compact diagram can explain the halting impossibility argument without deciding whether each particular program halts.

## 8. Staged deliverables

1. Use the standards mapping to select established definitions, then specify the representation and translations. Preserve entity/name/interpretation distinctions and use a declared proof calculus for checkable records.
2. Mock a connected schematic for S:=p, S:=IsTrue(S), S:=NOT IsTrue(S), and the snow object above. Review the visual language before a tutorial rebuild.
3. Implement the accepted finite prototype, with exhaustive checks of those examples and tests of view preservation.
4. Add paired reference cycles, even/odd cycles, independent truth-tellers, conjunction blocks, quantifier scope, and hidden contradictions. State exact bounds and retain a separate structural-only test category for large examples.
5. Extend to programs/halting and arithmetic only after specifying encodings, proof rules, and assumptions. “Strange loop” requires a precise definition per example. Predicate names such as Halts or Provable do not supply those semantics.

PR #3 proposes earlier finite examples independently. It is not a dependency or evidence that this substrate is implemented. The rejected detached-table tutorial remains historical evidence, not the approved design.

## 9. Established sources versus proposed synthesis

- Existing sentence syntax and truth semantics: foundation/specification sources; older citations marked from memory still require verification.
- Local constraints and their incidence: Kschischang, Frey, Loeliger, *Factor Graphs and the Sum-Product Algorithm* (2001), https://www.isiweb.ee.ethz.ch/papers/arch/aloe-2001-1.pdf . This motivates factorization, not a general guarantee of exact cyclic propagation.
- Branching suppositions: semantic tableaux (proof trees branching over alternatives), Beth and Smullyan, as cited in the existing specification.
- Alternative computational histories: Wolfram, *The Concept of the Ruliad* (2021), https://writings.stephenwolfram.com/2021/11/the-concept-of-the-ruliad/ . A fixed-rule multiway system is the relevant analogy; the universal ruliad and its physical claims are not adopted.
- Higher equivalences: https://homotopytypetheory.org/book/ . An infinity-groupoid has reversible paths and higher comparisons; ordinary entailment is not generally reversible. No infinity-groupoid structure is claimed here.

Combining these into the particular typed object and views described above is a project proposal. Source citations do not prove that synthesis correct.
