#!/usr/bin/env python3
"""Add the Student Compass item to the existing Evolve Foundation main nav.
Only the main nav links are replaced; page content is untouched.
"""
from pathlib import Path
import re

FILES = [
    'index.html',
    'launchpad.html',
    'ignite.html',
    'insights.html',
    'your-strengths-dont-need-to-sound-impressive.html',
    'self-awareness-becomes-useful-when-it-changes-what-you-do.html',
    'about-rams.html',
]

NAV = '''<div class="nav-links" id="navLinks">
<a href="index.html#foundation">About</a>
<a class="nav-student-compass" href="student-compass.html">Student Compass</a>
<div class="nav-dropdown">
<button aria-expanded="false" class="nav-dropdown-trigger">Programmes <span aria-hidden="true">⌄</span></button>
<div class="nav-dropdown-menu">
<a href="launchpad.html"><strong>Launchpad</strong><small>8-week live, online programme for college students</small></a>
<a href="ignite.html"><strong>Ignite</strong><small>In-person, in college programme for college students</small></a>
</div>
</div>
<a href="insights.html">Insights</a>
<a class="nav-cta" href="index.html#contact">Contact</a>
</div>'''

for name in FILES:
    path = Path(name)
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')
    pattern = re.compile(r'<div class="nav-links"(?: id="navLinks")?>.*?</div></div></nav>', re.DOTALL)
    match = pattern.search(text)
    if not match:
        print(f'SKIPPED (nav not found): {name}')
        continue
    replacement = NAV + '</div></nav>'
    updated = text[:match.start()] + replacement + text[match.end():]
    if updated != text:
        path.write_text(updated, encoding='utf-8')
        print(f'UPDATED: {name}')
    else:
        print(f'UNCHANGED: {name}')
