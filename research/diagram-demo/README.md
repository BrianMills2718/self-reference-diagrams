# Reasoning through constraints: first demonstration

28 October 2026. **Research result for visual review**, based directly on main
`07d54f0`. PRs #3, #5, and #6 were open and #4 was merged when checked. Their
proposals were read as context; no implementation was inherited from them.

Open **[index.html](index.html)** for the gradual six-plate atlas. SVG files are
scalable source pictures; PNGs are previews. **[evidence.json](evidence.json)**
contains the linked instances, rejected candidates, scoped histories, and exact
view witnesses. No production renderer, live tutorial, or deployment changes.

Conjunction tests ordinary inference; teller versus liar separates reference
from inconsistency; snow tests investigations in both directions; opposite
references and a hidden liar test views. These are consequential tests of the
larger zoo, not a replacement for it.

## Result and provisional choice

**Established constraint notation suffices for this finite demonstration.**
Factor graphs (networks of variables and local conditions) expose shared values
on which the constraints act. The double-cover construction gives a structural
diagnostic for pure signed reference cycles. That diagnostic does not decide
branching conjunction systems. No general visual test for paradox is established.

Three primary-source candidates were examined:

| Candidate | Source and expressive capabilities | Reasoning and choice here |
| --- | --- | --- |
| Peirce's existential graphs | [MS 514 with Sowa's commentary](https://www.jfsowa.com/peirce/ms514.htm): assertion sheet, juxtaposition, negation cuts, and identity lines | Rule 1e permits erasure in a positive area. Plate 01 uses this rule to derive p from p AND q. Broader insertion, iteration, and double-cut rules are not implemented here. |
| Conceptual graphs and contextual models | [Draft CG standard](https://www.w3.org/DesignIssues/Sowa/cgstand.htm), §§6.8, 9.2–9.3; [Sowa, Semantic Foundations of Contexts](https://www.jfsowa.com/pubs/contexts.htm), §§2,6 | Nested contexts express scope; generalization/specialization depend on negative nesting. Nested graph models represent entities, relations, and world models. They remain a candidate for the broader object, not merely a syntax view. |
| Factor graphs | [Kschischang, Frey, Loeliger (2001)](https://www.isiweb.ee.ethz.ch/papers/arch/aloe-2001-1.pdf), §II, pp. 499–500: variable–factor incidence represents a factored global function | Use finite Boolean indicator relations. The paper's sum-product algorithm is not the checker used here; cyclic message passing is not claimed to be exact. |

This does not demonstrate a failure of conceptual graphs. Sowa's NGM definition
forbids literal self-nesting, but a reference relation between sentence records
is not self-nesting. The missing work is a translation preserving syntax
occurrences, truth-agreement constraints, failed candidates, scoped proofs, and
query witnesses in that contextual account. No impossibility is claimed.

For this experiment, ordinary propositional semantics, factor incidence, finite
relation reduction, exhaustive branching, and relational projection are adequate.
Their source-linked presentation is a proposed synthesis (assembly of established
parts), not a new truth theory or an irrevocable foundation decision.

## Gradual reading sequence

1. **01 Ordinary reasoning.** p and q on the assertion sheet assert both; erasing
   q derives p. Circles then introduce Boolean value variables, squares introduce
   relations, and wires mean “is an argument of.” The = square links the sentence
   candidate s to its body value b.
2. **02 Self-reference.** Tr(S) selects registry entry S and takes its candidate
   value s. The teller's s=s permits either choice separately. The liar requires
   b≠s and b=s simultaneously; both candidates fail.
3. **03 Complete snow candidates.** p is the world observation, n the negated
   reference value, and b the body value. All four (p,s) combinations remain
   visible. A dashed = square locates disagreement, as a proposed annotation.
4. **04 Scoped investigations.** Each panel has its own temporary hypothesis.
   Relation reduction supplies consequences. Under p=T it stops before detecting
   conflict; branching on s closes both cases. Plate 03 contains those trials.
5. **05 Views.** Eliminating body variables yields the joint relation A≠B. Its
   two tuples remain paired. Hiding B leaves A's two values with witness links.
   A collapsed disconnected liar still makes global projection empty.
6. **06 Signature.** Each sentence has F/T value copies. Positive references
   connect equal copies; negative references connect opposite copies. The
   connectivity criterion below applies only to pure signed cycles.

Panel borders group pictures; they are not logical cuts. The proof arrow on
plate 01 denotes the named erasure step, not a constraint wire. Labels {F,T}
are locally retained possibilities, not additional truth values. T/F colour
duplicates the written labels. Empty domains mean a detected conflict.

The review tasks are concrete: locate why `snow:case:2` fails; explain why s=F
forces p=F under the background agreement condition; distinguish the two A,B
pairs from four independent recombinations. These tasks have not yet been
evaluated with the user. Correct code does not establish visual intelligibility.

## Formal scope and compilation

The ordinary interpretation uses a fixed nonempty domain
`{entity:snow, entity:wind}`. Constants Snow and Wind denote those entities;
Falling and Blowing are unary predicates (properties of individual entities).
p abbreviates Falling(Snow); q abbreviates Blowing(Wind). Listed observations
vary independently. Other predicate memberships may vary without affecting
the observation: each displayed case represents a class of worlds.

Examples without listed facts have one relevant world class. Snow has two;
conjunction has four. World coordinates, candidate sentence values, syntax
occurrences, entities, and symbols have separate records. This is a
propositional abstraction (retaining only the listed observations), not a general
first-order model explorer. The two entities are formal stand-ins.

The compiler accepts a finite sentence registry with grammar:

```text
e ::= fact(p) | ref(S) | not(e) | and(e_1,...,e_k)
```

References must resolve to registry entries. Empty conjunction means true.
Expression trees remain finite when the reference graph is cyclic; no recursive
unfolding is used. Fresh occurrence variables preserve distinct occurrences of
identical text. Paths such as `S/body/1/0` are stable within an instance and across
its views; stability across arbitrary syntax edits is not implemented.

Direct evaluation interprets ref(S) as the candidate v(S), without assuming
that the candidate agrees with S's body. With the declared world classes W:

```text
U = W × {F,T}^Sentences
C = {(w,v) in U : v(S) = evaluate(body(S),w,v) for every S}
```

Each occurrence o gets a fresh Boolean variable x_o. A fact/reference occurrence
imposes equality with its observation/candidate. NOT imposes inequality with its
child. AND imposes equality with the conjunction of its children. A separate
agreement factor imposes s=x_root. Each relation stores its permitted tuples,
scope, and source ID. Multiplying their indicators gives 1 exactly on solutions.

**Correspondence argument.** Fix (w,v). Induction on expression depth gives a
unique occurrence assignment satisfying the occurrence relations: leaf
equalities fix values; NOT and AND uniquely fix each parent. The root equals
direct compositional evaluation. The additional agreement factors hold exactly
for members of C. Conversely, every compiled solution restricts to such a
candidate with that unique extension. Thus compilation preserves and reflects
solutions and adds no spurious multiplicity, for this grammar. This is a written
mathematical argument, not a proof-assistant certificate.

`candidates()` retains all base candidates with their unique occurrence values,
including agreement failures. `brute_models()` independently enumerates every
compiled variable, without using the evaluator or candidate extension routine.

## Inference and certificate obligations

The implemented rule is **local support reduction**: at factor f, delete values
of an incident variable x that occur in no permitted f-tuple compatible with
the current argument domains. A trace records f, x, the exact pre-step domains,
and the reduced domain. `verify_trace()` independently replays each reduction
against the finite relation and forbids steps after a branch closes.

**Soundness argument.** A full solution satisfies every factor. If it lies in
the pre-step domains, its x value occurs in a compatible tuple and cannot be
removed. Induction over the trace preserves every solution extending the
hypotheses. An empty domain therefore proves no solution. Nonempty domains
alone prove neither existence nor complete entailment; snow under p=T is an
executable counterexample to that stronger claim.

`search()` produces finite scoped branching certificates. Each node stores its
complete assumptions and a local trace. Splitting fixes a previously unfixed
variable in both Boolean ways. Child hypotheses inherit the parent's. Closed
leaves have checked empty domains. Witness leaves assign every variable and
satisfy every relation. `verify_search()` checks inheritance, both branches,
traces, and witnesses; missing a branch or changing a world hypothesis fails.

**Finite completeness argument.** Sound reduction preserves models; a binary
split partitions them; every path fixes a fresh variable. With finitely many
Boolean variables, the search terminates. A singleton state surviving all
relations is a model. A complete tree therefore enumerates all models, and an
all-closed tree certifies absence. This is not a practical complexity guarantee
or a universal solver. The implementation uses ordinary Python assertions,
without `-O`; it has no Isabelle integration or verified general metatheory.

Plate 04's explanatory route may apply the same relations in another valid
order than the deterministic saved trace. The evidence gives the exact checked
order and scope. Every snow investigation includes the background
s ↔ (p AND NOT s). Without it, “S is false” has no weather consequence.

## Drawing and view preservation

SVG metadata retains source object, variable, and factor IDs. Generation checks
each network's complete edge-incidence multiset against the encoded relations.
This checks abstract connectivity, not arbitrary-pixel read-back, label placement,
or human comprehension. PNGs were rendered and inspected separately.

Pictures collapse fact/reference copy equalities onto named values.
`reduced_graph()` records hidden factor IDs and occurrence aliases; the full
object retains them. Body-agreement factors remain visible, including failures.
The collapse is reversible with the source object, not an identification of a
sentence with its value or deletion of its reference occurrence.

Exact projection after restriction is:

```text
View_J,H(R) = {a|J : a in R and H(a)}
```

Each visible tuple retains exactly its full source case IDs. Thus a tuple appears
iff a permitted source extension exists; expansion recovers exactly its witnesses.
All coordinate subsets are checked for every fixture, over both U and C.

For snow, hiding p in U leaves two s groups of two cases each: one group has
one success and one failure; the other has two failures. Restricting first to C
leaves only s=F with one witness. Opposite references project onto two (A,B)
tuples; taking the product of independent domains would invent two more. A
disconnected liar makes C empty, so every global projection is empty. Evaluating
Q=p after removing L's constraint deliberately changes the theory.

Plate 05's ≠ square is the derived joint relation. Its ∃B square abbreviates
existential elimination of B from A≠B, yielding a unary relation supporting
both A values. These two summaries are drawn from checked relations, not a
general elimination renderer. Collapsing syntax retains the hidden structure;
semantic projection changes visible coordinates while retaining supported tuples.

## A scoped visual-signature theorem

For n≥1, a **pure signed cycle** has one successor per sentence, with optional
negation, imposing

```text
v_i = v_(i+1 mod n) XOR ε_i,  ε_i ∈ {0,1}.
```

Its signed double cover has vertices (i,b) for b∈{0,1} and edges
(i,b)—(i+1 mod n,b XOR ε_i). XOR means “different when ε_i is 1.”

**Theorem.** Odd total negative parity gives one cover component and no Boolean
model; even parity gives two components and exactly two models.

**Proof.** Following the cycle once sends (0,b) to
(0,b XOR (ε_0 XOR ... XOR ε_(n−1))). Odd parity connects both copies of 0,
and travelling along the cycle then connects both copies of every sentence.
Consistency would require v_0=NOT v_0. Even parity preserves the initial bit;
each other value is uniquely determined by it, giving two disjoint components
and two models. This includes n=1, independently of any curved drawing.

The diagnostic survives relabelling, redrawing, and edge subdivision with the
same total sign. It concerns the signed reference graph, not bare factor-graph
incidence. Geometric crossings have no logical force. All 510 polarity patterns
for n=1..8 were checked against 87,380 candidates. A length-128 odd cycle was
checked structurally; its result follows from the theorem, not enumeration.

**Failure of extension.** s=p AND NOT s contains a negative self-reference but
does not impose s=NOT s when p=F: (p,s)=(F,F) is a model. Treating dependency
polarity as an unconditional equality would give a false diagnosis. Branching
operators need their full relations. The recorded branching block reduces to
A=NOT(A AND p), with one model at p=F and none at p=T. No theorem about
arbitrary paradoxes, Gödel sentences, or halting follows from the cycle result.

## Coverage against the full zoo

| Family | Status | Evidence or next obligation |
| --- | --- | --- |
| S:=p | Demonstrated in checks; visible as Q=p | Both world classes and unique values. |
| S:=NOT p | Demonstrated in checks; no separate plate | Four candidates. |
| S:=p AND q; infer p | Demonstrated visually and computationally | Peirce erasure; local relation proof; all four world cases. |
| Truth-teller; liar | Demonstrated visually and computationally | Two versus zero Boolean agreement assignments. |
| Snow-dependent self-reference | Demonstrated visually and computationally | Four candidates, both directions, and hide-world query. |
| A:=NOT Tr(B); B:=Tr(A) | Demonstrated in checks; no separate plate | No model. |
| Two negative references | Demonstrated visually and computationally | Two correlated models and exact witnesses. |
| Arbitrarily long pure cycles | Demonstrated family theorem and finite pictures | All signs at lengths 1–8 tested; 128-node structural check. |
| n independent truth-tellers | Expressible; checked family, not drawn | n=1..10 enumerated. Independence gives 2^n models in general, without enumerating them. |
| Recorded branching blocks | One block checked; general family expressible, not drawn | B=A and C=p imply A=NOT(A AND p). For k independent blocks, exactly one model iff every p_i=F. This general argument is written, not mechanically proved. |
| Quantifier-scope contrast | Expressible in repository first-order grammar and contextual CG/EG foundations; not demonstrated here | Extend this propositional compiler with explicit domains, binding, and scope-preserving translation. |
| Ordinary claim with disconnected liar | Demonstrated in the view plate and checks | Global projection empty; local evaluation changes constraints. |
| Quantification over sentences | Requires extension | Domain, binding, coding/reference, and truth interpretation. |
| Provability and arithmetic diagonalization | Requires extension | Theory, code representation, derivability conditions, actual diagonal construction. |
| Halting impossibility | Requires extension | Program operational semantics, universal simulation, diagonal proof. |
| Other strange loops | Unresolved until precise examples | No blanket signature is claimed. |

## Reproduction and evidence boundaries

From the repository root, with Python 3.9+ and Node/Bash for legacy checks:

```bash
python3 research/diagram-demo/check.py
python3 research/diagram-demo/check.py --verify research/diagram-demo/evidence.json
python3 research/diagram-demo/draw.py
bash tests/run-all.sh
```

Checks cover 10 fixtures, 1,348 full compiled assignments, 186 local traces,
112 joint projections, the cycle/independence families, and three rejected
certificate mutations: unsupported reduction, missing branch, changed inherited
hypothesis. `--verify` reads saved evidence without overwriting it, reconstructs
relations from syntax, and checks candidates, scoped certificates, and witnesses.

`draw.py` reruns checks, emits six SVGs and self-contained HTML, and validates
network incidence. PNG generation is optional and requires an SVG rasterizer
(a vector-to-pixel converter). Included PNGs were generated from the SVGs and
visually inspected. Legacy tests pass independently; no legacy engine or embedded
source copy changed. Finite tests, mathematical arguments, and computational
certificates are distinct evidence; no proof assistant certifies this assembly.

**Next step:** evaluate the visual routes and alternatives with the reader.
If intelligible, implement coordinated selection between syntax, constraints,
and scoped histories. Otherwise revise the pictures while preserving the
encodings. Framework generalization must test quantified scope and actual
diagonal proofs, rather than extrapolate from snow.
