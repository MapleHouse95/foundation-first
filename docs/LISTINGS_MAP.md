# Listings Map

## Supported Routes

- `/ko/listings`
- `/en/listings`
- `/fr/listings`

## Current Page Parts

- Top search and filter bar.
- Left category rail.
- Listing results panel.
- Google map panel.
- Roadmap / satellite / hybrid map type toggle.
- Listing count clusters.
- TTC rapid transit overlay, controlled by the localized `노선도` / `Lines` / `Lignes` toggle.
- Listing slide-over.

## Map Marker Rules

- Listing count markers use blue translucent circles.
- Count markers show a white number only.
- Do not show price labels on the map.
- Do not use orange listing count markers.
- Clusters should not overlap.
- Filtered listing count should equal the total count represented by visible clusters.
- Listing count markers should stay visually higher priority than TTC station labels.

## Station Label Rules

- Station labels are custom overlay labels.
- Do not rely on Google base map labels.
- Station labels use very soft pastel TTC line colors, not the blue listing marker color.
- Transfer stations with exactly two active line memberships use one center angled split pill label.
- Transfer station labels split by color only and do not use a visible white divider line.
- Transfer station labels should not use a harsh full corner-to-corner diagonal slash.
- Do not render separate labels for each side of a transfer station.
- Labels should use passenger-friendly station names.
- Platform and direction words must not appear.
- Labels should use a `Station` suffix in user-facing map overlay text.
- Bloor/Yonge route-specific stop names must be normalized into `Bloor-Yonge Station`.

Bad examples that should not appear:

- `Southbound`
- `Northbound`
- `Eastbound`
- `Westbound`
- `Platform`
- `Eastbound Platform`
- `Westbound Platform`

## Map Type Rules

- Default map type is `roadmap`.
- Users can switch to `satellite` or `hybrid` with the compact custom toggle.
- The selected map type may be persisted with `maplehouse:listingsMapType`.
- Listing count markers and TTC station labels must remain readable on all map types.

## TTC Route Toggle Rules

- Toggle label is localized as `노선도` in Korean, `Lines` in English, and `Lignes` in French.
- When ON, the custom TTC route lines, station dots, station labels, and TTC attribution are visible.
- When OFF, the custom TTC route lines, station dots, station labels, and TTC attribution are all hidden together.
- Listing count markers remain visible when the TTC route overlay is OFF.

## Listing Card Chip Rules

- Listing card bottom chips use a white background.
- Bottom chip text and borders should be grey, not orange.
- Keep bottom chips compact and limited to the existing max tag count.

## Scroll Behavior

- The listings page shell should not document-scroll.
- Only the left listing panel should scroll.
- The map should remain fixed inside the viewport.

## Verification Checklist

- Filters update the list and map.
- URL filters work.
- Zero-result state works.
- Card click opens the slide-over.
- Count `1` marker opens the slide-over.
- Count greater than `1` marker zooms or focuses the map.
- F5 refresh loads Google Maps.
- TTC overlay is visible when the route toggle is ON.
- TTC route lines, station dots, station labels, and attribution all disappear when the route toggle is OFF.
- Station labels use very soft pastel TTC line colors.
- Transfer station labels use a soft center angled split when two active line memberships exist.
- Transfer station labels do not show a separate white divider line.
- Station labels do not show platform or direction suffixes.
