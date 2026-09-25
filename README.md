# Reliability Console

An independent React/TypeScript product-engineering sample by Yash Anand. It turns three expensive-to-ignore workflow risks into small, inspectable paid-pilot entries:

- **Marketplace releases:** listing validation, conditional shipping rules, draft recovery, and replayable release checks.
- **AI-agent runs:** tool policy, bounded recovery, evidence receipts, and a small evaluation handoff.
- **Offline operations:** queue receipts, retry identity, idempotency, and human-readable conflict handling.

**[Open the Netlify demo](https://yash-listing-flow-lab-0923.netlify.app)** · **[Open the GitHub Pages mirror](https://yashanand69.github.io/listing-flow-lab/)** · **[Read the source](https://github.com/YashAnand69/listing-flow-lab)**

The product is deliberately framed as a workflow reliability pilot, not a generic website service. A founder can choose a track, inspect evidence, mark findings as mitigated in the demo, and download a JSON pilot brief. The client supplies the real backlog ticket, codebase, data contract, and acceptance criteria.

## Why this is buyable

The first paid ticket is intentionally narrow: take one high-risk workflow, make failure modes visible, add deterministic fixtures and acceptance criteria, and hand the team a reviewable artifact. That is useful before a larger feature because it reduces uncertainty around support work, duplicate actions, and hard-to-reproduce regressions.

The three tracks map to public hiring or product signals:

| Track | Best-fit conversation | First ticket hypothesis |
| --- | --- | --- |
| Marketplace releases | Jawa-style marketplace engineering | A shared validator and release-fixture set around one seller-flow change. |
| AI-agent runs | AiMi or an AI product studio such as Prodinit | A run-review surface and bounded retry/evaluation fixtures around one agent workflow. |
| Offline operations | Rinse-style logistics or mobile operations | An idempotent queue receipt and conflict fixture for one field workflow. |

These are product hypotheses, not claims that a named company has a defect or needs this exact feature.

## Try it

1. Choose a buyer track.
2. Click a finding to mark it mitigated in the demo.
3. Download the pilot brief.
4. Choose **Marketplace releases** to use the original listing workbench and export its QA report.

Everything is synthetic. There are no integrations and nothing is published.

## Run locally

Requires Node.js 22 and npm.

```bash
npm ci
npm run dev
npm test
npm run build
```

No API keys are needed. GitHub Actions runs the tests and production build and publishes the GitHub Pages mirror.

## Implementation

- `src/reliability.ts`: buyer tracks, findings, run traces, and acceptance criteria.
- `src/model.ts`: pure marketplace validation model, draft parser, and synthetic release fixtures.
- `src/main.tsx`: interactive track console, marketplace workbench, and JSON exports.
- `src/model.test.ts`: model and buyer-track checks.
- `src/style.css`: original responsive styling; no client assets copied.

## Scope and handoff

The public console is a conversation starter. It does not claim client access, production deployment, or measured impact. A paid pilot begins with a team-selected backlog ticket and ends with a pull request, deterministic fixtures, acceptance notes, and a short handoff. The real codebase, schemas, telemetry, accessibility requirements, and review standards stay with the client team.
