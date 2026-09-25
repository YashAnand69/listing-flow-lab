# CellStrat pilot hypothesis

This is a tailored conversation starter for CellStrat, based on its public full-time contract role and public description of CellAssist. It is not a claim about an internal defect, architecture, or roadmap.

## Public signals

- The [official careers page](https://cellstrat.com/careers) lists a Frontend Engineer role in Bangalore or remote. An [indexed contract listing](https://wellfound.com/jobs/4307465-full-stack-ai-product-engineer-full-time-contract-role) describes React/Next.js, agentic workflows, evals, and AI observability, but its current availability is unconfirmed.
- CellStrat's [official company page](https://cellstrat.com/about) describes AI delivery across US and India.
- CellStrat's public [LinkedIn description](https://www.linkedin.com/company/cellstrat) describes CellAssist as a voice-first healthcare workflow product.

## Product hypothesis

When a voice or agent workflow moves from intake to a tool call and then to a human handoff, the team benefits from a small review surface that makes each decision, timeout, retry, and escalation inspectable. The public Reliability Console demonstrates this pattern with synthetic data only.

## Proposed first paid ticket

Build a narrow Agent Run Review slice around one client-selected workflow. It would include:

1. A typed run-event model for tool calls, outcomes, retries, and human handoffs.
2. Deterministic fixtures for a timeout, an unsafe action, and a successful escalation.
3. A lightweight React review surface with evidence receipts and a clear final state.
4. Acceptance criteria and a pull request the team can review and extend.

## Acceptance criteria

- The same fixture always produces the same visible run state.
- A timeout cannot silently appear as success.
- A retry or handoff is visible with its reason and evidence.
- The review surface works without exposing real patient data.
- The team receives a short handoff note with scope and out-of-scope decisions.

This is a proposed paid pilot, not an assumption that CellStrat needs this exact feature. The real scope should be selected from one current workflow and the team's codebase.
