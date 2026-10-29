# Quantifier scope as a first-order evaluation game

**Status:** independent, bounded research experiment; not a production notation or a new truth theory. Run `python3 research/quantifier-scope/check.py` to verify the checked diagrams and strategies, or pass `--write` to regenerate the diagrams. No dependencies beyond Python's standard library.

[View the generated diagrams and their gradual explanation](game-diagrams.md).

## Why this example

The existing finite Boolean work addresses ordinary inference, truth-teller/liar, the snowfall sentence, exact projections, and signed reference cycles. This independent experiment advances the **quantifier-scope** item in the zoo: the same facts can support `∀x ∃y Loves(x,y)` without supporting `∃y ∀x Loves(x,y)`. It asks whether an established visual calculus can expose a meaningful difference in dependence rather than merely redraw different formulas.

## Formal object and checkable meaning

The fixed ordinary structure `M` has nonempty domain `D={a,b}`, constants `A^M=a`, `B^M=b`, and binary predicate interpretation `Loves^M={(a,a),(b,b)}`. The constants, individuals, relation symbol, and actual relation are distinct. An edge in the world diagram denotes a **member of the relation**, not a proof step.

Two closed sentences are evaluated in the same `M`:

```
Φ := ∀x∈D ∃y∈D Loves(x,y)
Ψ := ∃y∈D ∀x∈D Loves(x,y)
```

`M ⊨ Φ`: the Verifier's witness function is `y=f(x)=x`. `M ⊭ Ψ`: for every proposed `y`, the Falsifier can challenge with the other individual `x≠y`.

**Game translation.** A position is a formula suffix together with a first-order variable environment; it is not an alternate world. At an `∀` node the Falsifier selects the next domain element; at `∃` the Verifier selects it. The atomic terminal is a win for Verifier exactly when `(x,y) ∈ Loves^M`. The *game tree* contains both legal choices at every node. The thick edges identify a **strategy** (a rule specifying the winning player's move after earlier choices). A strategy wins only if every play compatible with it ends in that player's victory. All opponent moves remain in the figure. Neither truth-value candidates for self-referential sentences nor temporary proof assumptions are introduced in this finite first-order demonstration.

**Scope and checks.** `check.py` independently compares (i) recursive first-order satisfaction, (ii) an explicit row/column characterization, and (iii) backward-induction game outcomes, then verifies extracted strategies against *every* opponent continuation. The checks cover **530 ordinary structures**: all 2, 16, and 512 interpretations of a binary predicate on fixed domains of cardinalities 1, 2, and 3 respectively; **1,060** formula–structure comparisons. The two displayed strategies are checked separately. The generated Mermaid drawing is required to match the checked model and recorded choices byte-for-byte. This does not mechanically prove the general game-semantics equivalence theorem or implement a general first-order parser.

**View preservation.** The relation on pairs is `{(a,a),(b,b)}`. Projections onto the first or second coordinate each give `{a,b}` but their Cartesian product (all pairs formed independently) adds two nonexistent pairs. Hiding an argument requires retaining paired witnesses or an equivalent joint condition. The game tree is another question-directed view of the same `M`: it adds play histories without identifying those histories with worlds.

## Existing diagrammatic foundations

- [C. S. Peirce, *Existential Graphs*, MS 514](https://www.jfsowa.com/peirce/ms514.htm): cuts and identity lines offer diagrammatic first-order inference; this prototype does not implement the beta rules.
- [John F. Sowa, *Conceptual Graph Standard* (draft, 2000), §8.2](https://www.w3.org/DesignIssues/Sowa/cgstand.htm): explicitly distinguishes the quantifier orders with scoped conceptual graphs and defines precedence conventions. This is substantive scope capability, not merely sentence illustration. [Sowa, *Semantic Foundations of Contexts*, §6](https://www.jfsowa.com/pubs/contexts.htm) develops nested graph models; no claim that contexts cannot express the requested object is justified here.
- [Wilfrid Hodges, *Logic and Games*, §3](https://plato.stanford.edu/entries/logic-games/): describes established first-order evaluation games and their correspondence with ordinary satisfaction. [Grädel et al., *Logic and Games*, §1.4](https://logic.rwth-aachen.de/files/LS/LS-chapter1.pdf) gives a formal model-checking presentation.

**Selection:** a standard evaluation game is sufficient to represent the *quantifier-dependency contrast* and its paths directly. Whether contextual conceptual graphs can unify this view with the self-reference network and retained failed candidates is a **translation obligation**, not a demonstrated defect or a requirement to invent a new logic.

## Boundaries and relation to the remaining zoo

This result adds one demonstrated finite first-order item to the earlier Boolean core; it is **not** a general bridge to predicate logic. It does not handle nested quotation of sentences, truth predicates over sentence domains, genuine arithmetic diagonalization, the halting theorem, or unnamed strange loops. These need explicit syntactic encodings and semantic or proof extensions. A branch in a game is an alternative play, not a speculative truth assignment; the two must not be conflated.

This self-contained experiment is based directly on `main`, without importing any open PR's code or assuming that a proposed notation is approved. No live tutorial or deployment is changed.