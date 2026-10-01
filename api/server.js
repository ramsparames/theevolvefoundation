const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://www.theevolvefoundation.com';
const ENQUIRY_EMAIL = process.env.ENQUIRY_EMAIL || 'enquire@theevolvefoundation.com';
const MAIL_FROM = process.env.MAIL_FROM || 'The Evolve Foundation <enquire@theevolvefoundation.com>';

app.use(cors({ origin: ALLOWED_ORIGIN, methods: ['POST', 'OPTIONS'] }));
app.use(express.json({ limit: '50kb' }));

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

// Lightweight in-memory protection only; nothing is persisted.
const attempts = new Map();
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

  return {
    natural: averages[0].key,
    strengthen: averages[averages.length - 1].key,
    averages
  };
}

function buildStudentEmail(name, result) {
  const natural = CATEGORY_META[result.natural];
  const strengthen = CATEGORY_META[result.strengthen];
  return `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17231f;max-width:680px;margin:0 auto;padding:32px 20px;">
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

    <p>Use this as a starting point, not a label. You can keep exploring through Student Compass and the ideas from The Evolve Foundation.</p>
    <p style="margin-top:34px;color:#52605a;">Helping young people understand themselves and navigate life well</p>
    <p style="font-size:13px;color:#6a746f;">The Evolve Foundation · India</p>
  </div>`;
}

function buildNotificationEmail(lead, result, answers) {
  const natural = CATEGORY_META[result.natural];
  const strengthen = CATEGORY_META[result.strengthen];
  const rows = QUESTIONS.map((q, i) => `
    <tr>
      <td style="padding:7px;border-bottom:1px solid #eee;">${i + 1}</td>
      <td style="padding:7px;border-bottom:1px solid #eee;">${escapeHtml(q.text)}</td>
      <td style="padding:7px;border-bottom:1px solid #eee;text-align:center;">${answers[i]}</td>
    </tr>`).join('');

  return `
  <div style="font-family:Arial,sans-serif;line-height:1.5;color:#17231f;max-width:800px;">
    <h2>New Student Compass lead</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}<br>
    <strong>Email:</strong> ${escapeHtml(lead.email)}<br>
    <strong>Phone:</strong> ${escapeHtml(lead.phone)}<br>
    <strong>Captured:</strong> ${escapeHtml(lead.capturedAt)}</p>

    <h3>Reflection summary</h3>
    <p><strong>Natural theme:</strong> ${escapeHtml(natural.title)} — ${escapeHtml(natural.natural)}</p>
    <p><strong>Strengthening theme:</strong> ${escapeHtml(strengthen.title)} — ${escapeHtml(strengthen.strengthen)}</p>

    <h3>Category averages</h3>
    <ul>
      ${result.averages.map(item => `<li>${escapeHtml(CATEGORY_META[item.key].title)}: ${item.value.toFixed(2)} / 5</li>`).join('')}
    </ul>

    <h3>Responses</h3>
    <table style="border-collapse:collapse;width:100%;font-size:13px;">
      <thead><tr><th style="text-align:left;padding:7px;border-bottom:2px solid #ccc;">#</th><th style="text-align:left;padding:7px;border-bottom:2px solid #ccc;">Reflection</th><th style="padding:7px;border-bottom:2px solid #ccc;">Score</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

async function createTransporter() {
  if (process.env.RESEND_API_KEY) {
    return { type: 'resend' };
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email is not configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS.');
  }

  return {
    type: 'smtp',
    transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
  };
}

async function sendMail(transporter, message) {
  if (transporter.type === 'smtp') {
    return transporter.transporter.sendMail(message);
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: Array.isArray(message.to) ? message.to : [message.to],
      subject: message.subject,
      html: message.html,
      reply_to: message.replyTo
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email provider error: ${response.status} ${body}`);
  }
  return response.json();
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/student-compass/submit', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    if (!rateLimit(ip)) return res.status(429).json({ ok: false, message: 'Too many submissions. Please try again later.' });

    const { name, email, phone, answers, website } = req.body || {};
    if (website) return res.status(400).json({ ok: false, message: 'Invalid submission.' });

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();

    if (!cleanName || cleanName.length > 120) return res.status(400).json({ ok: false, message: 'Please enter your name.' });
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || cleanEmail.length > 180) return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    if (!cleanPhone || cleanPhone.length > 40) return res.status(400).json({ ok: false, message: 'Please enter your phone number.' });
    if (!answers || typeof answers !== 'object') return res.status(400).json({ ok: false, message: 'Your reflection responses are missing.' });

    const values = QUESTIONS.map((_, i) => Number(answers[i]));
    if (values.some((value) => !Number.isInteger(value) || value < 1 || value > 5)) {
      return res.status(400).json({ ok: false, message: 'Please complete all 12 reflections before continuing.' });
    }

    const result = calculateResult(values);
    const lead = { name: cleanName, email: cleanEmail, phone: cleanPhone, capturedAt: new Date().toISOString() };
    const mailer = await createTransporter();

    await Promise.all([
      sendMail(mailer, {
        to: cleanEmail,
        replyTo: ENQUIRY_EMAIL,
        subject: 'Your Student Compass reflection — The Evolve Foundation',
        html: buildStudentEmail(cleanName, result)
      }),
      sendMail(mailer, {
        to: ENQUIRY_EMAIL,
        replyTo: cleanEmail,
        subject: `New Student Compass lead — ${cleanName}`,
        html: buildNotificationEmail(lead, result, values)
      })
    ]);

    res.json({ ok: true });
  } catch (error) {
    console.error('Student Compass submission failed:', error);
    res.status(500).json({ ok: false, message: 'We could not send your reflection just now. Please try again in a moment.' });
  }
});

app.listen(PORT, () => console.log(`Student Compass email API listening on ${PORT}`));
