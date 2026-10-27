# Finite snow-object prototype

Status: experimental kernel and schematic for review, built from main after PR #4 merged. The diagram's marks are proposals under foundation section 10, not an approved tutorial notation. No existing page is replaced or deployed.

## Executable contract

`src/reasoning-object.js` exports `compile`, `snow`, `explore`, `verify`, `solve`, and `project` through CommonJS, and exposes `ReasoningObject` when embedded in the review fragment. This is a separate module; legacy renderers do not import it.

`compile(source)` accepts version 1, an array of named Boolean `facts`, and named `sentences` with expression bodies. Expressions have globally unique IDs and one of four operators:

| Operator | Fields | Constraint generated |
| --- | --- | --- |
| `fact` | `target` world-fact ID | Expression value agrees with the world fact |
| `reference` | `target` sentence ID | Expression value agrees with the named sentence |
| `not` | `arg` expression | Result is the opposite of the argument |
| `and` | `left`, `right` expressions | Result is true exactly when both arguments are true |

Each sentence also generates an agreement constraint between its candidate value and its body. The compiled, frozen object retains syntax, typed variables, constraints with origins, and the world scope (all Boolean combinations of the declared facts). A world-fact atom is a finite propositional representation, not yet a general first-order structure. Unsupported syntax/size is rejected with an error, not a semantic verdict. Limit: 16 total Boolean variables, including expression values.

The public operations expect an object returned by `compile`. There is no deserializer for arbitrary supplied compiled objects yet. Neither this syntax format nor the schematic is integrated with legacy geometry/read-back.

## Assumptions and records

A context has an `id` and `assumptions: [{variable, value}]`. Values must be Boolean; each variable may be assumed at most once. The prototype has independent contexts, not parent/child inheritance or history merging.

`explore` repeatedly examines the allowed tuples of one relation under its known values. If all remaining tuples agree on an unassigned variable, it records an inference. If none remain, it records a conflict. Every derived record identifies its relation, premise record IDs, conclusion, and context. An assumption record is a different kind from an inference. The deterministic scheduling order is an implementation choice, not logical time.

`verify` reconstructs each local justification using only the cited earlier premises and that relation. It rejects cross-context references, invalid assumptions, altered conclusions, unsupported conflicts, and false complete-assignment claims. An `open` trace certifies its recorded steps, not that propagation is saturated or the problem satisfiable.

The statuses are `conflict`, `complete-assignment`, and `open`. In particular, with only snowfall=true, this propagator remains open even though the exact finite solver finds no model. This deliberately exposes the difference between local inference and a complete finite query.

`solve` exhaustively enumerates all Boolean variables and checks every constraint under the context. `project` groups those solutions by visible variables and retains full witnesses (supporting complete assignments). Projection does not delete hidden constraints. These procedures are bounded and exponential; they are not a scaling solution or general decision procedure.

## Review schematic

Build the self-contained fragment with:

```
python3 review/build-snow.py
```

The output `review/snow-schematic.html` is an inline fragment, not the deployed site. The template contains the six terminals and five relations of the snow object. Its geometry is specialized to this example; the underlying values and records come from the kernel. The template is not a generic syntax renderer.

The controls expose nine contexts, including all four complete world/candidate combinations, one at a time; they do not simultaneously display the complete branching history. Whole-network and current-inference views share the same trace. The current-inference view de-emphasizes unrelated parts without deleting them. Compatible-worlds view is a separate exact existential query (a world is admitted when some complete consistent assignment supports it); it ignores the current playback step while retaining the selected assumptions.

No oscillating pulse animation, revision semantics, branch merging, or arbitrary question-to-view compiler is claimed. The proposed connections have no permanent computational direction.

## Evidence and limits

Run `bash tests/run-all.sh`:

- Snow: all 729 partial assignments of six variables; generated traces verified; exact results compared with an independent Boolean expression oracle.
- Every generated inference checked against independent local Boolean evaluation; 16 malformed syntax/record/query cases rejected.
- All four world/candidate cases checked; correlated two-sentence projections and hidden-liar projections checked.
- Nine contexts and three views exercised at 320 and 736 pixel widths with a lightweight DOM harness, including rewind restoration. This is not a browser layout test.
- Existing repository tests retained.

Rendered SVGs were visually inspected at both widths. A full browser interaction/accessibility audit remains outstanding. Tests establish these finite cases, not general soundness/completeness proofs. Mathematical and visual acceptance remain separate.

Sources: classical Boolean tables and constraint incidence as identified in [the project contract](reasoning-objects.md#9-established-sources-versus-proposed-synthesis). This implementation is a project-specific finite prototype of those ideas.
