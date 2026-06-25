# Codebase Cleanup Plan

This is a future cleanup plan only. Do not perform these refactors inside unrelated UI bug-fix tasks.

Large component refactor should not be mixed with active UI bug fixing.

## Phase 1

- Add and maintain README and developer docs.
- Document generated file rules.
- Keep build verification consistent.

## Phase 2

After the map UX stabilizes, split `LocaleListingsPage.tsx`:

- Extract listing card component.
- Extract listing panel component.
- Extract category rail component.
- Extract map shell component.
- Extract marker clustering logic.
- Extract TTC station label overlay logic.
- Extract filter and URL sync logic carefully.

## Phase 3

Split other large pages:

- Listing detail page.
- Landlord center pages.
- Reservation and checkout pages.
- Apply and checklist pages if they keep growing.

## Phase 4

- Clean up image assets.
- Remove unused files.
- Review performance.
- Review bundle size and map rendering cost.
- Revisit naming around `mockTtcOverlay.ts` if the generated TTC data remains production-like static data.
