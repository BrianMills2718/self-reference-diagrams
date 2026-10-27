# Review checkpoint: three lessons

Open `tutorial-review.html` directly in a browser. It is self-contained and does not need a server or dependencies. This is a focused preview, not a replacement for the thirteen-lesson tutorial.

Review in order:

1. **The liar:** read the enclosure and reference arrow, then follow the two candidate values. Does the connection between opposite candidates explain why neither survives?
2. **The truth-teller:** compare its separate cycles. Is it clear that either value works separately, rather than both holding at once?
3. **When the world decides:** choose the world without falling snow. Does the false snow claim explain why the whole conjunction is false? Reverse the parts and check that the verdict remains the same. Turn falling snow back on and compare with the liar.

The main review question: **Do the drawings explain the difference, or is the table and prose doing all the work?** This is the checkpoint before rebuilding the full tutorial.

## Verified behavior and limits

- Verdicts come from `solveClassical`, not the unfolding animation. Completed checks enumerate all assignments for the given finite system.
- Tests cover the examples, both orders of conjunction, existential and derived universal quantification, malformed inputs, computation limits, and 1,272 comparisons with the existing formula and diagram interpretations. Generated conjunction order is also reversed and compared in 100 texts.
- The standalone page's scripts and lesson, answer, snow, and order controls pass a lightweight DOM smoke test. This is not a browser layout or accessibility audit. A local browser check could not run because Chromium was unavailable and its download failed.
- The existing full tutorial still has older notation and evaluation conventions. Kripke and Gaifman semantics are not added by this preview. The legacy `evaluate` function remains an unfolding demonstration and is explicitly documented as incomplete.

Rebuild with `python3 review-src/build.py`; verify with `tests/run-all.sh`.
