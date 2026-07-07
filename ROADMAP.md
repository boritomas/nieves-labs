# Nieves Labs Roadmap

## Completed

- Central product hub with product cards and working CTAs
- Product detail pages for every required product
- Stripe-ready checkout API and webhook validation
- Tokenized intake pages with file upload support
- Shared workflow engine: `runWorkflow(productKey, orderId)`
- Structured deliverable generation fallback
- Google Drive, Gmail, and Apps Script integration adapters
- Admin console for orders, products, payments, workflow status, errors, logs, needs review, and completed work
- Operations documentation and environment variable registry

## Production Readiness Remaining

- Configure production credentials in Vercel
- Replace local JSON store with durable managed database
- Configure persistent object storage for uploads
- Create Stripe products/prices and webhook endpoint
- Create Google OAuth refresh tokens and Drive root folder
- Validate Gmail sending limits and support mailbox
- Add production monitoring and alerting
