# A visual language for self-reference

Diagrams for reading self-referential sentences such as the liar ("This statement is false") so that:

1. any diagram reads back into exactly one formula, and
2. loops, contradictions and recursion are visible as shapes.

Live site: https://selfref.brianmills.dev

## Pages

- `index.html`: **How to read the diagrams**, the reader's guide, with a legend and a worked example.
- `spec.html`: **Spec v0.1**, the full rules: vocabulary, reading rules, value ports and implication arrows, worked examples, known limits.
- `stepper.html`: **Self-reference stepper**, an interactive page where you pick a T or F port and follow the implication arrows step by step.

Hover any part of a diagram for a tooltip explaining it.

## How it works, in one paragraph

Each sentence is a box; what it says is drawn inside (claims, roles, red dashed "not" enclosures). A reference to a whole sentence is an arrow landing on its outline, thick blue when it points at a box that contains it. Each box also has a T port and an F port; magenta arrows derived from the content say "if this, then that". A sentence whose T port leads to its F port and back is a contradiction loop: a paradox.

## Deploying

Static files only, no build step. Deployed to Cloudflare Pages:

```
wrangler pages deploy . --project-name self-reference-diagrams
```
