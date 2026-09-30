
/* The Evolve Library — searchable capsules + Compass recommendations. */
(function () {
  const CAPSULES = [{"id": "01", "slug": "driving-through-fog", "title": "Driving Through Fog", "moment": "I don’t know where this will lead.", "shift": "Uncertainty does not necessarily mean you are lost. Sometimes clarity appears because you move.", "question": "What are my next thirty metres?", "tags": ["uncertainty", "direction", "next-step", "exploration"], "format": "Visual metaphor + voiceover", "length": "60–70 seconds", "closing": "What are my next 30 metres?"}, {"id": "02", "slug": "confidence-is-a-receipt", "title": "Confidence Is a Receipt", "moment": "I don’t feel confident enough to begin.", "shift": "Confidence may be something we build from evidence after acting, rather than something we need to possess before acting.", "question": "What’s one small thing I can do that will give me some evidence?", "tags": ["confidence", "action", "evidence", "starting"], "format": "Rams to camera + minimal graphic inserts", "length": "60–80 seconds", "closing": "Confidence can be the receipt, not the entry ticket."}, {"id": "03", "slug": "nobody-else-asked", "title": "Nobody Else Asked", "moment": "Everyone else seems to understand except me.", "shift": "Silence is not proof that everybody else understands.", "question": "Do I know — or am I assuming?", "tags": ["comparison", "assumptions", "belonging", "questions"], "format": "Micro-story + narration", "length": "65–80 seconds", "closing": "Silence doesn’t always mean understanding. Sometimes nobody wants to go first."}, {"id": "04", "slug": "one-data-point-is-not-the-graph", "title": "One Data Point Is Not the Graph", "moment": "I failed. Maybe I’m just not good at this.", "shift": "A single result can contain useful information without being enough evidence for a conclusion about your identity or ability.", "question": "Is this a pattern — or is it one data point?", "tags": ["failure", "self-belief", "perspective", "evidence"], "format": "Visual analogy + voiceover", "length": "60–75 seconds", "closing": "An outcome can tell you something without telling you everything about yourself."}, {"id": "05", "slug": "the-dressing-room", "title": "The Dressing Room", "moment": "What if I try something and discover it isn’t right for me?", "shift": "Exploring a possibility is not the same as committing to it. Testing can create information.", "question": "Does this fit me?", "tags": ["exploration", "experimentation", "choice", "curiosity"], "format": "Visual metaphor + voiceover", "length": "65–80 seconds", "closing": "Trying a possibility is not the same as committing to it."}, {"id": "06", "slug": "recalculating", "title": "Recalculating", "moment": "I changed my mind. Did I waste my time?", "shift": "Changing direction after learning something can be evidence of attention and adaptation, not evidence that the earlier choice was a failure.", "question": "Given what I know now, where do I go from here?", "tags": ["change", "direction", "learning", "flexibility"], "format": "GPS-inspired animation + voiceover", "length": "60–75 seconds", "closing": "New information can justify a new route."}, {"id": "07", "slug": "the-other-lane", "title": "The Other Lane", "moment": "Everyone seems to be doing better than me.", "shift": "Comparison can provide information, but becomes damaging when another person’s journey becomes the scoreboard for your own.", "question": "Am I moving in a direction that matters to me?", "tags": ["comparison", "self-worth", "pace", "direction"], "format": "Running-track visual metaphor + voiceover", "length": "65–80 seconds", "closing": "Look sideways for information. Not for your score."}, {"id": "08", "slug": "the-first-domino", "title": "The First Domino", "moment": "I know what I should do. I just can’t get started.", "shift": "Large goals often become actionable only when translated into the smallest move that creates momentum.", "question": "What is the first domino?", "tags": ["action", "overwhelm", "starting", "momentum"], "format": "Domino visual + voiceover", "length": "55–70 seconds", "closing": "One email. One page. One conversation. Twenty minutes."}, {"id": "09", "slug": "a-clue-not-a-contract", "title": "A Clue, Not a Contract", "moment": "I’m interested in something, but does that mean it should become my career?", "shift": "Interest is useful as a signal for exploration without needing to make a promise about the future.", "question": "What is this curiosity inviting me to explore?", "tags": ["curiosity", "interests", "exploration", "career"], "format": "Rams to camera + observational inserts", "length": "60–75 seconds", "closing": "Interest ≠ career commitment."}, {"id": "10", "slug": "whos-holding-the-wheel", "title": "Who’s Holding the Wheel?", "moment": "I’m scared, so maybe I shouldn’t do it.", "shift": "Fear and doubt can be noticed and listened to without automatically becoming the decision-maker.", "question": "What is fear telling me — and does it get to decide what I do next?", "tags": ["fear", "decision-making", "courage", "uncertainty"], "format": "Original car/driver metaphor + voiceover", "length": "65–80 seconds", "closing": "Fear can have a voice without having the steering wheel."}];
  const CATEGORY_TO_IDS = {
    understand: ['04','03','07'],
    explore: ['01','05','09'],
    decide: ['02','08','06','10']
  };

  function getAnswers() {
    try { return JSON.parse(localStorage.getItem('studentCompassAnswers') || '{}'); }
    catch (e) { return {}; }
  }

  function getCategoryScores() {
    const questions = [
      'understand','understand','understand','understand',
      'explore','explore','explore','explore',
      'decide','decide','decide','decide'
    ];
    const answers = getAnswers();
    const totals = {understand:0, explore:0, decide:0};
    const counts = {understand:0, explore:0, decide:0};
    questions.forEach((category, i) => {
      const value = Number(answers[i] || 0);
      if (value) { totals[category] += value; counts[category] += 1; }
    });
    return Object.keys(totals).map(key => ({key, value: counts[key] ? totals[key] / counts[key] : 0}))
      .sort((a,b) => b.value - a.value);
  }

  function card(c, dark=false) {
    const tags = c.tags.map(t => `<a class="library-tag" href="compass-capsules.html?tag=${t}">#${t}</a>`).join('');
    return `<article class="library-recommended-card">
      <span class="library-number">${c.id}</span>
      <h3>${c.title}</h3>
      <p>“${c.moment}”</p>
      <div class="library-tags">${tags}</div>
      <a class="text-link" href="library-${c.slug}.html">Explore the idea →</a>
    </article>`;
  }

  function initRecommendations() {
    const root = document.querySelector('[data-library-recommended]');
    const grid = document.querySelector('[data-recommended-grid]');
    if (!root || !grid) return;
    const scores = getCategoryScores();
    if (!scores.some(x => x.value > 0)) return;

    const primary = scores[0].key;
    const secondary = scores[1].key;
    const ids = [...(CATEGORY_TO_IDS[primary] || []), ...(CATEGORY_TO_IDS[secondary] || [])];
    const unique = [...new Set(ids)].slice(0,3);
    const chosen = unique.map(id => CAPSULES.find(c => c.id === id)).filter(Boolean);
    if (!chosen.length) return;
    grid.innerHTML = chosen.map(c => card(c, true)).join('');
    root.hidden = false;
  }

  function initFilters() {
    const grid = document.querySelector('[data-library-grid]');
    const buttons = [...document.querySelectorAll('[data-filter]')];
    const status = document.querySelector('[data-filter-status]');
    const empty = document.querySelector('[data-library-empty]');
    if (!grid || !buttons.length) return;

    function apply(filter) {
      let visible = 0;
      grid.querySelectorAll('.library-card').forEach(card => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        const show = filter === 'all' || tags.includes(filter);
        card.hidden = !show;
        if (show) visible++;
      });
      buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
      if (status) status.textContent = filter === 'all' ? 'Showing all 10 ideas' : `Showing ${visible} ${visible === 1 ? 'idea' : 'ideas'} tagged #${filter}`;
      if (empty) empty.hidden = visible !== 0;
    }

    buttons.forEach(btn => btn.addEventListener('click', () => apply(btn.dataset.filter)));
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('tag');
    if (initial && buttons.some(b => b.dataset.filter === initial)) apply(initial); else apply('all');
  }

  function init() {
    const path = window.location.pathname.split('/').pop();
    if (path.startsWith('library-')) {
      document.querySelectorAll('.nav-student-compass').forEach(link => { link.classList.add('active'); link.setAttribute('aria-current','page'); });
    }
    initRecommendations();
    initFilters();
  }

  init();
})();
