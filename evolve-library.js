/* Evolve Library discovery + reflection-based Compass recommendations. */
(function () {
  const CAPSULES = [
    {id:'01',slug:'driving-through-fog',title:'Driving Through Fog',moment:'I don’t know where this will lead.',shift:'Uncertainty does not necessarily mean you are lost. Sometimes clarity appears because you move.',question:'What are my next thirty metres?',tags:['uncertainty','direction','next-step','exploration']},
    {id:'02',slug:'confidence-is-a-receipt',title:'Confidence Is a Receipt',moment:'I don’t feel confident enough to begin.',shift:'Confidence may be something we build from evidence after acting, rather than something we need to possess before acting.',question:'What’s one small thing I can do that will give me some evidence?',tags:['confidence','action','evidence','starting']},
    {id:'03',slug:'nobody-else-asked',title:'Nobody Else Asked',moment:'Everyone else seems to understand except me.',shift:'Silence is not proof that everybody else understands.',question:'Do I know — or am I assuming?',tags:['comparison','assumptions','belonging','questions']},
    {id:'04',slug:'one-data-point-is-not-the-graph',title:'One Data Point Is Not the Graph',moment:'I failed. Maybe I’m just not good at this.',shift:'A single result can contain useful information without being enough evidence for a conclusion about your identity or ability.',question:'Is this a pattern — or is it one data point?',tags:['failure','self-belief','perspective','evidence']},
    {id:'05',slug:'the-dressing-room',title:'The Dressing Room',moment:'What if I try something and discover it isn’t right for me?',shift:'Exploring a possibility is not the same as committing to it. Testing can create information.',question:'Does this fit me?',tags:['exploration','experimentation','choice','curiosity']},
    {id:'06',slug:'recalculating',title:'Recalculating',moment:'I changed my mind. Did I waste my time?',shift:'Changing direction after learning something can be evidence of attention and adaptation, not evidence that the earlier choice was a failure.',question:'Given what I know now, where do I go from here?',tags:['change','direction','learning','flexibility']},
    {id:'07',slug:'the-other-lane',title:'The Other Lane',moment:'Everyone seems to be doing better than me.',shift:'Comparison can provide information, but becomes damaging when another person’s journey becomes the scoreboard for your own.',question:'Am I moving in a direction that matters to me?',tags:['comparison','self-worth','pace','direction']},
    {id:'08',slug:'the-first-domino',title:'The First Domino',moment:'I know what I should do. I just can’t get started.',shift:'Large goals often become actionable only when translated into the smallest move that creates momentum.',question:'What is the first domino?',tags:['action','overwhelm','starting','momentum']},
    {id:'09',slug:'a-clue-not-a-contract',title:'A Clue, Not a Contract',moment:'I’m interested in something, but does that mean it should become my career?',shift:'Interest is useful as a signal for exploration without needing to make a promise about the future.',question:'What is this curiosity inviting me to explore?',tags:['curiosity','interests','exploration','career']},
    {id:'10',slug:'whos-holding-the-wheel',title:'Who’s Holding the Wheel?',moment:'I’m scared, so maybe I shouldn’t do it.',shift:'Fear and doubt can be noticed and listened to without automatically becoming the decision-maker.',question:'What is fear telling me — and does it get to decide what I do next?',tags:['fear','decision-making','courage','uncertainty']}
  ];

  const CATEGORY_TO_IDS = {
    understand: ['04','03','07'],
    explore: ['01','05','09'],
    decide: ['02','08','06','10']
  };

  const CATEGORY_LABELS = {
    understand: 'Understanding Yourself',
    explore: 'Exploring Possibilities',
    decide: 'Decision Confidence'
  };

  function getAnswers() {
    try { return JSON.parse(localStorage.getItem('studentCompassAnswers') || '{}'); }
    catch (e) { return {}; }
  }

  function getCategoryScores() {
    const categories = [
      'understand','understand','understand','understand',
      'explore','explore','explore','explore',
      'decide','decide','decide','decide'
    ];
    const answers = getAnswers();
    const totals = {understand:0, explore:0, decide:0};
    const counts = {understand:0, explore:0, decide:0};

    categories.forEach((category, index) => {
      const value = Number(answers[index] || 0);
      if (value >= 1 && value <= 5) {
        totals[category] += value;
        counts[category] += 1;
      }
    });

    return Object.keys(totals)
      .map(key => ({key, value: counts[key] ? totals[key] / counts[key] : 0}))
      .sort((a, b) => b.value - a.value);
  }

  function getRecommendedIds() {
    const scores = getCategoryScores();
    const hasCompleteScores = scores.every(item => item.value > 0);

    // If a student arrives here without completing Compass, show a useful starter set.
    if (!hasCompleteScores) return ['01','05','08'];

    const strongest = scores[0].key;
    const weakest = scores[scores.length - 1].key;

    // A tie across all three areas means the reflection did not distinguish a
    // strongest/weakest area. In that case, give one idea from each theme.
    if (scores[0].value === scores[2].value) {
      return ['04','01','02'];
    }

    // Two ideas address the area the student may want to strengthen;
    // one builds on the area that already comes naturally.
    const ids = [
      ...(CATEGORY_TO_IDS[weakest] || []).slice(0, 2),
      ...(CATEGORY_TO_IDS[strongest] || []).slice(0, 1)
    ];

    return [...new Set(ids)].slice(0, 3);
  }

  function card(c) {
    const tags = c.tags.map(tag => `<span class="library-tag">#${tag}</span>`).join(' ');
    return `<article class="compass-library-card">
      <span class="library-number">${c.id}</span>
      <h2>${c.title}</h2>
      <p class="library-moment">“${c.moment}”</p>
      <div class="library-tags">${tags}</div>
      <a class="text-link" href="library-${c.slug}.html">Explore the idea →</a>
    </article>`;
  }

  function initRecommendations() {
    const root = document.querySelector('[data-recommended-grid]');
    if (!root) return;

    const ids = getRecommendedIds();
    const chosen = ids.map(id => CAPSULES.find(c => c.id === id)).filter(Boolean);
    root.innerHTML = chosen.map(card).join('');

    const note = document.querySelector('[data-recommendation-note]');
    if (note) {
      const scores = getCategoryScores();
      if (scores.every(item => item.value > 0) && scores[0].value !== scores[2].value) {
        const strongest = CATEGORY_LABELS[scores[0].key];
        const weakest = CATEGORY_LABELS[scores[2].key];
        note.textContent = `Two ideas here connect with ${weakest.toLowerCase()}, and one builds on ${strongest.toLowerCase()}.`;
      } else {
        note.textContent = 'These ideas are a starting point for further reflection — not labels or a prescription.';
      }
    }
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
    grid.querySelectorAll('[data-tag]').forEach(tag => tag.addEventListener('click', () => apply(tag.dataset.tag)));
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('tag');
    if (initial && buttons.some(b => b.dataset.filter === initial)) apply(initial);
    else apply('all');
  }

  initRecommendations();
  initFilters();
})();
