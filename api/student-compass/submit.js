const QUESTIONS = [
  {
    text: 'When you think about what comes next, which feels most like you?',
    options: [
      "I really don't know yet.",
      "I have a few things I'm curious about.",
      "I have a direction in mind, but I'm not sure.",
      "I have a fairly clear direction."
    ]
  },
  {
    text: 'How well do you feel you know yourself?',
    options: [
      "I'm still figuring myself out.",
      "I know some things about myself, but there's a lot I haven't thought about.",
      "I have a fairly good sense of what suits me.",
      "I know myself quite well and can explain why certain things fit me."
    ]
  },
  {
    text: 'When something catches your interest, what usually happens?',
    options: [
      "I notice it, but usually move on.",
      "I think about it or look it up.",
      "I usually try to learn more about it.",
      "I like to try things and see what I learn."
    ]
  },
  {
    text: 'When you think about your future, what feels hardest right now?',
    options: [
      'Knowing what I want.',
      'Choosing between different possibilities.',
      "Knowing whether I'm making the right choice.",
      'Turning what I want into action.'
    ]
  },
  {
    text: 'How much have you actually explored the things you\'re curious about?',
    options: [
      'Not much yet.',
      "I've thought about them or searched online.",
      "I've talked to people or learned more about them.",
      "I've actually tried something."
    ]
  },
  {
    text: "When you're unsure about an important choice, what do you tend to do?",
    options: [
      'Wait until I feel more certain.',
      'Ask other people what they think.',
      'Look for information before deciding.',
      'Make the best choice I can and adjust as I learn.'
    ]
  },
  {
    text: 'Which feels closest to you right now?',
    options: [
      'I wish I knew myself better.',
      'I wish I had more things to explore.',
      'I wish I knew which direction to choose.',
      'I know my direction, but I need to get moving.'
    ]
  },
  {
    text: 'If you had the next month to make progress on your future, what would you most want to do?',
    options: [
      'Understand myself better.',
      "Explore something I'm curious about.",
      'Get clearer about a direction.',
      'Take action on a direction I already have.'
    ]
  }
];

const STATES = {
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

const RECOMMENDATIONS = {
  bearings: [
    ['A Clue, Not a Contract', 'When you are still figuring yourself out, an interest can be a useful clue without needing to become a career decision.', 'https://www.theevolvefoundation.com/library-a-clue-not-a-contract.html'],
    ['The Dressing Room', 'Trying something does not mean committing to it. A small experiment can help you notice what fits and what does not.', 'https://www.theevolvefoundation.com/library-the-dressing-room.html'],
    ['Driving Through Fog', 'You may not be able to see the whole route yet. Sometimes the next part becomes clearer once you start moving.', 'https://www.theevolvefoundation.com/library-driving-through-fog.html']
  ],
  exploring: [
    ['The Dressing Room', 'You already have things that interest you. Exploring one does not mean choosing it forever.', 'https://www.theevolvefoundation.com/library-the-dressing-room.html'],
    ['A Clue, Not a Contract', 'Curiosity can tell you where to look next without asking you to turn an interest into a career decision.', 'https://www.theevolvefoundation.com/library-a-clue-not-a-contract.html'],
    ['Driving Through Fog', 'You do not need the whole answer before you begin. A conversation, experiment or experience can reveal a little more of the road.', 'https://www.theevolvefoundation.com/library-driving-through-fog.html']
  ],
  direction: [
    ['Driving Through Fog', 'A direction can be useful even when the final destination is still unclear. Focus on the next part of the road you can actually see.', 'https://www.theevolvefoundation.com/library-driving-through-fog.html'],
    ['The Dressing Room', 'Testing a possibility gives you information. Exploring it is not the same as committing to it.', 'https://www.theevolvefoundation.com/library-the-dressing-room.html'],
    ['Recalculating', 'If new information changes your direction, that can be evidence that you are paying attention rather than evidence that you failed.', 'https://www.theevolvefoundation.com/library-recalculating.html']
  ],
  moving: [
    ['The First Domino', 'When you already know the direction, the useful question is often simply: what is the smallest move that can start the chain?', 'https://www.theevolvefoundation.com/library-the-first-domino.html'],
    ['Confidence Is a Receipt', 'You do not have to feel completely confident before you begin. Small actions can give you evidence that builds confidence afterwards.', 'https://www.theevolvefoundation.com/library-confidence-is-a-receipt.html'],
    ["Who's Holding the Wheel?", 'Fear and doubt can be present without being the ones deciding what you do next.', 'https://www.theevolvefoundation.com/library-whos-holding-the-wheel.html']
  ]
};

const ENQUIRY_EMAIL = process.env.ENQUIRY_EMAIL || 'enquire@theevolvefoundation.com';
const MAIL_FROM = process.env.MAIL_FROM || 'The Evolve Foundation <enquire@theevolvefoundation.com>';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';
const BRAND_TAGLINE = 'Helping young people understand themselves and navigate life well.';

const attempts = globalThis.__studentCompassAttempts || new Map();
globalThis.__studentCompassAttempts = attempts;

function rateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const max = 5;
  const record = attempts.get(ip);
  if (!record || now - record.start > windowMs) {
    attempts.set(ip, { start: now, count: 1 });
    return true;
  }
  record.count += 1;
  return record.count <= max;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function calculateState(answers) {
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
  const stateKey = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0] || 'bearings';
  return { key: stateKey, state: STATES[stateKey], scores };
}

function buildPersonalisedIdeas(stateKey) {
  return (RECOMMENDATIONS[stateKey] || RECOMMENDATIONS.bearings).map(([title, why, href]) => ({ title, why, href }));
}

function emailShell(content, maxWidth = 720) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f7f4ee;color:#1b232b;font-family:Arial,Helvetica,sans-serif;">
  <div style="width:100%;background:#f7f4ee;padding:28px 14px 40px;box-sizing:border-box;">
    <div style="max-width:${maxWidth}px;margin:0 auto;">${content}</div>
  </div>
  </body></html>`;
}

function buildStudentEmail(name, stateKey) {
  const { state } = calculateStateFromKey(stateKey);
  const ideas = buildPersonalisedIdeas(stateKey);
  const safeName = escapeHtml(name);
  const ideaLinks = ideas.map((idea, index) => `
    <tr><td style="padding:0 0 ${index === ideas.length - 1 ? 0 : 10}px;">
      <a href="${idea.href}" style="color:#1b232b;text-decoration:none;font-family:Georgia,serif;font-size:18px;line-height:1.2;">${escapeHtml(idea.title)}</a>
      <div style="font-size:13px;line-height:1.5;color:#65717a;margin-top:4px;">${escapeHtml(idea.why)}</div>
    </td></tr>`).join('');

  const content = `
    <div style="background:#1b232b;color:#f8f4ec;padding:34px 34px 38px;">
      <div style="font-family:monospace;font-size:11px;letter-spacing:.16em;color:#cbd4c6;text-transform:uppercase;margin-bottom:16px;">STUDENT COMPASS</div>
      <h1 style="font-family:Georgia,serif;font-size:36px;line-height:1.08;font-weight:500;margin:0 0 12px;color:#f8f4ec;">Your Compass Reflection</h1>
      <p style="font-size:17px;line-height:1.55;color:#d8dfd8;margin:0;">A short reflection on where you are today and what may be useful next.</p>
    </div>

    <div style="background:#fbfaf7;border:1px solid #ddd8ce;border-top:0;padding:30px 26px 26px;">
      <p style="margin:0 0 8px;font-size:14px;color:#4b575f;">Hi ${safeName},</p>
      <p style="margin:0;font-size:15px;line-height:1.65;color:#4b575f;">Your Compass is not a score or a prediction. It is simply a useful way to pause, notice where you are and think about what could help next.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 0;border-collapse:collapse;">
        <tr>
          <td valign="top" width="50%" style="background:#ffffff;border:1px solid #ddd8ce;padding:22px 20px;">
            <div style="font-family:monospace;font-size:10px;letter-spacing:.14em;color:#647a6f;text-transform:uppercase;margin-bottom:12px;">WHERE YOU ARE TODAY</div>
            <div style="font-family:Georgia,serif;font-size:25px;line-height:1.12;color:#1b232b;margin-bottom:10px;">${escapeHtml(state.title)}</div>
            <div style="font-size:14px;line-height:1.6;color:#65717a;">${escapeHtml(state.summary)}</div>
          </td>
          <td width="14" style="font-size:0;line-height:0;">&nbsp;</td>
          <td valign="top" width="50%" style="background:#f3ecdf;border:1px solid #ddd8ce;padding:22px 20px;">
            <div style="font-family:monospace;font-size:10px;letter-spacing:.14em;color:#647a6f;text-transform:uppercase;margin-bottom:12px;">WHAT YOU CAN DO NEXT</div>
            <div style="font-family:Georgia,serif;font-size:25px;line-height:1.12;color:#1b232b;margin-bottom:10px;">${escapeHtml(state.stepTitle)}</div>
            <div style="font-size:14px;line-height:1.6;color:#65717a;">${escapeHtml(state.step)}</div>
          </td>
        </tr>
      </table>

      <div style="margin-top:30px;padding-top:26px;border-top:1px solid #ddd8ce;">
        <div style="font-family:monospace;font-size:10px;letter-spacing:.14em;color:#647a6f;text-transform:uppercase;margin-bottom:8px;">WANT TO GO DEEPER?</div>
        <div style="font-family:Georgia,serif;font-size:25px;line-height:1.15;color:#1b232b;margin-bottom:8px;">Explore Launchpad.</div>
        <div style="font-size:14px;line-height:1.6;color:#65717a;margin-bottom:18px;">${escapeHtml(state.launch)}</div>
        <a href="https://www.theevolvefoundation.com/launchpad.html" style="display:inline-block;background:#c89a4b;color:#1b232b;text-decoration:none;font-weight:bold;padding:13px 20px;border-radius:3px;">Explore Launchpad →</a>
      </div>

      <div style="margin-top:30px;padding-top:26px;border-top:1px solid #ddd8ce;">
        <div style="font-family:monospace;font-size:10px;letter-spacing:.14em;color:#647a6f;text-transform:uppercase;margin-bottom:8px;">KEEP EXPLORING</div>
        <div style="font-family:Georgia,serif;font-size:22px;line-height:1.15;color:#1b232b;margin-bottom:14px;">A few ideas chosen for you.</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${ideaLinks}</table>
        <div style="margin-top:16px;"><a href="https://www.theevolvefoundation.com/library.html" style="font-size:13px;color:#516b61;text-decoration:none;">Explore the full Library →</a></div>
      </div>

      <div style="margin-top:34px;padding-top:20px;border-top:1px solid #ddd8ce;color:#65717a;font-size:13px;line-height:1.5;">
        Warmly,<br>
        <strong style="color:#1b232b;">Rams</strong><br>
        <strong style="color:#1b232b;">The Evolve Foundation</strong><br>
        ${BRAND_TAGLINE}
      </div>
    </div>`;

  return emailShell(content);
}

function calculateStateFromKey(stateKey) {
  return { key: stateKey, state: STATES[stateKey] || STATES.bearings };
}

function buildNotificationEmail(lead, stateKey, answers) {
  const { state } = calculateStateFromKey(stateKey);
  const ideas = buildPersonalisedIdeas(stateKey);
  const responseRows = QUESTIONS.map((question, index) => {
    const response = question.options[Number(answers[index])] || 'Response not available';
    return `<tr>
      <td valign="top" style="padding:14px 12px 14px 0;border-top:1px solid #e3dfd6;width:44%;font-size:13px;line-height:1.5;color:#46525a;">${escapeHtml(question.text)}</td>
      <td valign="top" style="padding:14px 0;border-top:1px solid #e3dfd6;font-size:14px;line-height:1.5;color:#1b232b;font-weight:600;">${escapeHtml(response)}</td>
    </tr>`;
  }).join('');
  const ideaRows = ideas.map(idea => `<li style="margin:0 0 7px;"><a href="${idea.href}" style="color:#516b61;">${escapeHtml(idea.title)}</a> — ${escapeHtml(idea.why)}</li>`).join('');

  const content = `
    <div style="background:#1b232b;color:#f8f4ec;padding:28px 30px;">
      <div style="font-family:monospace;font-size:11px;letter-spacing:.16em;color:#cbd4c6;text-transform:uppercase;margin-bottom:10px;">STUDENT COMPASS LEAD</div>
      <div style="font-family:Georgia,serif;font-size:30px;line-height:1.1;color:#f8f4ec;">${escapeHtml(lead.name)}</div>
    </div>

    <div style="background:#fbfaf7;border:1px solid #ddd8ce;border-top:0;padding:26px 26px 30px;">
      <div style="font-size:14px;line-height:1.7;color:#4b575f;margin-bottom:24px;">
        <strong>Email:</strong> ${escapeHtml(lead.email)}<br>
        <strong>Phone:</strong> ${escapeHtml(lead.phone)}<br>
        <strong>Captured:</strong> ${escapeHtml(lead.capturedAt)}
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px;">
        <tr>
          <td valign="top" width="50%" style="background:#ffffff;border:1px solid #ddd8ce;padding:20px 18px;">
            <div style="font-family:monospace;font-size:10px;letter-spacing:.14em;color:#647a6f;text-transform:uppercase;margin-bottom:10px;">WHERE THEY ARE TODAY</div>
            <div style="font-family:Georgia,serif;font-size:23px;line-height:1.15;color:#1b232b;margin-bottom:8px;">${escapeHtml(state.title)}</div>
            <div style="font-size:13px;line-height:1.55;color:#65717a;">${escapeHtml(state.summary)}</div>
          </td>
          <td width="12" style="font-size:0;line-height:0;">&nbsp;</td>
          <td valign="top" width="50%" style="background:#f3ecdf;border:1px solid #ddd8ce;padding:20px 18px;">
            <div style="font-family:monospace;font-size:10px;letter-spacing:.14em;color:#647a6f;text-transform:uppercase;margin-bottom:10px;">WHAT THEY CAN DO NEXT</div>
            <div style="font-family:Georgia,serif;font-size:23px;line-height:1.15;color:#1b232b;margin-bottom:8px;">${escapeHtml(state.stepTitle)}</div>
            <div style="font-size:13px;line-height:1.55;color:#65717a;">${escapeHtml(state.step)}</div>
          </td>
        </tr>
      </table>

      <div style="font-family:Georgia,serif;font-size:23px;color:#1b232b;margin:0 0 12px;">The 8 reflections</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr>
          <th align="left" style="padding:0 12px 10px 0;font-family:monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#647a6f;width:44%;">Question</th>
          <th align="left" style="padding:0 0 10px;font-family:monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#647a6f;">Their response</th>
        </tr></thead>
        <tbody>${responseRows}</tbody>
      </table>

      <div style="margin-top:28px;padding-top:22px;border-top:1px solid #ddd8ce;">
        <div style="font-family:Georgia,serif;font-size:21px;color:#1b232b;margin-bottom:10px;">Personalised Library ideas</div>
        <ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.55;color:#65717a;">${ideaRows}</ul>
      </div>

      <div style="margin-top:28px;padding-top:20px;border-top:1px solid #ddd8ce;color:#65717a;font-size:12px;line-height:1.5;">
        Rams · The Evolve Foundation<br>
        ${BRAND_TAGLINE}
      </div>
    </div>`;

  return emailShell(content, 820);
}

async function sendResendEmail({ to, subject, html, replyTo, idempotencyKey }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {})
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [to],
      subject,
      html,
      reply_to: replyTo
    })
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error ${response.status}: ${body}`);
  }
  return response.json();
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGIN && origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ ok: false, message: 'Origin not allowed.' });
  }

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN || origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed.' });

  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (!rateLimit(ip)) return res.status(429).json({ ok: false, message: 'Too many submissions. Please try again later.' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, email, phone, answers, website } = body;
    if (website) return res.status(400).json({ ok: false, message: 'Invalid submission.' });

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();

    if (!cleanName || cleanName.length > 120) return res.status(400).json({ ok: false, message: 'Please enter your name.' });
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || cleanEmail.length > 180) return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    if (!cleanPhone || cleanPhone.length > 40) return res.status(400).json({ ok: false, message: 'Please enter your phone number.' });
    if (!Array.isArray(answers)) return res.status(400).json({ ok: false, message: 'Your reflection responses are missing.' });

    const values = QUESTIONS.map((_, i) => Number(answers[i]));
    if (values.length !== QUESTIONS.length || values.some((value) => !Number.isInteger(value) || value < 0 || value > 3)) {
      return res.status(400).json({ ok: false, message: 'Please complete all eight reflections before continuing.' });
    }

    const stateKey = calculateState(values).key;
    const capturedAt = new Date().toISOString();
    const lead = { name: cleanName, email: cleanEmail, phone: cleanPhone, capturedAt };
    const submissionId = String(body.submissionId || `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100);

    await Promise.all([
      sendResendEmail({
        to: cleanEmail,
        replyTo: ENQUIRY_EMAIL,
        subject: 'Your Student Compass reflection — The Evolve Foundation',
        html: buildStudentEmail(cleanName, stateKey),
        idempotencyKey: `student-compass-student-${submissionId}`
      }),
      sendResendEmail({
        to: ENQUIRY_EMAIL,
        replyTo: cleanEmail,
        subject: `New Student Compass lead — ${cleanName}`,
        html: buildNotificationEmail(lead, stateKey, values),
        idempotencyKey: `student-compass-lead-${submissionId}`
      })
    ]);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Student Compass submission failed:', error);
    return res.status(500).json({ ok: false, message: 'We could not send your reflection just now. Please try again in a moment.' });
  }
};
