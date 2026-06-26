# Developer Handoff

## Project Purpose

MapleHouse is a trust-based housing search, inquiry, and reservation MVP for Korean users preparing to live abroad. The current product direction is focused on Toronto housing discovery, listing detail review, inquiry flow, and reservation request flow.

## Current Primary Product Area

The most active product area is the `/listings` map search experience:

- `/ko/listings`
- `/en/listings`
- `/fr/listings`

This area combines filters, localized listing cards, Google Maps, listing count clusters, TTC rapid transit overlays, and a listing slide-over.

Current map rules:

- Listing count markers are blue circular bubbles with white numbers.
- TTC station labels use very soft pastel TTC line colors and include `Station`.
- Transfer stations with two active TTC line memberships use one soft center angled split station label without a visible divider line.
- The TTC route toggle is localized as `노선도` / `Lines` / `Lignes` and controls route lines, station dots, station labels, and TTC attribution together.
- The map has a compact roadmap / satellite / hybrid toggle and defaults to roadmap.
- Listing card bottom chips use white backgrounds with grey text and grey borders.
- The `/listings` left rail is a local view selector. It is separate from URL filters and uses the order All, Room / Share, Condo, House, Studio, Favorites, Guide.
- Listing favorites are local-only and use `localStorage` key `maplehouse:listings:favorites:v1`.

## Files To Read First

- `package.json`
- `src/router.tsx`
- `src/routes/__root.tsx`
- `src/components/pages/LocaleMainPage.tsx`
- `src/components/pages/LocaleListingsPage.tsx`
- `src/components/pages/LocaleListingDetailPage.tsx`
- `src/lib/i18n.ts`
- `src/lib/mockListingRooms.ts`
- `src/lib/googleMapsLoader.ts`
- `src/lib/ttcRapidTransitOverlay.generated.ts`
- `tools/ttc/generate-ttc-rapid-overlay.cjs`

## Known Large Files For Future Splitting

These files are currently large and should be split after the active UX work stabilizes:

- `src/components/pages/LocaleListingsPage.tsx`
- `src/components/pages/LocaleListingDetailPage.tsx`
- `src/components/pages/LocaleLandlordsPage.tsx`
- `src/components/pages/LocaleLandlordCenterPage.tsx`
- `src/components/pages/LocaleReservationCheckoutPage.tsx`
- `src/components/pages/LocaleApplyPage.tsx`
- `src/components/pages/LocaleChecklistPage.tsx`

Do not mix a large component refactor with active UI bug fixing.

## Current Risks

- Large page components make small changes harder to review.
- README was previously missing, so setup and safety rules were easy to lose.
- `src/lib/ttcRapidTransitOverlay.generated.ts` is large generated data.
- `src/lib/mockTtcOverlay.ts` may be confusing because it re-exports generated TTC data despite the `mock` name.
- Image assets may include duplicate `.png` and `.webp` versions.
- Root log files should not be kept.

## Current Development Rules

- Codex should not commit unless the user explicitly asks.
- Codex should not push.
- Do not manually edit `src/routeTree.gen.ts`.
- Do not expose API keys.
- Do not add backend, database, payment, or authentication unless explicitly requested.
- Do not add user-facing "MVP", "mock", or "prototype" wording.

## How To Verify A Change

Use browser verification for user-facing flows, then run:

```powershell
git diff --check
bunx tsc --noEmit
bun run build
```

Useful state checks:

```powershell
git branch --show-current
git status --short
git diff --stat
```

## What Not To Touch Casually

- `src/routeTree.gen.ts`
- `src/lib/ttcRapidTransitOverlay.generated.ts`
- `.env.local`
- Payment or reservation flow unless the task asks.
- Homepage unless the task asks.
- Listing map behavior unless the task asks.
