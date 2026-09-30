/* Student Compass — front-end flow and reflection logic. */
(function () {
  const QUESTIONS = [
    { section: 'Understand Yourself', text: 'I have spent time thinking about what I am naturally good at.', prompt: 'Think about strengths that show up in real situations, not just things you wish were true.', category: 'understand' },
    { section: 'Understand Yourself', text: 'I can point to experiences that show what I do well.', prompt: 'Think about projects, conversations, activities or moments you handled well.', category: 'understand' },
    { section: 'Understand Yourself', text: 'I have a sense of what matters to me when I choose how to spend my time.', prompt: 'Think about the values, people or experiences that tend to matter to you.', category: 'understand' },
    { section: 'Understand Yourself', text: 'I can describe the kind of environment in which I do my best.', prompt: 'Think about the people, pace, structure or freedom that helps you work well.', category: 'understand' },
    { section: 'Explore Possibilities', text: 'I notice subjects, problems or activities that naturally make me curious.', prompt: 'Think about what you find yourself reading, asking about or wanting to understand better.', category: 'explore' },
    { section: 'Explore Possibilities', text: 'I am willing to try something new before deciding whether it suits me.', prompt: 'Think about how often you use small experiments to learn rather than waiting for certainty.', category: 'explore' },
    { section: 'Explore Possibilities', text: 'I can imagine more than one direction that I would like to explore.', prompt: 'Your options do not need to be final choices. Think about possibilities that genuinely interest you.', category: 'explore' },
    { section: 'Explore Possibilities', text: 'I seek out people, experiences or information that help me understand possibilities.', prompt: 'Think about how actively you learn from the world outside your usual routine.', category: 'explore' },
    { section: 'Take Your Next Step', text: 'I can make a reasonable choice even when I do not know exactly how it will turn out.', prompt: 'Think about whether you can move forward without needing complete certainty.', category: 'decide' },
    { section: 'Take Your Next Step', text: 'When I am unsure, I can identify what information I actually need before deciding.', prompt: 'Think about whether you can separate useful information from endless research.', category: 'decide' },
    { section: 'Take Your Next Step', text: 'I am able to turn a decision into a small, concrete next step.', prompt: 'Think about whether you can move from thinking about something to actually doing something.', category: 'decide' },
    { section: 'Take Your Next Step', text: 'I trust myself to adjust my direction when I learn something new.', prompt: 'Think about whether changing course feels like learning rather than failure.', category: 'decide' }
  ];

  const categoryMeta = {
    understand: {
      title: 'Understanding Yourself',
      natural: 'You seem to have a useful awareness of your strengths, experiences and what helps you do your best.',
      strengthen: 'Spending more time noticing your patterns, values and strengths could give you more clarity.'
    },
    explore: {
      title: 'Exploring Possibilities',
      natural: 'You seem comfortable being curious, looking at possibilities and learning before you decide.',
      strengthen: 'Giving yourself more permission to explore and test possibilities could open up new directions.'
    },
    decide: {
      title: 'Decision Confidence',
      natural: 'You seem comfortable turning uncertainty into a decision and a practical next step.',
      strengthen: 'Building confidence in making a useful decision without complete certainty may be worth focusing on.'
    }
  };

  function saveAnswers(answers) {
    localStorage.setItem('studentCompassAnswers', JSON.stringify(answers));
  }

  function getAnswers() {
    try {
      return JSON.parse(localStorage.getItem('studentCompassAnswers') || '{}');
    } catch (e) {
      return {};
    }
  }

  function setCurrentPage() {
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-student-compass').forEach((link) => {
      if (path === 'student-compass.html' || path === 'compass-reflection.html' || path === 'compass-details.html' || path === 'compass-result.html' || path === 'compass-capsules.html') {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
    }

    document.querySelectorAll('.nav-dropdown-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const menu = trigger.nextElementSibling;
        if (!menu) return;
        const open = menu.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(open));
      });
    });
  }

  function initReflection() {
    const root = document.querySelector('[data-compass-reflection]');
    if (!root) return;

    let index = 0;
    const answers = getAnswers();
    const section = root.querySelector('[data-section]');
    const count = root.querySelector('[data-count]');
    const progress = root.querySelector('[data-progress]');
    const question = root.querySelector('[data-question]');
    const prompt = root.querySelector('[data-prompt]');
    const scale = root.querySelector('[data-scale]');
    const continueBtn = root.querySelector('[data-continue]');
    const backBtn = root.querySelector('[data-back]');

    function render() {
      const item = QUESTIONS[index];
      const selected = Number(answers[index] || 0);
      section.textContent = item.section;
      count.textContent = `Reflection ${index + 1} of ${QUESTIONS.length}`;
      progress.style.width = `${((index + 1) / QUESTIONS.length) * 100}%`;
      question.textContent = item.text;
      prompt.textContent = item.prompt;
      scale.querySelectorAll('button').forEach((button) => {
        const value = Number(button.dataset.value);
        button.classList.toggle('selected', value === selected);
        button.setAttribute('aria-pressed', String(value === selected));
      });
      backBtn.hidden = index === 0;
      continueBtn.textContent = index === QUESTIONS.length - 1 ? 'Finish Reflection →' : 'Continue →';
    }

    scale.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-value]');
      if (!button) return;
      answers[index] = Number(button.dataset.value);
      saveAnswers(answers);
      render();
    });

    continueBtn.addEventListener('click', () => {
      if (!answers[index]) {
        root.querySelector('[data-error]').textContent = 'Choose a response to continue.';
        return;
      }
      root.querySelector('[data-error]').textContent = '';
      if (index === QUESTIONS.length - 1) {
        window.location.href = 'compass-details.html';
      } else {
        index += 1;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    backBtn.addEventListener('click', () => {
      if (index > 0) {
        index -= 1;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    render();
  }

  function initLeadForm() {
    const form = document.querySelector('[data-compass-lead]');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lead = {
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        phone: String(data.get('phone') || '').trim(),
        capturedAt: new Date().toISOString()
      };

      localStorage.setItem('studentCompassLead', JSON.stringify(lead));
      window.location.href = 'compass-result.html';
    });
  }

  function initResults() {
    const root = document.querySelector('[data-compass-results]');
    if (!root) return;

    const answers = getAnswers();
    const totals = { understand: 0, explore: 0, decide: 0 };
    const counts = { understand: 0, explore: 0, decide: 0 };

    QUESTIONS.forEach((item, index) => {
      const value = Number(answers[index] || 0);
      if (value) {
        totals[item.category] += value;
        counts[item.category] += 1;
      }
    });

    const averages = Object.keys(totals).map((key) => ({
      key,
      value: counts[key] ? totals[key] / counts[key] : 0
    })).sort((a, b) => b.value - a.value);

    const natural = averages[0].key;
    const strengthen = averages[averages.length - 1].key;

    root.querySelector('[data-natural-title]').textContent = categoryMeta[natural].title;
    root.querySelector('[data-natural-copy]').textContent = categoryMeta[natural].natural;
    root.querySelector('[data-strengthen-title]').textContent = categoryMeta[strengthen].title;
    root.querySelector('[data-strengthen-copy]').textContent = categoryMeta[strengthen].strengthen;
  }

  setCurrentPage();
  initMobileNav();
  initReflection();
  initLeadForm();
  initResults();
})();
