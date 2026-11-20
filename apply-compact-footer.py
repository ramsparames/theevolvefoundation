#!/usr/bin/env python3
"""Apply the compact Evolve Foundation footer to every HTML page in a site folder.

Run from the website root:
    python3 apply-compact-footer.py

The script:
- replaces any existing <footer>...</footer> block with one canonical footer
- preserves id="contact" so existing home-page contact anchors continue to work
- adds footer-compact.css after the main stylesheet if it is not already linked
- does not modify styles.css or any page content outside the footer/head link
"""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
CSS_LINK = '<link rel="stylesheet" href="footer-compact.css">'

FOOTER = '''<footer id="contact">
  <div class="wrap">
    <div class="footer-compact">
      <div class="footer-compact-brand">
        <h2>The Evolve Foundation</h2>
        <p>Helping young people understand themselves and navigate life well</p>
      </div>
      <div class="footer-compact-meta">
        <a href="mailto:enquire@theevolvefoundation.com?subject=The%20Evolve%20Foundation%20Enquiry">enquire@theevolvefoundation.com</a>
        <span>© 2026 The Evolve Foundation</span>
        <a href="https://www.linkedin.com/company/the-evolve-foundation/" target="_blank" rel="noopener noreferrer" aria-label="The Evolve Foundation on LinkedIn">LinkedIn</a>
        <span class="footer-compact-legal"><a href="terms-and-conditions.html">Terms &amp; Conditions</a><span class="footer-dot">·</span><a href="privacy-policy.html">Privacy Policy</a></span>
      </div>
    </div>
  </div>
</footer>'''


def add_css_link(text: str) -> str:
    if 'href="footer-compact.css"' in text or "href='footer-compact.css'" in text:
        return text
    # Put the compact footer layer after the existing stylesheets.
    m = list(re.finditer(r'<link\b[^>]*rel=["\']stylesheet["\'][^>]*>', text, re.I))
    if m:
        pos = m[-1].end()
        return text[:pos] + '\n' + CSS_LINK + text[pos:]
    return text.replace('</head>', CSS_LINK + '\n</head>', 1)


def replace_footer(text: str) -> str:
    pattern = re.compile(r'<footer\b[^>]*>.*?</footer>', re.I | re.S)
    if pattern.search(text):
        return pattern.sub(FOOTER, text, count=1)
    if '</body>' in text.lower():
        return re.sub(r'</body>', FOOTER + '\n</body>', text, count=1, flags=re.I)
    return text + '\n' + FOOTER + '\n'


changed = []
for path in sorted(ROOT.glob('*.html')):
    # Skip generated/backup files if a user has copied them into the root.
    if path.name.startswith('.'):
        continue
    original = path.read_text(encoding='utf-8')
    updated = replace_footer(original)
    updated = add_css_link(updated)
    if updated != original:
        path.write_text(updated, encoding='utf-8')
        changed.append(path.name)

print(f"Updated {len(changed)} HTML page(s).")
for name in changed:
    print(f"  {name}")
