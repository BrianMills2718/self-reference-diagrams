# Foundation: the objects behind the diagrams

Historical external copy: https://claude.ai/artifact/V3ahWhPUDtTRbY1N3PmT8D . Later repository revisions may differ.

This page defines the existing sentence component and its marks. The governing [project contract](reasoning-objects.md) broadens the target to structured reasoning objects containing sentences, worlds, facts, values, suppositions, and histories. These are components even when shown on separate rendering layers. The complete substrate remains proposed.

**The rule:** every mark in the tutorial and the spec stands for exactly one object on this page, and each new component requires an explicit visual mapping before adoption. Existing marks do not yet cover the complete target architecture. A mark with no object here is an invention to remove or justify; an object with no mark is a gap to fill.

*(Diagram in the live version: the ontology of a logic. Left column, the language: sorts, names, predicates and roles, logical operators, sentences. Right column, the worlds: worlds, facts, satisfaction, truth values. Below, defined from satisfaction: truth conditions, consequence, truth and its theories. The whole is framed as "a logic (in institution theory, an institution)".)*

The left column is the **language**: what can be said. The right column is the **worlds**: what is the case. **Satisfaction** connects them: given a sentence and a world, it says whether the sentence is true there. Everything defined from satisfaction sits below.

## 1. Sorts: the kinds of object

A **sort** is a kind of object that sentences can talk about. The implemented object language has two (these do not classify metadata such as worlds or proof records):

| Sort | Its objects | Example names |
| --- | --- | --- |
| **Thing** | Ordinary objects in a world | Snow, Wind, Socrates |
| **Sentence** | The sentences themselves | S, S1, A, B, Q |

Sentences being objects is what makes self-reference possible: a sentence can talk about another sentence, or about itself, only because sentences are among the things a sentence can be about.

**Source:** many-sorted first-order logic (Enderton, *A Mathematical Introduction to Logic*).

**Our mark (decided):** a small grey **sort tag** under each role's label ("thing", "sentence"). Every role accepts only one sort: IsTrue's bearer takes a sentence; Falling's role takes a thing.

**Not to be confused with** the small grey labels in older drawings ("predicate", "operator", "thing"). Those say what kind of *symbol* a mark is, its **syntactic category**. Sorts say what kind of *object* a role accepts.

## 2. Names, predicates and roles: the non-logical vocabulary

These are the words whose meaning **changes from world to world**. Together they are called the **signature**.

| Object | What it is | Example | Our mark |
| --- | --- | --- | --- |
| **Name** (constant) | Picks out one object of one sort | Snow (a thing); S (a sentence) | Thing box; sentence box |
| **Predicate** (relation symbol) | A kind of claim, with a fixed number of slots | Falling (one slot); Loves (two); IsTrue (one) | Blue capsule |
| **Role** | A named slot of a predicate, accepting one sort | Falling's "thing that falls"; IsTrue's "bearer" | Labelled arrow from the capsule to what fills the slot |

**How a world gives them meaning:** each name stands for an object, and each predicate gets an **extension**, the set of ways of filling its slots that are true in that world.

**Sources:** standard first-order model theory. Naming the slots follows Sowa's conceptual graphs (labelled arcs), Codd's relational model (named attributes) and Fillmore's thematic roles.

## 3. Logical operators and truth values: the logical vocabulary

The **logical operators** are the words whose meaning **never changes** between worlds. Their meaning is a rule on **truth values**, usually written as a truth table. This is where semantics lives: everything else in a sentence is looked up in the world, but the operators decide how those values combine.

| A | B | not A | A and B | A or B |
| --- | --- | --- | --- | --- |
| T | T | F | T | T |
| T | F | F | F | T |
| F | T | T | F | T |
| F | F | T | F | F |

**Quantifiers** work over the objects of a sort: "something is P" is true when at least one object makes P true; "every thing is P" when all of them do.

**Three-valued logic (Kleene's strong tables):** a third value, N (neither). "Not N" is N; "F and N" is F; "T and N" is N. A truth theory also specifies fixed-point selection or revision rules; switching tables alone does not define the theory.

| Operator | Our mark | Status |
| --- | --- | --- |
| not | Dashed enclosure tagged "not" (neutral colour) | Shown |
| and | A dashed divider between the parts, labelled "and" (Peirce's convention, made visible) | Decided |
| or, if | Defined from not and and (nested enclosures) | Rule only; no example yet |
| something | Heavy line of identity (Peirce) | Shown |
| every | Line of identity between two "not"s (Peirce) | Shown in the Socrates lessons |
| truth values | Green T, orange F (grey for neither) | Shown |

**Sources:** truth tables (Wittgenstein, Post); Tarski; Kleene, *Introduction to Metamathematics* (1952).

## 4. Sentences

A **sentence** is built from the vocabulary above: predicates with their roles filled by names (or by the variable of a "something"), combined with operators. Only **closed** sentences are true or false in a world.

| Picture | Shows structure by | Good for | Source |
| --- | --- | --- | --- |
| **Peirce drawing** (our sentence box) | Containment | Reading what is said | Peirce's existential graphs; Sowa |
| **Graph form** (syntax graph) | Edges: one node per part | Seeing loops; following how a value is worked out | Parse trees, expression graphs |

Both are layouts of the same abstract diagram and read back to the same formula.

## 5. Worlds and facts

A **world** (a **model** or **structure**) fixes which objects exist for each sort, what each name stands for, and each predicate's extension. Each member of an extension is a **fact**. An ordinary classical world settles ordinary predicates. Sentence truth candidates are separate until consistency constraints are checked. Partial interpretations may leave claims unsettled.

| Object | Our mark |
| --- | --- |
| A world | One cell of the grid of possible worlds |
| A fact that holds | The claim drawn plainly inside the cell |
| A claim that does not hold | The same claim inside a "not" (the world's *diagram*, in Robinson's sense) |
| An unsettled claim (three-valued only) | "says nothing about …" in the cell |
| All worlds in a declared scope | The existing grid; future objects may specify the family symbolically |

**Sources:** Tarski; Robinson; Kleene; Barwise and Perry (partial worlds).

## 6. Satisfaction: true in a world

**Satisfaction**, W ⊨ S, is defined part by part, **one rule per kind of part** (Tarski 1933):

| Part of the sentence | Its value in world W |
| --- | --- |
| A claim about things | Look it up: is it one of W's facts? |
| not φ | The opposite of φ's value |
| φ and ψ | True only if both are true |
| something is φ | True if at least one object of W makes φ true |
| IsTrue(S′) | S′'s own value: see section 8 |

The value of a whole sentence is worked out from the inside out, passing through each operator, which applies its truth table.

## 7. Truth conditions and consequence

| Idea | Definition | Our mark |
| --- | --- | --- |
| **Truth conditions** | The set of worlds in which the sentence is true | Shaded region of the grid |
| **Equivalence** | Same truth conditions | ≡ link |
| **Consequence** (validity) | The conclusion is true in every world where all the premises are | Premise worlds bordered |
| **Counter-model** | Premises true, conclusion false | A cell bordered red |

"And" is the overlap of truth conditions; "or" is what they cover together. When there are too many possible worlds to draw (2⁶ = 64 for two people with Loves and Happy), the region is described by its condition and a few representative worlds are shown.

**Sources:** Carnap (1947); Tarski (1936).

## 8. The truth predicate, theories of truth, and logics

Self-reference requires distinguishing ordinary worlds and sentence assignments. Queries must distinguish some, all, and no consistent assignments; see [the proposed kernel](reasoning-objects.md#3-proposed-finite-classical-kernel).

**The truth predicate.** IsTrue's role ("bearer") accepts a **sentence**. It must agree with satisfaction itself: IsTrue(S′) holds in a world exactly when S′ is true there. That makes the definition circular whenever sentences refer to themselves or form loops.

| Theory | How it resolves the circle | Liar's verdict | Source |
| --- | --- | --- | --- |
| Classical fixed points | Accept only assignments that agree with themselves | No consistent value: paradox | Tarski; Kripke |
| Kripke | Build values up in stages from the facts | Neither | Kripke 1975 |
| Gaifman | Closed loops get a gap; jump rule outside them | Gap | Gaifman 1992 |
| Revision | Revise round after round | Flips forever | Gupta and Belnap 1993 |

**What a paradox is, in these terms.** For the liar, no classical world can make IsTrue agree with satisfaction: there is no **fixed point**. A three-valued world can leave IsTrue(S) unsettled, and then S comes out neither, which agrees: Kripke's answer. At each fixed ordinary world the truth-teller has two consistent sentence assignments. T and F circles are candidate sentence values, not ordinary worlds. “Either” summarizes assignments, not a third Boolean value.

**Logics.** Institution theory (Goguen and Burstall 1992) supplies a framework relating signatures, sentences, models, and satisfaction. A UI setting does not establish its compatibility laws. The existing Logic switch illustrates alternatives; each theory needs its own specification and validation.

## 9. Audit (as of 27 October 2026)

| Item | Status |
| --- | --- |
| Sort tags on roles | Decided; drawn by the engine |
| A visible "and" | Decided (divider); drawn by the engine |
| "or", "if" | No worked example yet |
| T and F circles | Candidate sentence values, distinct from ordinary worlds |
| Dot animations in the tutorial | A replay of revision; to be replaced in the rebuild |
| "Inherits a paradox" | Our own term; find the standard one or say it is ours |
| Red used for both "not" and paradox | Resolved in the engine (neutral "not"); still present in tutorial.html |

## 10. The visual grammar: the closed list of marks

Every picture is built only from these marks, and each mark means the same object everywhere. A new mark needs a recorded decision here first. Framework: Moody, *The Physics of Notations* (2009), principle of **semiotic clarity**.

**Language:** sentence box; thing box; claim (blue capsule); role arrow (grey, role name and sort tag); reference arrow (blue, onto a sentence box, sort "sentence"); "not" (dashed enclosure); "and" (dashed divider); "something" (heavy line); − sign (reference inside an odd number of "not"s).

**Values and reasoning:** value colours (green true, orange false, grey neither, used for nothing else); T and F circles (candidate values); implication arrow (magenta, "if this, then that"); loop styling (thick).

**Worlds:** world cell; grid; shading (truth conditions); set outline (dashed magenta); ≡ link.

**Graph form and value layers (amendment, after tests passed):** sentence node; "says" edge; "not" node; "inside" edge; "something" node with "home" edge; role edge (blue when filled by a sentence); true layer and false layer; crossing (passing a "not"); closed curve (for pure signed cycles only: one component through both value copies means no consistent assignment; two components mean two assignments. A figure-eight crossing is a layout choice).

**Rules:** existing processes use these marks with explicit step meanings; colour carries value only; captions name the marks used. Connected schematics and history views are design goals, but no new gate/pathway marks are approved or introduced by this revision. Propose their meanings here before implementation.

### Proposed schematic for the snow-object review (not adopted)

The next mock uses labelled variable terminals for world facts and sentence values, and labelled relation boxes for AND, NOT, and agreement. Undirected connections indicate participation in a constraint, not time or permanent input/output direction. A highlighted relation identifies the current inference step. Terminal labels distinguish “supposed”, “derived”, and “open”; conflict is textual, not a third truth value. A reference connection identifies the same named sentence. A world view hides expression terminals but retains full constraints and supporting assignments.

These are provisional mappings for visual review, motivated by constraint incidence/factor graphs (source in reasoning-objects.md). They do not replace the existing sentence grammar, establish graphical read-back, or authorize a tutorial redesign. The executable kernel can be reviewed independently of these proposed marks.

## Sources

Enderton; Tarski (1933, 1936); Robinson; Carnap (1947); Kleene (1952); Barwise and Perry (1983); Peirce; Sowa (1984); Codd (1970); Fillmore (1968); Kripke (1975); Gaifman (1992); Gupta and Belnap (1993); Goguen and Burstall (1992); Aspvall, Plass and Tarjan (1979); Moody (2009); Zaslavsky (signed graphs). Cited from memory; check against the originals before treating as final.
