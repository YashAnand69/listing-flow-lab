# Listing Flow Lab

An independent React/TypeScript work sample by Yash Anand. It models a small part of a marketplace listing workflow: validation before publish, draft recovery, and replayable release checks. It is **not** an official Jawa product, a connected integration, or evidence of a defect in Jawa's current listing flow.

**[Live interactive demo](https://yash-listing-flow-lab-0923.netlify.app)**

If the Netlify edge is temporarily unavailable in your region, use the
**[GitHub Pages mirror](https://yashanand69.github.io/listing-flow-lab/)**.

The concept was informed by [Jawa's public seller form](https://www.jawa.gg/sell), which exposes title, condition, price, offers, quantity, images, shipping labels, and parcel dimensions. Jawa's [September 2026 engineering post](https://news.ycombinator.com/item?id=49527374) mentions contract work and a TypeScript/Next.js marketplace stack. The real product opportunity here is a **hypothesis**: a robust pre-publish validation and draft-recovery test suite might be a useful small ticket during listing-flow changes. A genuine paid trial should be selected and scoped by Jawa's team.

## Try the demo

1. Load the sample listing. Its publish gate reads “Ready to review.”
2. Choose **Offer above price** or **Oversized parcel** in the edge-case matrix. The form and gate update from the same validation model.
3. Change a value, reload the page, and see the versioned local draft restored.
4. Select **Seller's own label**. Dimensions are not required in that conditional branch.
5. Export a QA report to inspect the current synthetic draft, rule results, and five release checks.

The app never publishes a listing or sends form data to a server. It uses synthetic item details. The photo field is a numeric test fixture, not an image uploader. The public shipping caps included here are a deliberately narrow sample; actual carrier quotes and seller policies require the marketplace's authoritative systems.

## Run locally

Requires Node.js 22 and npm.

```bash
npm ci
npm run dev
npm test
npm run build
```

The build emits a static `dist/` folder. No API keys are needed. Draft state is stored in this browser's `localStorage` under `listing-flow-lab:v1`; **Clear local draft** resets the sample.
GitHub Actions runs the tests and production build on every push and pull request.

## Implementation

- `src/model.ts`: pure validation function, versioned draft parser, and five synthetic release fixtures.
- `src/model.test.ts`: boundary, conditional, and draft-recovery checks.
- `src/main.tsx`: interactive React workbench and JSON report export.
- `src/style.css`: original responsive styling; no marketplace assets copied.

The demo tests only the local model. It does not compare old and new production flows, measure conversion, handle actual uploads, calculate shipping, guarantee buyer trust, or imply a gap in an existing product. A production task would need access to the real schemas, telemetry, accessibility requirements, QA environment, and acceptance criteria.
