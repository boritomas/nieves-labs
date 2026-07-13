# Atlas Browser Assistant V1

Atlas Browser Assistant is an installable Chrome/Chromium extension for founder-guided lender forms.

It is intentionally small:

- It runs only when Tomas clicks the extension.
- It uses the current Atlas authenticated session.
- It retrieves only approved reusable Atlas fields.
- It inspects the visible lender form.
- It proposes mappings for review.
- It fills high-confidence, non-sensitive fields.
- It batches founder-only actions.
- It records non-sensitive mapping/session memory in Chrome local storage.

## Install

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select:

   `public/atlas-browser-assistant`

6. Sign in to Atlas:

   `https://nieves-labs.com/atlas/login`

7. Open a lender form or the test form:

   `https://nieves-labs.com/atlas/browser-assistant-test`

8. Click the Atlas Browser Assistant extension icon.

## Production API

The extension calls:

- `GET /api/atlas/browser-assistant/approved-fields`

The API requires an authenticated Atlas session or emergency admin token. It returns reusable, non-sensitive fields only.

Excluded:

- SSN / ITIN
- Full DOB
- driver license values
- passwords
- MFA codes
- bank account values
- credit authorization
- signatures
- legal certifications
- final submission approval

## Validation

Local validation command after starting the production build locally:

```bash
ATLAS_TEST_BASE=http://127.0.0.1:3079 ATLAS_TEST_TOKEN=dev-admin-token node scripts/test-atlas-browser-assistant.mjs
```

Acceptance target on the rendered test form:

- at least 90% autofill of supported reusable non-sensitive fields
- founder-only fields excluded
- URL normalized to `https://nieves-labs.com`
- dropdowns selected through native events
- approved document upload proof on test form
- mapping persistence and resume state recorded

## Real Lender Validation

Live lender validation must be done only on an existing founder-approved application page or a non-submitting public form state. The assistant must stop at:

- MFA
- CAPTCHA
- password/login recovery
- identity fields
- credit consent
- legal certification
- e-signature
- final submission

Do not create duplicate applications and do not submit without explicit founder approval.
