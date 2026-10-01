# Student Compass email API

This service sends the completed Student Compass reflection to the student and sends a lead notification to `enquire@theevolvefoundation.com`.

## No database

The service does not write submissions to a database. It calculates the reflection in memory and sends two emails. The only persistent copies are the emails themselves and any normal email-provider delivery logs.

## Deploy on Render

Create a small **Web Service** pointing to this `api` folder (or deploy the API as its own service).

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Set these environment variables:

```text
ALLOWED_ORIGIN=https://www.theevolvefoundation.com
ENQUIRY_EMAIL=enquire@theevolvefoundation.com
MAIL_FROM=The Evolve Foundation <enquire@theevolvefoundation.com>
```

Then choose either Resend or SMTP.

### Resend

Set:

```text
RESEND_API_KEY=re_...
```

The `MAIL_FROM` domain must be verified with your email provider.

### SMTP

Set:

```text
SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=enquire@theevolvefoundation.com
SMTP_PASS=...
```

## Frontend

`student-compass.js` posts to `/api/student-compass/submit` by default. If the API is deployed as a separate Render service, set this before loading the script:

```html
<script>window.STUDENT_COMPASS_API_URL='https://YOUR-API-SERVICE.onrender.com/api/student-compass/submit';</script>
<script defer src="student-compass.js"></script>
```

The endpoint includes a honeypot field, basic validation and a lightweight in-memory rate limit. No visitor data is persisted by this service.
