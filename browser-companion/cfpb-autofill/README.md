# CFPB Online Autofill Companion

This Manifest V3 Chrome extension transfers a founder-approved dispute draft from the Nieves Labs Consumer Defense Lab into the official CFPB complaint website.

## One-time installation

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select this `browser-companion/cfpb-autofill` directory.
5. Reload the Consumer Defense Lab.
6. Confirm that **Browser companion: connected** appears.

## Per-complaint use

1. Complete the CFPB dispute intake in the founder portal.
2. Select **Fill CFPB Online**.
3. The official CFPB complaint page opens.
4. The extension fills fields it can reliably identify and carries the complaint narrative forward as the form changes screens.
5. The founder reviews every answer, completes any login, identity verification, evidence selection, CAPTCHA, or attestation, and controls final submission.

## Boundaries

- The CFPB does not publish a consumer complaint-submission API.
- The extension does not bypass authentication, CAPTCHA, identity verification, or truth attestations.
- It does not click the final submit control.
- It stores the current draft only in local Chrome extension storage.
- CFPB form changes may require selector maintenance.
