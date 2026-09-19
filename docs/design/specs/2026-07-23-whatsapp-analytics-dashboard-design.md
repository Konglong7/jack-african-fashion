# WhatsApp Analytics Dashboard Design

## Goal

Turn the admin analytics area into a conversion-first dashboard that answers four questions quickly: how many people visited, how many viewed products, how many contacted WhatsApp, and which source or product produced those contacts.

## Layout

1. A compact lifetime strip shows estimated unique visitors, total page views, total WhatsApp clicks, and the date visitor tracking began.
2. Today's KPI row shows unique visitors, unique product viewers, unique WhatsApp visitors, and contact rate.
3. A conversion funnel shows visitors to product viewers to WhatsApp visitors. A seven-day bar chart shows unique WhatsApp visitors per day.
4. Ranked lists show the best WhatsApp sources and products for the last 30 days.
5. High-intent activity shows product views and WhatsApp clicks. The existing full visitor trail remains available in a collapsed details section.
6. The customer link generator remains visible below the conversion overview.

## Data Rules

- Lifetime visitors are estimated from the existing irreversible visitor ID. Legacy events without visitor IDs are excluded rather than guessed.
- `knownVisitors` stores only irreversible IDs and is not pruned with 30-day event details. `statsStartedAt` records when identifiable visitor statistics began.
- Product viewers are unique visitors with a `page_view` path beginning `/products/`.
- WhatsApp visitors are unique visitors with a `whatsapp_click` event. Contact rate is WhatsApp visitors divided by visitors for the selected period.
- UTM source and campaign are retained in `sessionStorage` for the current browser tab so a contact after product navigation keeps its original attribution. No cookies are added.
- Charts use CSS and existing data only. Empty datasets render zero states and never generate sample data.

## Compatibility

- Existing analytics JSON loads without migration commands. Current identifiable recent visitors seed `knownVisitors`; historical legacy events remain visible but do not affect unique counts.
- Existing `/api/analytics` payload and response remain compatible.
- Detailed visitor records remain capped at 5,000 and retained for 30 days. Lifetime page-view and WhatsApp totals remain unchanged.

## Verification

- Unit tests cover lifetime visitor seeding, new visitor counting, attribution inheritance, and empty data.
- Existing analytics tests continue to pass.
- Desktop and mobile screenshots verify that KPI blocks, bars, funnel rows, rankings, and activity rows do not overlap.

