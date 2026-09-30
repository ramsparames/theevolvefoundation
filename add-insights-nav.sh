#!/bin/bash
set -e

# Add Insights as a top-level navigation item between Programmes and Contact.
# Safe to run repeatedly: it skips files that already contain the Insights nav item.

for file in *.html; do
  [ -f "$file" ] || continue

  if grep -q 'href="insights.html">Insights</a>' "$file"; then
    continue
  fi

  python3 - "$file" <<'PY'
import sys
from pathlib import Path

path = Path(sys.argv[1])
s = path.read_text()
needle = '      <a class="nav-cta" href="index.html#contact">Contact</a>'
replacement = '      <a href="insights.html">Insights</a>\n' + needle

if needle in s:
    s = s.replace(needle, replacement, 1)
    path.write_text(s)
    print(f"updated {path}")
PY
done
