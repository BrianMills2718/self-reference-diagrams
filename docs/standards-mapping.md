# Established foundations and the project's mapping

Status: researched recommendation for review, 27 October 2026. Based on main `07d54f0`; independent of unmerged PRs #2, #3, and #5. This document selects a direction and states translation obligations. It does not claim a completed standards implementation or verified proof-assistant integration.

## 1. Recommendation

Use **classical model theory** (structures assigning meaning to expressions) for ordinary entities and facts, **finite constraint satisfaction** (assignments satisfying specified relations) for the initial executable examples, and an established **proof calculus** (rules constructing proofs from assumptions) for certificates. Use exact relational queries for the first views. Keep sentence syntax and its interpretation links alongside the constraint network.

This is an engineering assembly of existing mathematical structures. “Structured reasoning object” names the project's linked record, not a new kind of logic. The project's contribution being investigated is the visual organization, interaction, and pedagogy. Neither novelty nor superior intelligibility has been established.

Select the finite classical profile first. For machine-checked proof certificates, recommend the classical sequent calculus in Isabelle/AFP's `FOL_Seq_Calc1` as the initial target; natural-deduction walkthroughs can explain the same reasoning to readers. Implementing the translation is a next task, not a completed feature. Treat stronger languages and alternative truth theories as explicit extensions. A common display can accommodate several profiles only when it identifies which rules and meanings are active.

## 2. Map the vocabulary before adding primitives

Source identifiers below resolve in section 8. “Record” means data in the implementation, not an additional mathematical primitive.

| Project language | Established definition | Representation decision / limit |
| --- | --- | --- |
| Entity / thing | Element of a structure's domain, D | Preserve an entity identifier separately from its names. [FOL-S] |
| Name / symbol | Constant symbol c in the signature (declared vocabulary) | Interpretation maps c to an entity c^M. [FOL-L, FOL-S] |
| Predicate / property | Predicate symbol P; its interpretation P^M is a relation | Distinguish the symbol from the relation and its members. [FOL-S] |
| Role | An argument position, with a project label | Fix argument order/types; a role label adds no semantic entity. [FOL-L] |
| Expression | Term or formula built by a grammar | Terms denote entities; formulas receive truth evaluations. Keep occurrence IDs for display provenance. [FOL-L] |
| Sentence | Formula without free variables | A sentence name in our registry is not itself its truth value. [FOL-L] |
| Reference | Several different links, specified below | Do not give denotation, variable binding, and a sentence-registry pointer one undifferentiated edge type. |
| Ordinary world | A structure M for the ordinary vocabulary | Domain plus interpretations. A model of a theory additionally satisfies its axioms. [FOL-S] |
| Fact | An atomic formula satisfied in M; equivalently, a tuple in the appropriate relation | Store the world and argument entities with the fact. [FOL-S] |
| Candidate truth assignment | Boolean valuation v | Distinguish this from a first-order variable assignment g, which maps variables to domain entities. [PROP, FOL-S] |
| World case | Class of structures agreeing on selected observations | “Snow/no snow” partitions by one observation; it does not enumerate all differences among worlds. Project definition in section 4. |
| Constraint | Relation on a stated tuple of variables | The permitted joint values can be specified by a table or a formula. [CSP] |
| Supposition | Additional hypothesis H or restricted variable domain | Record its scope, inheritance, and discharge/backtracking explicitly. [ND, GAC] |
| Entailment | Γ ⊨ Q: every model of Γ satisfies Q | A semantic relationship, not a stored reasoning step. [PROP] |
| Derivation / proof | Γ ⊢ Q in a declared calculus | A checkable syntactic object built using rules. [ND, AFP] |
| Inference record | Instance of a rule with identified premises and conclusion | Storage format for a proof step; attach its context and rule identifier. [ND] |
| Pathway | Path in a proof-search or state-transition graph | A history of exploration; not necessarily a world, a proof, or a consistent assignment. |
| Conflict | Unsatisfiable branch constraints, or a derivation of contradiction | Require a certificate or complete finite check. “No answer yet” is distinct. [GAC, AFP] |
| View | Selection, projection, or an explicitly specified other transformation | Preserve the query's meaning; retained witness links are a project requirement. [RA, VE] |

These rows belong to different mathematical levels. Entities belong to domains; syntax and proofs are mathematical objects in the metalanguage (the language used to describe our formal system). Calling all of them “objects” is acceptable for storage, but it must not erase those types.

### Reference is not one primitive

1. **Denotation:** a name such as `Snow` is interpreted as an entity in M.
2. **Binding:** a variable occurrence is governed by its quantifier and interpreted using an assignment g.
3. **Sentence identification:** a registry pointer selects the syntax of a named sentence. This is an implementation link.
4. **Quotation/coding:** if the object language itself talks about sentences, a term must denote a sentence or its code. This requires an explicit encoding and interpretation.

The earlier explanation of reference as simply “a symbol pointing to an entity” was incomplete. In particular, `IsTrue(S)` combines a sentence-denoting term and a truth predicate; a pointer alone supplies no truth semantics. Distinct names can denote the same entity, and shared spelling across worlds does not by itself establish cross-world identity.

For the finite initial profile, named references are resolved through a fixed sentence registry and compiled to valuation variables. This is deliberately a restricted representation, not unrestricted quotation or quantification over sentence objects.

## 3. Candidate frameworks and selection

This assessment compares the frameworks directly implicated by the repository. It is not an exhaustive literature survey.

| Framework | What it supplies | Selection for this project |
| --- | --- | --- |
| First-order syntax and model theory | Entities, terms, formulas, structures, satisfaction | Semantic foundation for ordinary claims; retain sorted roles as a checked front end. [FOL-L, FOL-S] |
| Constraint-satisfaction networks | Variables, domains, local relations, propagation/search | Executable foundation for the finite examples. Standard constraint networks already have the desired connected structure. [CSP, GAC] |
| Factor graphs | Variable/factor incidence and factored global functions | Useful representation of Boolean indicator factors. The cited sum-product algorithm is not a generic exact solver for cyclic diagrams. [FG] |
| Natural deduction; tableaux/sequent calculi | Assumptions, proofs, branching/refutation | Display assumption-dependent steps; target AFP `FOL_Seq_Calc1` for certificates. Natural deduction supplies a readable explanation; branch exploration is a separate operation. [ND, AFP] |
| Peirce-style conceptual graphs / CGIF | Diagrammatic syntax with translation to Common Logic | Retain as a syntax-view/interchange candidate. Not a substitute for world families or search histories. No conformance claim for the current renderer. [CG] |
| Institution theory | A framework for organizing logical systems and translations | Defer until genuinely comparing multiple logics; it does not choose our proof engine or tutorial interface. [INST] |
| Kripke's truth construction | Partial truth interpretations and fixed-point methods | A later, separately labelled truth profile. It must not be identified with the current Boolean consistency search. [TRUTH] |

Common Logic is not selected as the entire substrate: its standard graph dialect addresses logical content and interpretation, whereas this application must also track model queries and proof histories. Sowa's summary also distinguishes a single-domain semantics from strongly typed front ends, and permits unordered graph conjunctions. Consequently, exact recovery of our ordered syntax requires extra occurrence/order metadata, not just semantic equivalence. These are concrete translation issues, not evidence against conceptual graphs. [CG]

The AFP (Archive of Formal Proofs) reference is not a drop-in certified implementation of our JavaScript. A translation and checker integration would have to be implemented and validated before certification could be claimed.

## 4. Work the snow example in ordinary mathematics

The following application is our explicit mapping, not a claim that a source already specifies this application.

At the ordinary first-order level, choose a structure M with an entity d interpreting the name `Snow` and a unary relation interpreting `Falling`. Define the observation p_M to be true exactly when d belongs to that relation.

For a declared collection W of such structures, define M ~ N when p_M = p_N. The two displayed cases are the nonempty classes of this relation; in the unconstrained toy scope both cases occur. Other facts are invisible to this particular observation. If ordinary background axioms rule out a case, do not continue displaying it as an admitted world.

The self-referential syntax is registered as:

    S := Falling(Snow) AND NOT IsTrue(S)

For the finite classical profile, use propositional variables p and s and the explicit theory:

    B := s ↔ (p ∧ ¬s).

Here s stands for the candidate truth value assigned to the registered sentence; it is not an entity or a term denoting the sentence. The model set of B is precisely {(p=false, s=false)}.

The reference, operators, and body may be retained as local constraint variables:

    f = p            ordinary-claim value
    r = s            referenced-sentence value
    n = ¬r           negated part
    b = f ∧ n        body value
    s = b            required consistency

All six variables are Boolean. For each pair (p,s), the first four equations determine f,r,n,b uniquely; the fifth succeeds exactly when B holds. Thus projecting the full solution relation onto (p,s) gives exactly the models of B. This is a direct correspondence argument for this encoding, not a proof of a universal compiler.

Treat B as an axiom restricting admissible assignments, not a recursively evaluated definition guaranteed to have a solution. A liar gives s ↔ ¬s and no Boolean model; a truth-teller gives s ↔ s and two assignments. This uses ordinary classical logic to investigate a finite truth-agreement theory. It does not introduce a globally unrestricted truth predicate into first-order logic.

### Supposition, entailment, and proof are separately visible

With background theory B, the semantic claims are:

    B, ¬s ⊨ ¬p
    B, s ⊨ ⊥

The first has a short natural-deduction derivation [ND]: assume ¬s; from B obtain (p ∧ ¬s) → s; temporarily assume p; conjunction introduction gives p ∧ ¬s; implication elimination gives s, contradicting ¬s; discharge p to conclude ¬p. This prose derivation explains the proof; it is not yet a certificate checked in the recommended sequent-calculus target.

For the second, assume s; B gives p ∧ ¬s; conjunction elimination gives ¬s; together with s this yields contradiction. The displayed local propagation may take another route to the same conclusion. Its steps must translate to valid rules or proved derived rules.

In both cases Γ includes B. Omitting it would falsely suggest that “S false” alone entails a weather condition. If a context is inconsistent, classical entailment is vacuous (every formula follows semantically); the interface should first report its conflict.

### View as an exact query

Let R be the full six-variable solution relation and H a supposition. Compatible visible assignments on variables X are

    π_X(σ_H(R)).

Selection σ restricts tuples; projection π hides columns while retaining supported combinations. [RA] In logical form a view hiding z from a constraint formula K(x,z) asserts ∃z K(x,z). For the unconditioned snowfall view, ∃s B is equivalent to ¬p. That is a claim about worlds admitting a consistent extension by this sentence, not a claim that snowfall is physically impossible.

Computing exact elimination can create larger intermediate constraints. [VE] An independent list of permitted values for each variable loses correlations; preserving the joint projected relation is necessary. “All completions satisfy Q” also needs a different query from “some completion satisfies Q,” plus a separate emptiness check. Collapsing a drawing is merely display hiding unless a stronger semantic transformation is specified.

## 5. What “open” should have meant

A domain {false,true} is a set of locally retained possibilities. Local consistency can leave multiple values even when no full solution exists. [GAC] Therefore the proposed tutorial labels are:

- **World cases under consideration:** show the actual alternative cases.
- **No supposition yet:** no candidate has been chosen in this context.
- **Not yet derived:** the selected reasoning history has not established a value.
- **Consistent extension found / none exists:** global claims with witnesses or completed checks.

These are investigation statuses, not additional truth values. A partial truth theory's undefined value is a different semantic notion and needs its own explanation.

## 6. What is standard, and what remains our responsibility

Already standard: syntax/interpretation distinctions, hypothesis contexts, semantic consequence, derivations, constraints, domain reduction, branching search, relational selection/projection, and graph representations of logical syntax or constraint incidence. [FOL-L, FOL-S, PROP, ND, CSP, GAC, RA, CG]

Project work: choose encodings; link syntax occurrences to entities, constraints, and proofs; preserve provenance (where a result came from); define visual transformations; teach the marks; and establish translation correctness. A data schema bundling these items is an implementation artifact, not evidence for a new ontology.

Proof obligations for the next implementation:

1. **Compilation:** for each supported expression constructor, relate generated constraints to its declared semantics; prove the mapping preserves and reflects solutions within scope.
2. **Certificates:** export a selected derivation to a precisely named calculus; distinguish using a verified reference from actually checking the exported proof.
3. **Views:** specify a query and prove the view preserves its answer; record full witnesses or another adequate reconstruction mechanism when needed.
4. **Presentation:** preserve symbol/entity distinctions, context boundaries, and declared world scope; test the tutorial with Brian one component at a time.

General quantification, infinite domains, quotation, arithmetic, and program semantics remain extensions. Finitely checking a proof is different from deciding every truth or discovering a proof automatically. A diagram of the halting impossibility argument requires an actual program encoding and diagonal construction; a `Halts` label cannot supply them.

## 7. Concrete next deliverable

Review this mapping before extending the proposed ontology. Then prepare one example with three linked views of the same mapped data: ordinary entity/name/claim/world; syntax compiled to constraints; a checked proof under a displayed supposition. Introduce those views gradually in the tutorial. Start with the mapping above and retain all ordinary-entity information that the earlier Boolean-only display suppressed.

Before introducing a new primitive, name its existing candidate definition, demonstrate a concrete expressive gap, and state the additional semantics and preservation obligation. Neither unfamiliar terminology nor an inconvenient display is an expressive gap.

## 8. Source ledger

Primary papers, author-maintained accounts, and formalization records were inspected on 27 October 2026. These sources support the identified components; none certifies this application's assembly. No full conformance audit of ISO/IEC 24707 was performed.

- **FOL-L:** Avigad et al., *Logic and Proof*, [chapter 7, First Order Logic](https://leanprover-community.github.io/logic_and_proof/first_order_logic.html), especially the distinction among symbols, functions, predicates, terms, and formulas.
- **FOL-S:** same authors, [chapter 10, §§10.1–10.2](https://leanprover-community.github.io/logic_and_proof/semantics_of_first_order_logic.html), domains, interpretations, and satisfaction. The typed front-end choice is our engineering decision, not a conformance claim about that chapter.
- **PROP:** same authors, [chapter 6](https://leanprover-community.github.io/logic_and_proof/semantics_of_propositional_logic.html), Boolean valuations and semantic consequence.
- **ND:** same authors, [chapter 3](https://leanprover-community.github.io/logic_and_proof/natural_deduction_for_propositional_logic.html), hypothesis-dependent proofs and introduction/elimination rules.
- **CSP:** Poole and Mackworth, *Artificial Intelligence: Foundations of Computational Agents*, 3rd ed., [§4.1](https://artint.info/3e/html/ArtInt3e.Ch4.S1.html), variables, assignments, and constraints.
- **GAC:** same authors, [§4.3](https://artint.info/3e/html/ArtInt3e.Ch4.S3.html), constraint-network incidence and consistency algorithms; especially the example of a locally consistent unsatisfiable network.
- **VE:** same authors, [§4.5](https://artint.info/3e/html/ArtInt3e.Ch4.S5.html), elimination by combining constraints and projecting, with reconstruction.
- **RA:** same authors, [Appendix A.4](https://artint.info/3e/html/ArtInt3e.A1.S4.html), selection, projection, and natural join.
- **FG:** Kschischang, Frey, and Loeliger (2001), [*Factor Graphs and the Sum-Product Algorithm*](https://www.isiweb.ee.ethz.ch/papers/arch/aloe-2001-1.pdf), introduction and discussion of exact versus approximate computation. No claim that our propagator implements their algorithm.
- **CG:** Sowa, [*Conceptual Graph Summary*, §1](https://jfsowa.com/cg/cgif.htm), an author-maintained account of Common Logic/CGIF, coreference, typing, and ordering. Consult the actual standard before claiming conformance.
- **AFP:** From et al. (2019), [*A Sequent Calculus for First-Order Logic*](https://isa-afp.org/entries/FOL_Seq_Calc1.html), Isabelle formalization of soundness and completeness with a tableau connection. Its source calculus is a candidate for certificate checking; no integration was performed here.
- **INST:** Goguen and Burstall (1992), *Institutions: Abstract Model Theory for Specification and Programming*, JACM 39(1), 95–146; [author project bibliography](https://cseweb.ucsd.edu/~goguen/projs/inst.html). Bibliographic summary retrieved; direct HTML access timed out and the linked PDF's text extraction was unreliable. Detailed axioms are not relied on in this recommendation.
- **TRUTH:** Kripke (1975), [*Outline of a Theory of Truth*](https://www.impan.pl/~kz/truthseminar/Kripke_Outline.pdf), pp. 700–705 on partial predicates, valuation, and fixed points. The current Boolean equation profile is not an implementation of Kripke's construction.
