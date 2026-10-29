"""Two quantifier orders as finite first-order model-checking games.

Standard library only. Run `python3 check.py --write` to regenerate the
Mermaid atlas, or `python3 check.py` to verify it and enumerate small models.
"""
from itertools import product
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
# Each prefix is a nested pair of Tarski quantifiers, followed by Loves(x,y).
PREFIXES = (
    (("forall", "x"), ("exists", "y")),
    (("exists", "y"), ("forall", "x")),
)
D = ("a", "b")
DIAGONAL = frozenset({("a", "a"), ("b", "b")})


def tarski(prefix, domain, loves, env=None):
    """Truth of the closed formula in a finite structure (not game search)."""
    env = {} if env is None else env
    if not prefix:
        return (env["x"], env["y"]) in loves
    quantifier, name = prefix[0]
    vals = (tarski(prefix[1:], domain, loves, env | {name: d}) for d in domain)
    return all(vals) if quantifier == "forall" else any(vals)


def game(prefix, domain, loves, env=None):
    """Backward-induction winner; True means Verifier, False means Falsifier."""
    env = {} if env is None else env
    if not prefix:
        return (env["x"], env["y"]) in loves
    quantifier, name = prefix[0]
    outcomes = [game(prefix[1:], domain, loves, env | {name: d}) for d in domain]
    if quantifier == "exists":
        return True in outcomes     # Verifier selects a winning child.
    return False not in outcomes    # Falsifier selects a losing-for-Verifier child.


def strategy(prefix, domain, loves, env=None):
    """At the winning player's nodes only, record a winning move.

    The keys are immutable ordered assignments, so different contexts never
    accidentally share a choice. At opponent nodes, leave *all* moves open.
    """
    env = {} if env is None else env
    goal = game(prefix, domain, loves, env)
    moves = {}

    def visit(rest, e):
        if not rest:
            return
        quantifier, name = rest[0]
        player_is_winner = (quantifier == "exists") == goal
        key = (len(rest), tuple(sorted(e.items())))
        if player_is_winner:
            picks = [d for d in domain if game(rest[1:], domain, loves, e | {name: d}) == goal]
            assert picks, "An alleged winner lacks a winning move"
            moves[key] = picks[0]
        # Visit every possibility: even losing-side moves remain in the game.
        for d in domain:
            visit(rest[1:], e | {name: d})

    visit(prefix, env)
    return goal, moves


def certify(prefix, domain, loves, winner, moves):
    """Check all opponent plays against the recorded strategy."""
    def visit(rest, e):
        if not rest:
            return ((e["x"], e["y"]) in loves) == winner
        quantifier, name = rest[0]
        key = (len(rest), tuple(sorted(e.items())))
        winner_to_move = (quantifier == "exists") == winner
        if winner_to_move:
            assert key in moves and moves[key] in domain
            choices = [moves[key]]
        else:
            assert key not in moves
            choices = domain
        return all(visit(rest[1:], e | {name: d}) for d in choices)
    return visit(prefix, {})


def relation_characterization(prefix, domain, loves):
    """Independent row/column condition for the two documented sentences."""
    if prefix == PREFIXES[0]:
        return all(any((x, y) in loves for y in domain) for x in domain)
    if prefix == PREFIXES[1]:
        return any(all((x, y) in loves for x in domain) for y in domain)
    raise ValueError("Unsupported formula")


def model_check():
    checks = 0
    for n in (1, 2, 3):
        domain = tuple(chr(ord("a") + i) for i in range(n))
        pairs = tuple(product(domain, repeat=2))
        for bits in product((False, True), repeat=len(pairs)):
            loves = frozenset(pair for pair, included in zip(pairs, bits) if included)
            for prefix in PREFIXES:
                truth = tarski(prefix, domain, loves)
                assert truth == relation_characterization(prefix, domain, loves)
                assert truth == game(prefix, domain, loves)
                winner, moves = strategy(prefix, domain, loves)
                assert winner == truth
                assert certify(prefix, domain, loves, winner, moves)
                checks += 1
    assert tarski(PREFIXES[0], D, DIAGONAL)
    assert not tarski(PREFIXES[1], D, DIAGONAL)
    # The first sentence needs a response depending on the preceding challenge;
    # the second is refuted by a challenge depending on the initial claim.
    left_win, left_moves = strategy(PREFIXES[0], D, DIAGONAL)
    right_win, right_moves = strategy(PREFIXES[1], D, DIAGONAL)
    assert left_win and not right_win
    assert left_moves[(1, (("x", "a"),))] == "a"
    assert left_moves[(1, (("x", "b"),))] == "b"
    assert right_moves[(1, (("y", "a"),))] == "b"
    assert right_moves[(1, (("y", "b"),))] == "a"
    # Exact relational projection preserves supported pairs; independent
    # unary projections would introduce two spurious cross-pairs.
    x_view = {x for x, _ in DIAGONAL}
    y_view = {y for _, y in DIAGONAL}
    assert x_view == y_view == set(D)
    assert {(x, y) for x in x_view for y in y_view} - DIAGONAL == {
        ("a", "b"), ("b", "a")}
    return checks


def mermaid_game(prefix, tag):
    """Emit the COMPLETE game tree, indicating only justified strategy edges."""
    winning, moves = strategy(prefix, D, DIAGONAL)
    lines = ["flowchart TB"]
    links = []
    marks = {"forall": [], "exists": [], "win": [], "lose": []}
    serial = 0

    def visit(rest, e):
        nonlocal serial
        serial += 1
        nid = f"{tag}N{serial}"
        if not rest:
            true = (e["x"], e["y"]) in DIAGONAL
            marks["win" if true else "lose"].append(nid)
            lines.append(f'  {nid}["Loves({e["x"]},{e["y"]}) = {"T" if true else "F"}"]')
            return nid
        quantifier, name = rest[0]
        marks[quantifier].append(nid)
        sign = "∀" if quantifier == "forall" else "∃"
        scope = ", ".join(f"{k}={v}" for k, v in sorted(e.items()))
        label = f"{sign} chooses {name}" + (f" given {scope}" if scope else "")
        lines.append(f'  {nid}(["{label}"])')
        for d in D:
            child = visit(rest[1:], e | {name: d})
            chosen = moves.get((len(rest), tuple(sorted(e.items())))) == d
            lbl = f"{name}={d}" + (" [strategy]" if chosen else "")
            links.append((nid, child, lbl, chosen))
        return nid

    visit(prefix, {})
    lines += [f'  {a} -->|"{label}"| {b}' for a, b, label, _ in links]
    lines += ["  classDef forall fill:#edf1f8,stroke:#48617d", 
              "  classDef exists fill:#f8f1e6,stroke:#80643e",
              "  classDef win fill:#e7f5eb,stroke:#327149",
              "  classDef lose fill:#fdebea,stroke:#ad4b48"]
    for k, names in marks.items():
        lines.append("  class " + ",".join(names) + " " + k)
    for i, (_, _, _, chosen) in enumerate(links):
        if chosen:
            lines.append(f"  linkStyle {i} stroke:#176b4a,stroke-width:3px")
    return "\n".join(lines)


def document():
    return """# Two quantifier orders; one fixed world

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
""" + mermaid_game(PREFIXES[0], "G1") + """
```

The Verifier's winning strategy is `y=x`: choose `a` after `x=a`, and `b`
after `x=b`. The sentence is true in the fixed model.

## 2. Someone is loved by everyone: `∃y ∀x Loves(x,y)`

Now the Verifier must select `y` *before* seeing the Falsifier's `x`.
The Falsifier can always choose a different person, `x≠y`.

```mermaid
""" + mermaid_game(PREFIXES[1], "G2") + """
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
"""


def main(argv):
    count = model_check()
    dest = HERE / "game-diagrams.md"
    generated = document()
    if argv == ["--write"]:
        dest.write_text(generated, encoding="utf-8")
    else:
        assert argv == [], "Usage: check.py [--write]"
        assert dest.read_text(encoding="utf-8") == generated, "Diagram file stale"
    print(f"PASS: {count} game/model comparisons across 530 nonempty structures; "
          "two certified strategies; diagram source matches finite model")


if __name__ == "__main__":
    main(sys.argv[1:])