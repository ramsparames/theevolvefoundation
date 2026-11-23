from pathlib import Path
import zipfile, hashlib, re

root=Path('/mnt/data/round9')

# 1) Create standalone Who We Work With page using the same audience architecture/design.
audiences = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Who We Work With | The Evolve Foundation</title><meta name="description" content="The Evolve Foundation works with students, parents, colleges and organisations at different moments in the journey from school to college to work.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="v2.css"><link rel="stylesheet" href="v2-pages.css"></head><body>
<header class="site-header"><div class="container nav"><a class="brand" href="index.html" aria-label="The Evolve Foundation home"><img class="brand-logo" src="evolve-circular-logo-exact.png" alt="The Evolve Foundation"><span class="brand-name">The Evolve Foundation</span></a>
<nav class="desktop-nav" aria-label="Main navigation"><a href="index.html#about">About</a><a href="experiences.html">Experiences</a><a href="audiences.html" aria-current="page">Who We Work With</a><a href="library.html">Library</a><a href="insights.html">Insights</a><a class="nav-cta" href="index.html#contact">Contact</a></nav>
<button class="menu-toggle" aria-expanded="false" aria-controls="mobile-nav">MENU</button></div>
<nav id="mobile-nav" class="mobile-nav"><a href="index.html#about">About</a><a href="experiences.html">Experiences</a><a href="audiences.html">Who We Work With</a><a href="library.html">Library</a><a href="insights.html">Insights</a><a href="index.html#contact">Contact</a></nav></header>
<main>
<section class="editorial-hero audience-page-hero section"><div class="container editorial-hero-grid"><div><p class="eyebrow">WHO WE WORK WITH</p><h1>Different people choose The Evolve Foundation for different reasons.</h1></div><p class="hero-deck">The right support depends on the decision a young person — or the people supporting them — are facing now.</p></div></section>
<section class="section"><div class="container"><div class="audience-grid audience-grid-page">
<article><p class="eyebrow">STUDENTS</p><h3>You don't need to have everything figured out.</h3><p>Find the experience or resource that fits where you are now.</p><a class="text-link" href="for-students.html">For Students <span>→</span></a></article>
<article><p class="eyebrow">PARENTS</p><h3>You can support without choosing their path.</h3><p>Help young people learn how to think through important choices.</p><a class="text-link" href="for-parents.html">For Parents <span>→</span></a></article>
<article><p class="eyebrow">COLLEGES</p><h3>Give students meaningful experiences beyond the syllabus.</h3><p>Bring practical, interactive development experiences to your students.</p><a class="text-link" href="for-colleges.html">For Colleges <span>→</span></a></article>
<article><p class="eyebrow">ORGANISATIONS</p><h3>Help early-career professionals learn to navigate work.</h3><p>Explore Momentum for people in the first few years of their careers.</p><a class="text-link" href="for-organisations.html">For Organisations <span>→</span></a></article>
</div></div></section>
<section class="section section-soft"><div class="container editorial-grid"><div><p class="eyebrow">THE JOURNEY</p><h2>Support should change as the decision changes.</h2></div><div class="story-copy"><p><strong>Approaching college</strong> calls for a different kind of support from <strong>early college</strong>. And the questions students face when they are <strong>approaching work</strong> are different again from those they encounter in an <strong>early career</strong>.</p><p>That is why The Evolve Foundation has built experiences around distinct moments rather than one generic programme for everyone.</p></div></div></section>
<section class="cta section" id="page-cta"><div class="container cta-inner"><p class="eyebrow">START WHERE YOU ARE</p><h2>Find the experience that fits the moment.</h2><p>Explore the audience pages to see what The Evolve Foundation can offer students, parents, colleges and organisations.</p><a class="button" href="index.html#contact">Start a conversation <span>→</span></a></div></section>
</main>
<footer class="footer" id="contact"><div class="container"><div class="footer-grid"><div><a class="footer-brand" href="index.html"><img class="footer-brand-logo" src="evolve-circular-logo-exact.png" alt="The Evolve Foundation"><span class="footer-brand-name">The Evolve Foundation</span></a><p>Helping young people understand themselves and navigate life well.</p><a href="mailto:enquire@theevolvefoundation.com?subject=The%20Evolve%20Foundation%20Enquiry">enquire@theevolvefoundation.com</a></div><div><p class="footer-label">EXPERIENCES</p><a href="compass.html">Compass</a><a href="launchpad.html">Launchpad</a><a href="ignite.html">Ignite</a><a href="momentum.html">Momentum</a></div><div><p class="footer-label">WHO WE WORK WITH</p><a href="for-students.html">Students</a><a href="for-parents.html">Parents</a><a href="for-colleges.html">Colleges</a><a href="for-organisations.html">Organisations</a></div><div><p class="footer-label">ABOUT</p><a href="about-rams.html">Founder</a><a href="library.html">Library</a><a href="insights.html">Insights</a><a href="terms-and-conditions.html">Terms</a><a href="privacy-policy.html">Privacy</a><a href="https://www.linkedin.com/company/the-evolve-foundation/" target="_blank" rel="noopener">LinkedIn</a></div></div><div class="footer-bottom"><span>© 2026 The Evolve Foundation</span></div></div></footer>
<script src="script.js"></script></body></html>'''
(root/'audiences.html').write_text(audiences, encoding='utf-8')

# 2) Top nav: Who We Work With should point to standalone page everywhere.
for p in root.glob('*.html'):
    txt=p.read_text(encoding='utf-8',errors='replace')
    txt=txt.replace('href="index.html#audiences">Who We Work With', 'href="audiences.html">Who We Work With')
    p.write_text(txt,encoding='utf-8')

# 3) Launchpad: retain the format/time/cohort strip beneath the heading, and keep the register CTA after it.
# The round-8 page already contains the strip in the hero. Add an explicit class so its placement remains visually below the heading.
lp=root/'launchpad.html'
l=lp.read_text(encoding='utf-8',errors='replace')
l=l.replace('<div class="launchpad-identity-strip">', '<div class="launchpad-identity-strip launchpad-identity-strip-under-heading">', 1)
lp.write_text(l,encoding='utf-8')

# 4) Momentum: change the right-hand "WHAT STAYS" language to ownership, accountability, communication.
mp=root/'momentum.html'
m=mp.read_text(encoding='utf-8',errors='replace')
m=m.replace('Participants should leave better able to ask better questions, make thoughtful choices, handle disagreement and build a working life that works.', 'Participants should leave better able to take ownership, build accountability for their work and communicate clearly — especially when the situation is ambiguous or difficult.')
mp.write_text(m,encoding='utf-8')

# 5) Library: replace the visible shorthand "Evolve" in the CTA with the full name.
lb=root/'library.html'
t=lb.read_text(encoding='utf-8',errors='replace')
t=t.replace('Explore the Evolve experiences', 'Explore The Evolve Foundation experiences')
lb.write_text(t,encoding='utf-8')

# 6) Insights: stack one insight below another rather than a multi-column table/grid.
insp=root/'insights.html'
it=insp.read_text(encoding='utf-8',errors='replace')
it=it.replace('class="library-grid"', 'class="library-grid insights-list"', 1)
insp.write_text(it,encoding='utf-8')

css=root/'v2-pages.css'
c=css.read_text(encoding='utf-8',errors='replace')
c += r'''

/* ROUND 9 */
.audience-grid-page article:nth-child(1){background:#f4f7f2}
.audience-grid-page article:nth-child(2){background:#f8f5ef}
.audience-grid-page article:nth-child(3){background:#f4f4f8}
.audience-grid-page article:nth-child(4){background:#f8f3f4}
.audience-grid-page article{border:1px solid rgba(28,42,37,.08);min-height:420px}
.launchpad-identity-strip-under-heading{grid-column:1 / -1;margin-top:34px}
.insights-list{display:flex;flex-direction:column;gap:0}
.insights-list .library-item{width:100%;border-left:0;border-right:0;border-bottom:1px solid var(--line);padding:42px 0;display:grid;grid-template-columns:minmax(280px,1fr) minmax(280px,1.5fr) auto;column-gap:48px;align-items:start}
.insights-list .library-item:first-child{border-top:1px solid var(--line)}
.insights-list .library-item .eyebrow{grid-column:1/-1;margin-bottom:10px}
.insights-list .library-item h3{margin:0;font-family:var(--serif);font-size:34px;line-height:1.12;font-weight:500}
.insights-list .library-item p:not(.eyebrow){margin:0;line-height:1.6}
.insights-list .library-item .text-link{white-space:nowrap;align-self:center}
@media(max-width:800px){.insights-list .library-item{grid-template-columns:1fr;row-gap:18px}.insights-list .library-item .text-link{align-self:start}.audience-grid-page article{min-height:0}.launchpad-identity-strip-under-heading{grid-column:auto}}
'''
css.write_text(c,encoding='utf-8')

# Package
out=Path('/mnt/data/theevolvefoundation-v2-full-experience-redesign-round9.zip')
if out.exists(): out.unlink()
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in root.rglob('*'):
        if p.is_file() and '__MACOSX' not in p.parts:
            z.write(p,p.relative_to(root))

# Verification
checks={
    'standalone audiences page': (root/'audiences.html').exists(),
    'nav points to audiences': all('href="audiences.html">Who We Work With' in p.read_text(encoding='utf-8',errors='replace') for p in root.glob('*.html')),
    'launchpad format strip': 'launchpad-identity-strip-under-heading' in (root/'launchpad.html').read_text(),
    'momentum ownership accountability communication': all(x in (root/'momentum.html').read_text() for x in ['take ownership','accountability','communicate clearly']),
    'library full foundation name': 'Explore The Evolve Foundation experiences' in (root/'library.html').read_text(),
    'insights stacked class': 'insights-list' in (root/'insights.html').read_text(),
}
print(out)
print('Size MB:', round(out.stat().st_size/1024/1024,2))
for k,v in checks.items(): print(k, 'PASS' if v else 'FAIL')
print('SHA256:', hashlib.sha256(out.read_bytes()).hexdigest())
