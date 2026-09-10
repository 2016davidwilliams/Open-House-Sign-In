# Standalone Real Estate Lead Capture Site

This repository is intentionally separate from Williams Family OS. It includes:
1. A responsive GitHub Pages lead form
2. Supabase database storage with Row Level Security
3. A private magic-link dashboard with CSV export
4. A QR code generator for the deployed form URL
5. A Supabase Edge Function template for email notification through Resend

## 1. Create the new GitHub repository
Create an empty repository, upload every file and folder from this package, and commit to `main`. In repository Settings > Pages, publish from the `main` branch and `/ (root)`.

## 2. Create Supabase project and database
Create a Supabase project. Open SQL Editor, paste `supabase/schema.sql`, replace `YOUR_EMAIL@example.com` with the dashboard owner's email, and run it.

In Supabase Authentication settings, add the final GitHub Pages URL to the allowed redirect URLs. Disable public account creation if available in the project's authentication settings, or restrict dashboard access with the email allowlist already included in the read policy.

## 3. Connect the website
In Supabase Project Settings > API, copy the Project URL and publishable/anon key into `config.js`. The anon key is intended for browser use, but never place the service-role key in GitHub.

Commit the updated `config.js`. Test a submission. Confirm it appears in Supabase Table Editor.

## 4. Dashboard
Open `dashboard.html`, enter the exact authorized email from the SQL policy, then use the emailed magic link. The dashboard reads submissions and exports CSV. Anonymous visitors can insert but cannot read leads.

## 5. QR code
Open `qr.html`, paste the published root URL, optionally enter a source such as `smith-open-house`, generate the QR code, and download the PNG.

## 6. Email/mobile notification
The included Edge Function uses Resend. Create a Resend account/API key and verify the sender domain. With the Supabase CLI, deploy `notify-new-lead`. Set Edge Function secrets: `RESEND_API_KEY`, `FROM_EMAIL`, `NOTIFICATION_EMAIL`, and `WEBHOOK_SECRET`.

In Supabase, create a Database Webhook on INSERT for the `leads` table. Point it to the deployed Edge Function URL and add the `x-webhook-secret` header matching `WEBHOOK_SECRET`. New submissions then generate email notifications, which will appear on the recipient's mobile device if email notifications are enabled.

## Privacy and production checklist
- Use a privacy notice appropriate for the real estate professional and jurisdiction.
- Collect only necessary information and define a retention/deletion practice.
- Do not request Social Security numbers, bank data, loan documents, or other sensitive financial details.
- Add CAPTCHA/rate limiting before public promotion if spam becomes an issue.
- Verify required real estate, brokerage, consent, and advertising disclosures with the applicable broker or legal adviser.
