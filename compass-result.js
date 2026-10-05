const answers = JSON.parse(sessionStorage.getItem('studentCompassAnswersV3') || '[]');

const states = {
  bearings: {
    title: 'Finding Your Bearings',
    summary: 'You are still figuring out what fits you and what matters to you. That is a useful place to be.',
    stepTitle: 'Start with yourself',
    step: 'Notice what you naturally enjoy, what you do well and what brings out your best. You do not need to choose a direction yet.',
    launch: 'If you want guided support to understand yourself and explore what matters to you, Launchpad can help you start there.',
    hero: 'You do not need a direction yet. A little more self understanding can make the next choice easier.'
  },
  exploring: {
    title: 'Looking Around',
    summary: 'You have some interests and possibilities in mind, but you need more experience to know which ones are worth exploring.',
    stepTitle: 'Explore one thing',
    step: 'Pick one thing you are curious about. Talk to someone, try something small or find a real experience that lets you learn more about it.',
    launch: 'If you want a structured space to understand yourself and explore possible directions, Launchpad can help.',
    hero: 'You have some possibilities in mind. The useful next move is to turn curiosity into something real you can learn from.'
  },
  direction: {
    title: 'Finding a Direction',
    summary: 'You have something in mind, but you are still working out whether it is a direction worth pursuing.',
    stepTitle: 'Test before you decide',
    step: 'Choose one small way to learn more about the direction. Look for evidence from people, experiences or experiments rather than trying to predict the whole future.',
    launch: 'If you want help turning a possible direction into a thoughtful decision, Launchpad is designed for that.',
    hero: 'You have a direction in mind. You do not need certainty yet. You need a little more evidence.'
  },
  moving: {
    title: 'Ready to Move',
    summary: 'You have a direction in mind. The useful question now is not whether it is definitely right, but what you can do next to learn more.',
    stepTitle: 'Take one concrete step',
    step: 'Choose one action you can complete in the next 30 days. Do it, notice what you learn and adjust from there.',
    launch: 'You may not need a programme right now. If you want structured accountability and reflection, Launchpad is there when you need it.',
    hero: 'You have a direction in mind. The next useful move is small, concrete action that gives you evidence.'
  }
};

/*
 * Recommendations are deliberately tied to the Compass state, not simply
 * reordered versions of the same three generic topics. Each set connects
 * the student's current position to the next step suggested by the reflection.
 */
const recommendations = {
  bearings: [
    {
      role: 'START HERE',
      title: 'A Clue, Not a Contract',
      why: 'When you are still figuring yourself out, an interest can be a useful clue without needing to become a career decision.',
      href: 'library-a-clue-not-a-contract.html'
    },
    {
      role: 'TRY THIS NEXT',
      title: 'The Dressing Room',
      why: 'Trying something does not mean committing to it. A small experiment can help you notice what fits and what does not.',
      href: 'library-the-dressing-room.html'
    },
    {
      role: 'KEEP IN MIND',
      title: 'Driving Through Fog',
      why: 'You may not be able to see the whole route yet. Sometimes the next part becomes clearer once you start moving.',
      href: 'library-driving-through-fog.html'
    }
  ],
  exploring: [
    {
      role: 'START HERE',
      title: 'The Dressing Room',
      why: 'You already have things that interest you. This is a useful reminder that exploring one does not mean choosing it forever.',
      href: 'library-the-dressing-room.html'
    },
    {
      role: 'TRY THIS NEXT',
      title: 'A Clue, Not a Contract',
      why: 'Curiosity can tell you where to look next without asking you to turn an interest into a career decision.',
      href: 'library-a-clue-not-a-contract.html'
    },
    {
      role: 'KEEP IN MIND',
      title: 'Driving Through Fog',
      why: 'You do not need the whole answer before you begin. A conversation, experiment or experience can reveal a little more of the road.',
      href: 'library-driving-through-fog.html'
    }
  ],
  direction: [
    {
      role: 'START HERE',
      title: 'Driving Through Fog',
      why: 'A direction can be useful even when the final destination is still unclear. Focus on the next part of the road you can actually see.',
      href: 'library-driving-through-fog.html'
    },
    {
      role: 'TRY THIS NEXT',
      title: 'The Dressing Room',
      why: 'Testing a possibility gives you information. Exploring it is not the same as committing to it.',
      href: 'library-the-dressing-room.html'
    },
    {
      role: 'KEEP IN MIND',
      title: 'Recalculating',
      why: 'If new information changes your direction, that can be evidence that you are paying attention rather than evidence that you failed.',
      href: 'library-recalculating.html'
    }
  ],
  moving: [
    {
      role: 'START HERE',
      title: 'The First Domino',
      why: 'When you already know the direction, the useful question is often simply: what is the smallest move that can start the chain?',
      href: 'library-the-first-domino.html'
    },
    {
      role: 'TRY THIS NEXT',
      title: 'Confidence Is a Receipt',
      why: 'You do not have to feel completely confident before you begin. Small actions can give you evidence that builds confidence afterwards.',
      href: 'library-confidence-is-a-receipt.html'
    },
    {
      role: 'KEEP IN MIND',
      title: 'Who’s Holding the Wheel?',
      why: 'Fear and doubt can be present without being the ones deciding what you do next.',
      href: 'library-whos-holding-the-wheel.html'
    }
  ]
};

function getState() {
  const scores = { bearings: 0, exploring: 0, direction: 0, moving: 0 };
  const map = [
    ['bearings', 'exploring', 'direction', 'moving'],
    ['bearings', 'exploring', 'direction', 'moving'],
    ['bearings', 'exploring', 'exploring', 'moving'],
    ['bearings', 'exploring', 'direction', 'moving'],
    ['bearings', 'exploring', 'direction', 'moving'],
    ['bearings', 'exploring', 'direction', 'moving'],
    ['bearings', 'exploring', 'direction', 'moving'],
    ['bearings', 'exploring', 'direction', 'moving']
  ];

  answers.forEach((value, index) => {
    const state = map[index]?.[Number(value)];
    if (state) scores[state] += 1;
  });

  return Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0] || 'bearings';
}

const stateKey = getState();
const state = states[stateKey];
const ideas = recommendations[stateKey] || recommendations.bearings;

document.getElementById('state-title').textContent = state.title;
document.getElementById('state-summary').textContent = state.summary;
document.getElementById('step-title').textContent = state.stepTitle;
document.getElementById('step-text').textContent = state.step;
document.getElementById('launch-text').textContent = state.launch;
document.getElementById('hero-summary').textContent = state.hero;

document.getElementById('recommendations-intro').textContent =
  `These three Library ideas were chosen to connect with ${state.title.toLowerCase()} and the next step suggested by your reflection.`;

ideas.forEach((idea, index) => {
  const n = index + 1;
  const card = document.getElementById(`idea-${n}`);
  if (!card) return;
  card.href = idea.href;
  document.getElementById(`idea-role-${n}`).textContent = idea.role;
  document.getElementById(`idea-title-${n}`).textContent = idea.title;
  document.getElementById(`idea-why-${n}`).textContent = idea.why;
});
