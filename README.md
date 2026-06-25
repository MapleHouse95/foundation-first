# MapleHouse

MapleHouse is a trust-based housing search, inquiry, and reservation MVP for Korean users preparing to live abroad, currently focused on Toronto.

## Tech Stack

- Vite
- React
- TypeScript
- TanStack Router
- Tailwind CSS / shadcn-style UI / Radix UI
- Google Maps JavaScript API
- TTC GTFS-derived static overlay data
- Bun

## Local Development

Install dependencies:

```powershell
bun install
```

Start the dev server:

```powershell
bun run dev
```

Expected local URLs:

- http://localhost:8080/ko
- http://localhost:8080/ko/listings

If another local port is used by Vite, open the URL printed by the terminal.

## Environment Variables

Required:

```text
VITE_GOOGLE_MAPS_API_KEY
```

Put local values in `.env.local`. Do not commit `.env.local`, and do not print API keys in logs, screenshots, commits, or chat messages.

## Google Maps API

The app uses the Google Maps JavaScript API. The API key should be restricted to local development origins or production domains as appropriate.

## Important Commands

Run these before and after meaningful changes:

```powershell
git branch --show-current
git status --short
git diff --stat
git diff --check
bunx tsc --noEmit
bun run build
```

## Branch And Safety Rules

- Work on `codex/homepage-gateway-working` unless told otherwise.
- Do not commit unless the user explicitly asks.
- Do not push.
- Do not deploy.
- Do not manually edit `src/routeTree.gen.ts`.
- Do not commit `.env.local`.
- Do not print API keys.

## Main Route Overview

- `/ko`, `/en`, `/fr`: localized home pages.
- `/ko/listings`, `/en/listings`, `/fr/listings`: localized listing search and map pages.
- `/ko/listings/$listingId`, `/en/listings/$listingId`, `/fr/listings/$listingId`: listing detail routes.
- `/ko/reservations/new`, `/en/reservations/new`, `/fr/reservations/new`: reservation request start routes.
- `/ko/reservations/checkout`, `/en/reservations/checkout`, `/fr/reservations/checkout`: checkout request routes.
- `/ko/reservations/complete`, `/en/reservations/complete`, `/fr/reservations/complete`: reservation request completion routes.
- `/ko/landlords/center`, `/en/landlords/center`, `/fr/landlords/center`: landlord center routes.

## Current MVP Data

Current product data is static and local for product demonstration. Keep user-facing copy polished and product-like. Do not add user-facing words such as "mock", "MVP", or "prototype" unless the task explicitly asks for internal/admin-facing wording.

## Handoff Notes

New developers should read:

- [Developer Handoff](docs/DEVELOPER_HANDOFF.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Listings Map](docs/LISTINGS_MAP.md)
- [TTC GTFS Overlay](docs/TTC_GTFS_OVERLAY.md)
- [Codebase Cleanup Plan](docs/CODEBASE_CLEANUP_PLAN.md)
