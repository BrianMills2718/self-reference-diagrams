"""Build the standalone tutorial review from the tested source modules."""
from pathlib import Path
import re
root = Path(__file__).resolve().parent.parent
modules = ['engine', 'graph', 'layers', 'render', 'layers_render', 'semantics']
code = '\n'.join(re.sub(r"^if\(typeof module!==.*$", '', (root / 'src' / (name + '.js')).read_text(), flags=re.M) for name in modules)
template = (root / 'review-src/page.html').read_text()
(root / 'tutorial-review.html').write_text(template.replace('/* MODULES */', code))
