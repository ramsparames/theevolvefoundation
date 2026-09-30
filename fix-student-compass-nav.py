from pathlib import Path

ROOT = Path('.')

# Remove the page-specific active class so Student Compass is visually identical
# to About, Programmes and Insights everywhere. Keep aria-current for accessibility.
for path in ROOT.glob('*.html'):
    text = path.read_text(encoding='utf-8')
    updated = text.replace(
        'class="nav-student-compass active"',
        'class="nav-student-compass"'
    )
    if updated != text:
        path.write_text(updated, encoding='utf-8')
        print(f'updated {path.name}')

# Append a tiny override to the existing stylesheet, without changing anything else.
css = ROOT / 'styles.css'
if css.exists():
    text = css.read_text(encoding='utf-8')
    marker = '/* ---------- Student Compass navigation consistency ---------- */'
    if marker not in text:
        css.write_text(text.rstrip() + '\n\n' + '''/* ---------- Student Compass navigation consistency ---------- */
.nav-links a.nav-student-compass,
.nav-links a.nav-student-compass.active,
.nav-links a.nav-student-compass[aria-current="page"] {
  color:#4D5962 !important;
  font-weight:400 !important;
}
.nav-links a.nav-student-compass:hover,
.nav-links a.nav-student-compass.active:hover,
.nav-links a.nav-student-compass[aria-current="page"]:hover {
  color:var(--ink) !important;
}
''', encoding='utf-8')
        print('updated styles.css')
    else:
        print('styles.css already contains the navigation fix')
else:
    print('styles.css not found; HTML active classes were still fixed')
