# Two quantifier orders; one fixed world

The **model** is a fixed ordinary structure, not a reasoning branch. Domain
`D={a,b}`; `A` and `B` are *names* whose denotations are `a` and `b`.
`Loves` is the binary relation `{(a,a),(b,b)}`. An edge from a person to
itself means that person loves themself; cross-pairs are absent.

```mermaid
flowchart LR
  a((a)) -->|Loves| a
  b((b)) -->|Loves| b
```

## 1. Every person loves someone: `∀x ∃y Loves(x,y)`

In this **evaluation game**, the Falsifier chooses `x` at `∀`; subsequently
the Verifier chooses `y` at `∃`. A leaf is won by the Verifier iff its
atomic assertion is true in the fixed model. Thick, labelled strategy edges
show how the winning player answers; *all* legal opponent moves remain visible.

```mermaid
flowchart TB
  G1N1(["∀ chooses x"])
  G1N2(["∃ chooses y given x=a"])
  G1N3["Loves(a,a) = T"]
  G1N4["Loves(a,b) = F"]
  G1N5(["∃ chooses y given x=b"])
  G1N6["Loves(b,a) = F"]
  G1N7["Loves(b,b) = T"]
  G1N2 -->|"y=a [strategy]"| G1N3
  G1N2 -->|"y=b"| G1N4
  G1N1 -->|"x=a"| G1N2
  G1N5 -->|"y=a"| G1N6
  G1N5 -->|"y=b [strategy]"| G1N7
  G1N1 -->|"x=b"| G1N5
  classDef forall fill:#edf1f8,stroke:#48617d
  classDef exists fill:#f8f1e6,stroke:#80643e
  classDef win fill:#e7f5eb,stroke:#327149
  classDef lose fill:#fdebea,stroke:#ad4b48
  class G1N1 forall
  class G1N2,G1N5 exists
  class G1N3,G1N7 win
  class G1N4,G1N6 lose
  linkStyle 0 stroke:#176b4a,stroke-width:3px
  linkStyle 4 stroke:#176b4a,stroke-width:3px
```

The Verifier's winning strategy is `y=x`: choose `a` after `x=a`, and `b`
after `x=b`. The sentence is true in the fixed model.

## 2. Someone is loved by everyone: `∃y ∀x Loves(x,y)`

Now the Verifier must select `y` *before* seeing the Falsifier's `x`.
The Falsifier can always choose a different person, `x≠y`.

```mermaid
flowchart TB
  G2N1(["∃ chooses y"])
  G2N2(["∀ chooses x given y=a"])
  G2N3["Loves(a,a) = T"]
  G2N4["Loves(b,a) = F"]
  G2N5(["∀ chooses x given y=b"])
  G2N6["Loves(a,b) = F"]
  G2N7["Loves(b,b) = T"]
  G2N2 -->|"x=a"| G2N3
  G2N2 -->|"x=b [strategy]"| G2N4
  G2N1 -->|"y=a"| G2N2
  G2N5 -->|"x=a [strategy]"| G2N6
  G2N5 -->|"x=b"| G2N7
  G2N1 -->|"y=b"| G2N5
  classDef forall fill:#edf1f8,stroke:#48617d
  classDef exists fill:#f8f1e6,stroke:#80643e
  classDef win fill:#e7f5eb,stroke:#327149
  classDef lose fill:#fdebea,stroke:#ad4b48
  class G2N2,G2N5 forall
  class G2N1 exists
  class G2N3,G2N7 win
  class G2N4,G2N6 lose
  linkStyle 1 stroke:#176b4a,stroke-width:3px
  linkStyle 3 stroke:#176b4a,stroke-width:3px
```

The Falsifier's strategy wins against either initial `y`, so the sentence
is false in precisely the same model. Quantifier order changes the allowed
dependencies, not the ordinary world.

## 3. Exact view versus destructive simplification

The joint relation supplies only `(a,a)` and `(b,b)` as witnesses.
Projection onto `x` alone and onto `y` alone each shows `{a,b}`. Multiplying
those unary results creates the **spurious** pairs `(a,b)` and `(b,a)`.
Thus a view hiding one individual must retain the joint relation or its
witness links; two independent value menus do not preserve the answer.

These trees use **standard first-order model-checking game rules**, not new
logical operators. Decision nodes are positions, arrows are legal choices,
and leaves are evaluated facts. Game paths are plays, *not possible worlds*
or completed formal proofs. The source checker independently validates all
strategies and the equivalence with Tarski's quantifier semantics.