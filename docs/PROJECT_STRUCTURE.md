# Project Structure

## `src/routes`

TanStack Router file routes belong here. Most localized routes are thin wrappers that load page components from `src/components/pages`.

Important files:

- `src/routes/__root.tsx`
- `src/routes/ko.index.tsx`
- `src/routes/en.index.tsx`
- `src/routes/fr.index.tsx`
- `src/routes/ko.listings.tsx`
- `src/routes/en.listings.tsx`
- `src/routes/fr.listings.tsx`

Do not place large UI implementations here. Keep route files small unless route-specific loading or validation is needed.

## `src/components/pages`

Full page-level implementations belong here. This is where most product UI currently lives.

Important files:

- `LocaleMainPage.tsx`
- `LocaleListingsPage.tsx`
- `LocaleListingDetailPage.tsx`
- `LocaleReservationCheckoutPage.tsx`
- `LocaleLandlordCenterPage.tsx`

Do not place reusable low-level UI primitives here. Move shared primitives to `src/components/ui` or small feature components when refactoring.

## `src/components/layout`

Shared layout components belong here.

Important files:

- `Header.tsx`
- `Footer.tsx`
- `Container.tsx`
- `Logo.tsx`
- `LanguageSwitcher.tsx`

Do not place page-specific product flows here.

## `src/components/ui`

Reusable UI primitives and shadcn/Radix-style components belong here.

Important files:

- `button.tsx`
- `dialog.tsx`
- `drawer.tsx`
- `select.tsx`
- `listing-image-frame.tsx`

Do not place business logic or page-specific mock data here.

## `src/lib`

Shared helpers, static data, mock data, generated data, and integration helpers belong here.

Important files:

- `i18n.ts`
- `i18n-content.ts`
- `mockListingRooms.ts`
- `mockListingImages.ts`
- `mockInquiryStorage.ts`
- `googleMapsLoader.ts`
- `ttcRapidTransitOverlay.generated.ts`
- `stationRecommendationData.ts`

Do not place React page components here. Keep generated data clearly marked.

## `public`

Static assets belong here.

Important folders:

- `public/brand`
- `public/hero`
- `public/home`
- `public/listings`
- `public/mock`
- `public/payment-logos`

Do not place source code or secrets here. Anything in `public` can be served to the browser.

## `tools/ttc`

TTC GTFS source data and generation scripts belong here.

Important files:

- `tools/ttc/generate-ttc-rapid-overlay.cjs`
- `tools/ttc/ttc-gtfs.zip`
- `tools/ttc/gtfs/`

The raw GTFS zip and expanded folder are local source inputs and should not be committed.

## `docs`

Developer documentation belongs here.

Important files:

- `DEVELOPER_HANDOFF.md`
- `PROJECT_STRUCTURE.md`
- `LISTINGS_MAP.md`
- `TTC_GTFS_OVERLAY.md`
- `CODEBASE_CLEANUP_PLAN.md`

Do not put product copy or runtime configuration here.

## Where To Add Future Code

- Listing card UI: extract from `LocaleListingsPage.tsx` into a feature component under `src/components/pages` or a future `src/components/listings` folder.
- Listing map layer: extract from `LocaleListingsPage.tsx` after map UX stabilizes.
- TTC overlay logic: keep source generation in `tools/ttc`; keep generated app data in `src/lib/ttcRapidTransitOverlay.generated.ts`.
- Mock listing data: keep in `src/lib` until a real data layer is introduced.
- i18n strings: use `src/lib/i18n.ts` and related i18n content files.
- Route files: add new TanStack route files in `src/routes`; do not manually edit `src/routeTree.gen.ts`.
- Static images: add to `public` using clear feature folders.
