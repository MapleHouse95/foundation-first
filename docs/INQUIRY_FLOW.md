# Inquiry Flow

MapleHouse inquiry management is currently a front-end operational flow backed by browser localStorage.

## Routes and Components

- Customer inquiry entry starts from listing list slide-over, listing detail inquiry actions, or room-specific inquiry actions.
- Direct landlord inquiry navigates to a dedicated listing-specific DM page. It does not use the old `/apply` direct form or a small modal.
- MapleHouse-assisted inquiry remains the structured `/ko/apply`, `/en/apply`, or `/fr/apply` request form.
- Direct landlord DM routes are `/ko/messages/listing/$listingId`, `/en/messages/listing/$listingId`, and `/fr/messages/listing/$listingId`. Room-specific DMs pass `roomId` as a search param.
- `/[locale]/apply?mode=direct&listingId=...` redirects/replaces to the dedicated direct landlord DM route for compatibility with older links.
- Customer inquiry history uses `/[locale]/my/inquiries` and `/[locale]/my/inquiries/$inquiryId`.
- Landlord inquiry management starts at `/[locale]/landlords/center/inquiries`.
- Listing-specific inquiry/DM management uses `/[locale]/landlords/center/inquiries/listing/$listingId`.
- Individual inquiry links such as `/[locale]/landlords/center/inquiries/$inquiryId` remain as deep-link/fallback pages.
- Shared customer and landlord inquiry screens live in `src/components/pages/InquiryFlowPages.tsx`.

## Shared Model

The shared `InquiryRecord` model lives in `src/lib/inquiryStore.ts`.

Resource identity is stable and data-driven:

- Listings resolve by `listingId`.
- Room-specific inquiries keep `roomId`.
- Submitted inquiries resolve by `inquiryId`.
- The same inquiry record is used across Korean, English, and French pages.
- Localized listing and room titles are resolved from `listingId` and `roomId` first; stored snapshots are fallback only.

Stable status values:

- `new`
- `reviewing`
- `answered`
- `reservation-review`
- `closed`

Records store listing and room snapshots so inquiry history remains readable if listing copy changes later.

Conversation modes:

- `direct-landlord-dm`: direct listing-specific landlord DM.
- `maplehouse-assisted`: structured MapleHouse-assisted request.

Older records using `direct` or `assisted` are normalized when read so the `maplehouse:inquiries:v1` storage key remains backward compatible.

Status is automated in the front-end store:

- A newly submitted inquiry starts as `new`.
- Opening an inquiry clears `landlordUnread`, `customerUnread`, or `tenantUnread` for the viewing side but does not mark it answered.
- A landlord reply appends a landlord message, sets `status = answered`, sets `customerUnread = true`, sets `tenantUnread = true`, and clears `landlordUnread`.
- A tenant follow-up appends a customer message, sets `status = new`, sets `landlordUnread = true`, and clears `customerUnread` and `tenantUnread`.
- Answered inquiries lazily auto-close after 7 days if there is no newer customer follow-up after the latest landlord reply.
- Lazy auto-close runs when inquiries are loaded and persists one `auto-closed` activity only once.

Capacity display uses maximum wording when the value comes from listing capacity:

- Korean: `최대 N명`
- English: `Up to N people`
- French: `Jusqu’à N personnes`

This is separate from the applicant's chosen party count.

Desired move-in date prefill follows this priority:

1. Detail-page explicitly selected desired move-in date
2. Listings/map move-in date filter
3. Valid `moveInDate=YYYY-MM-DD` route context
4. Empty value

The inquiry form always lets the customer edit the desired move-in date before submission.

Move-in date pickers are single-date pickers and must show one month at a time. They keep previous/next month arrows, but they must not show a two-month range layout because the user is selecting one desired arrival/move-in day.

## Persistence

Storage key:

```text
maplehouse:inquiries:v1
```

The repository gracefully falls back to an empty list if storage is missing or invalid. It uses one shared key across Korean, English, and French routes so language switching does not duplicate records.

After MapleHouse-assisted submission, completion routes prefer `/[locale]/apply/complete?inquiryId=...`. The completion screen resolves the inquiry from localStorage so refresh does not create another record. The older session completion payload remains a fallback for compatibility.

## Synchronization

The inquiry store dispatches a single custom change event after writes and also listens for browser `storage` events. This keeps customer inquiry pages and landlord inquiry pages aligned within the current browser session and across tabs where supported.

## Privacy Boundary

Landlord internal notes are stored on the inquiry record but are rendered only in landlord-facing screens. Customer inquiry pages display the conversation, status, listing summary, and customer-facing metadata, but never render the internal note.

## Direct Landlord DM

Direct landlord DM uses the same `InquiryRecord.messages` conversation model as landlord management. The tenant-facing UI is a full page, not a modal. It shows a sticky listing bar, listing thumbnail, localized listing title, selected room label when present, landlord profile card, wide message panel, empty prompt, and bottom composer.

Tenant messages render on the right and landlord messages render on the left. Labels must stay localized and clean: no raw author enum, no "side" labels, and no broken mojibake labels. Sending the first DM creates a persisted `direct-landlord-dm` thread immediately in localStorage. Follow-up tenant and landlord messages append to that same thread.

Opening the dedicated DM page does not create a pending landlord notification. A thread becomes pending only after a tenant message is sent.

There is no real-time backend yet; same-tab updates are immediate through the local store, and cross-tab updates use browser storage events where supported.

## Tenant Conversations

Tenant inquiry pages are conversation-oriented and show both direct landlord DMs and MapleHouse-assisted requests from the same `InquiryRecord` store. Direct landlord DM rows link to the dedicated `/[locale]/messages/listing/$listingId` page. Tenant follow-up messages are appended to the existing record and are not translated.

## Landlord Management

The landlord inbox route `/[locale]/landlords/center/inquiries` renders listing-level rows, not one card per inquiry. Each row represents one managed listing and summarizes all inquiries/DM threads for that listing.

Listing rows show a thumbnail, listing title, listed date, listing-level status, latest preview, and pending thread count. The high-level pending count is based on unique listing IDs with pending activity, not the number of messages or the number of inquiry threads.

The listing-specific page `/[locale]/landlords/center/inquiries/listing/$listingId` is the main management UI. It shows the listing summary, the inquiry/DM thread list for that listing, the selected conversation, landlord reply composer, internal memo, status pill, and activity context. Landlord-side conversations render from the landlord perspective, so landlord replies align right and tenant/customer messages align left.

The landlord can no longer manually change inquiry status from a dropdown. Status is displayed as a read-only pill and changes through the automated lifecycle.

Invalid or deleted inquiry IDs render a localized not-found state with a link back to the inbox.

## Return Behavior

When a MapleHouse-assisted inquiry starts from the listings slide-over, only the selected listing context is preserved. The inquiry-method dialog is closed before navigation to `/apply`, and returning from an abandoned form should reopen the listing summary without reopening the inquiry-method dialog.

Direct landlord DM navigates to the dedicated messages page. Browser Back should return to the previous listings or detail page without reopening the inquiry-method dialog.

## Future Backend Boundary

When the project moves beyond front-end persistence, `src/lib/inquiryStore.ts` is the migration boundary. Replace the repository functions with API-backed persistence while keeping the route/component contracts and stable status keys.
