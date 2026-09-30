#!/usr/bin/env python3
from pathlib import Path

FILES = [
    Path("insights.html"),
    Path("self-awareness-becomes-useful-when-it-changes-what-you-do.html"),
    Path("your-strengths-dont-need-to-sound-impressive.html"),
]

needle = '<a href="index.html#foundation">About</a>'
compass = '<a class="nav-student-compass" href="student-compass.html">Student Compass</a>'

for path in FILES:
    if not path.exists():
        print(f"SKIP (not found): {path}")
        continue
    text = path.read_text()
    if 'href="student-compass.html"' in text:
        print(f"OK (already present): {path}")
        continue
    if needle not in text:
        print(f"SKIP (navigation pattern not found): {path}")
        continue
    path.write_text(text.replace(needle, needle + "\n      " + compass, 1))
    print(f"UPDATED: {path}")
