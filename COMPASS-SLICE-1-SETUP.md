# Compass — Vertical Slice 1

This package is designed to be added to the existing `ramsparames/theevolvefoundation` repository without changing production.

## What this slice contains

- Existing Compass marketing page CTA updated to launch the product.
- A new `/compass/app.html` guided product shell.
- Five-question **Know Me** flow.
- First Compass reflection generated from the student's answers.
- Passwordless save/continue flow.
- Neon/Postgres persistence for the Compass session.
- Email magic-link delivery through the existing Resend pattern.
- A secure `/compass/continue.html?token=...` verification page.
- SQL schema for the first Compass session table.

## Branch

Use a new branch from the current redesigned review branch:

`evolve-review` → `compass-slice-1`

Do not merge this into `main` yet.

## Vercel setup required before testing the real save/return flow

The code expects these Preview environment variables:

- `DATABASE_URL` — Neon Postgres connection string
- `RESEND_API_KEY` — existing Resend API key
- `MAIL_FROM` — optional; defaults to `The Evolve Foundation <enquire@theevolvefoundation.com>`
- `APP_ORIGIN` — optional; set to the Preview URL if you want to force the magic-link host

The database should be provisioned through Vercel Marketplace/Neon, then run `compass/schema.sql` once.

The existing site already has a Resend-backed Compass API, so this slice reuses the same email provider pattern rather than introducing another service.

## Important

The current production site is not modified by this package. It is intended to be reviewed as a Preview deployment first.

The first slice intentionally stops after the student has completed Know Me, received the first reflection and authenticated to save/return. Step 2 is represented by a continuation state but is not yet implemented.
