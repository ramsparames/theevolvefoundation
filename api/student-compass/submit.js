const QUESTIONS = [
  { section: 'Understand Yourself', text: 'I have spent time thinking about what I am naturally good at.', category: 'understand' },
  { section: 'Understand Yourself', text: 'I can point to experiences that show what I do well.', category: 'understand' },
  { section: 'Understand Yourself', text: 'I have a sense of what matters to me when I choose how to spend my time.', category: 'understand' },
  { section: 'Understand Yourself', text: 'I can describe the kind of environment in which I do my best.', category: 'understand' },
  { section: 'Explore Possibilities', text: 'I notice subjects, problems or activities that naturally make me curious.', category: 'explore' },
  { section: 'Explore Possibilities', text: 'I am willing to try something new before deciding whether it suits me.', category: 'explore' },
  { section: 'Explore Possibilities', text: 'I can imagine more than one direction that I would like to explore.', category: 'explore' },
  { section: 'Explore Possibilities', text: 'I seek out people, experiences or information that help me understand possibilities.', category: 'explore' },
  { section: 'Take Your Next Step', text: 'I can make a reasonable choice even when I do not know exactly how it will turn out.', category: 'decide' },
  { section: 'Take Your Next Step', text: 'When I am unsure, I can identify what information I actually need before deciding.', category: 'decide' },
  { section: 'Take Your Next Step', text: 'I am able to turn a decision into a small, concrete next step.', category: 'decide' },
  { section: 'Take Your Next Step', text: 'I trust myself to adjust my direction when I learn something new.', category: 'decide' }
];

const CATEGORY_META = {
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

const ENQUIRY_EMAIL = process.env.ENQUIRY_EMAIL || 'enquire@theevolvefoundation.com';
const MAIL_FROM = process.env.MAIL_FROM || 'The Evolve Foundation <enquire@theevolvefoundation.com>';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';

// Lightweight in-memory protection. Nothing is persisted.
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

function calculateResult(answers) {
  const totals = { understand: 0, explore: 0, decide: 0 };
  const counts = { understand: 0, explore: 0, decide: 0 };
  QUESTIONS.forEach((question, index) => {
    const value = Number(answers[index]);
    totals[question.category] += value;
    counts[question.category] += 1;
  });
  const averages = Object.keys(totals)
    .map((key) => ({ key, value: totals[key] / counts[key] }))
    .sort((a, b) => b.value - a.value);
  return { natural: averages[0].key, strengthen: averages[averages.length - 1].key, averages };
}

function buildStudentEmail(name, result) {
  const natural = CATEGORY_META[result.natural];
  const strengthen = CATEGORY_META[result.strengthen];
  return `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17231f;max-width:680px;margin:0 auto;padding:32px 20px;">
    <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#B87A2E;">STUDENT COMPASS</p>
    <h1 style="font-family:Georgia,serif;font-weight:500;font-size:34px;line-height:1.15;">Your reflection is ready.</h1>
    <p>Hi ${escapeHtml(name)},</p>
    <p>Thank you for taking the time to pause and reflect. Your Student Compass responses are not a score or diagnosis. They simply highlight a couple of themes that may be useful as you think about what comes next.</p>
    <div style="margin:28px 0;padding:22px;border:1px solid #ddd8ce;background:#FBFAF7;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5C8A7E;">What seems to come naturally</p>
      <h2 style="font-family:Georgia,serif;font-weight:500;margin:0 0 10px;font-size:26px;">${escapeHtml(natural.title)}</h2>
      <p style="margin:0;">${escapeHtml(natural.natural)}</p>
    </div>
    <div style="margin:28px 0;padding:22px;border:1px solid #ddd8ce;background:#FBFAF7;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5C8A7E;">Something you may want to strengthen</p>
      <h2 style="font-family:Georgia,serif;font-weight:500;margin:0 0 10px;font-size:26px;">${escapeHtml(strengthen.title)}</h2>
      <p style="margin:0;">${escapeHtml(strengthen.strengthen)}</p>
    </div>
    <p>Use this as a starting point, not a label. Clarity often comes from trying things, learning from experiences and asking better questions.</p>
    <div style="margin:30px 0 24px;padding-top:4px;">
      <p style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px;color:#17231f;">Keep exploring</p>
      <p style="margin:0 0 18px;">Here are two ways to continue when you are ready.</p>
      <p style="margin:0 0 12px;">
        <a href="https://www.theevolvefoundation.com/compass-capsules.html" style="display:inline-block;padding:12px 20px;background:#B87A2E;color:#ffffff;text-decoration:none;font-weight:600;">Ideas to Explore →</a>
      </p>
      <p style="margin:0;">
        <a href="https://www.theevolvefoundation.com/launchpad.html" style="display:inline-block;padding:12px 20px;border:1px solid #B87A2E;color:#B87A2E;text-decoration:none;font-weight:600;">Join Launchpad →</a>
      </p>
    </div>
    <p style="margin-top:34px;color:#52605a;">Helping young people understand themselves and navigate life well</p>
    <p style="font-size:13px;color:#6a746f;">Warmly,<br><strong>Rams</strong><br>The Evolve Foundation<br>Helping young people understand themselves and navigate life well</p>
  </div>`;
}
function buildNotificationEmail(lead, result, answers) {
  const natural = CATEGORY_META[result.natural];
  const strengthen = CATEGORY_META[result.strengthen];
  const rows = QUESTIONS.map((q, i) => `<tr><td style="padding:7px;border-bottom:1px solid #eee;">${i + 1}</td><td style="padding:7px;border-bottom:1px solid #eee;">${escapeHtml(q.text)}</td><td style="padding:7px;border-bottom:1px solid #eee;text-align:center;">${answers[i]}</td></tr>`).join('');
  return `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#17231f;max-width:800px;">
    <h2>New Student Compass lead</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}<br><strong>Email:</strong> ${escapeHtml(lead.email)}<br><strong>Phone:</strong> ${escapeHtml(lead.phone)}<br><strong>Captured:</strong> ${escapeHtml(lead.capturedAt)}</p>
    <h3>Reflection responses</h3>
    <table style="border-collapse:collapse;width:100%;font-size:13px;"><thead><tr><th style="text-align:left;padding:7px;border-bottom:2px solid #ccc;">#</th><th style="text-align:left;padding:7px;border-bottom:2px solid #ccc;">Reflection</th><th style="padding:7px;border-bottom:2px solid #ccc;">Score</th></tr></thead><tbody>${rows}</tbody></table>
    <div style="margin-top:28px;padding:20px;background:#FBFAF7;border:1px solid #ddd8ce;">
      <h3 style="margin-top:0;">Summary for follow up</h3>
      <p><strong>What seems to come naturally:</strong><br>${escapeHtml(natural.title)}<br>${escapeHtml(natural.natural)}</p>
      <p><strong>Something worth exploring further:</strong><br>${escapeHtml(strengthen.title)}<br>${escapeHtml(strengthen.strengthen)}</p>
      <p><strong>Category averages</strong></p>
      <ul>${result.averages.map(item => `<li>${escapeHtml(CATEGORY_META[item.key].title)}: ${item.value.toFixed(2)} / 5</li>`).join('')}</ul>
    </div>
  </div>`;
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
    if (values.length !== 12 || values.some((value) => !Number.isInteger(value) || value < 1 || value > 5)) {
      return res.status(400).json({ ok: false, message: 'Please complete all 12 reflections before continuing.' });
    }

    const result = calculateResult(values);
    const capturedAt = new Date().toISOString();
    const lead = { name: cleanName, email: cleanEmail, phone: cleanPhone, capturedAt };
    const submissionId = String(body.submissionId || `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100);

    await Promise.all([
      sendResendEmail({
        to: cleanEmail,
        replyTo: ENQUIRY_EMAIL,
        subject: 'Your Student Compass reflection — The Evolve Foundation',
        html: buildStudentEmail(cleanName, result),
        idempotencyKey: `student-compass-student-${submissionId}`
      }),
      sendResendEmail({
        to: ENQUIRY_EMAIL,
        replyTo: cleanEmail,
        subject: `New Student Compass lead: ${cleanName}`,
        html: buildNotificationEmail(lead, result, values),
        idempotencyKey: `student-compass-lead-${submissionId}`
      })
    ]);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Student Compass submission failed:', error);
    return res.status(500).json({ ok: false, message: 'We could not send your reflection just now. Please try again in a moment.' });
  }
};
