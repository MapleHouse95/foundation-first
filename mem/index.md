# Project Memory — MapleHouse MVP

## Core
MapleHouse is a responsive web service (desktop + mobile browsers). Never build native iOS/Android, App Store, or Play Store assets.
Customers and inquiries are SEPARATE entities (1 customer → many inquiries). Never merge them.
Never use a single generic `status` field. Use separate enums: consultationStatus, paymentStatus, refundStatus, contractDraftStatus, taskStatus.
Payments are MOCK/test-mode only. No real PG integration (Toss, KakaoPay, Stripe, PortOne, etc.). Always render a "TEST MODE" label on payment UI.
Contract drafts are internal admin draft + preview only. No e-signature, customer send, PDF export, or legal completion. Disable those buttons with "Not available in MVP".
Test prices (always labeled as test): Consultation deposit 10,000 KRW, Priority consultation pass 30,000 KRW, Pre-review fee 50,000 KRW. Keep them in one constants module.
Implement ONE small phase per request. Do not pre-build future phases. Preserve existing pages/components unless the current phase explicitly changes them.

## Memories
(none yet — add as phases introduce stable decisions)