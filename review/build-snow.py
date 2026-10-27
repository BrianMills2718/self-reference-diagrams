"""Build a self-contained review fragment; this does not rebuild the live tutorial."""
from pathlib import Path
import sys
root = Path(__file__).resolve().parents[1]
template = (root / 'review/snow-schematic.fragment.html').read_text()
kernel = (root / 'src/reasoning-object.js').read_text()
assert template.count('/* REASONING_KERNEL */') == 1
destination = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'review/snow-schematic.html'
destination.write_text(template.replace('/* REASONING_KERNEL */', kernel))
print(destination)
