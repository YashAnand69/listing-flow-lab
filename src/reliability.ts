export type TrackId = "marketplace" | "agent" | "offline";

export type ReliabilityFinding = {
  id: string;
  label: string;
  detail: string;
  severity: "high" | "medium" | "low";
  evidence: string;
};

export type ReliabilityTrack = {
  id: TrackId;
  eyebrow: string;
  title: string;
  summary: string;
  buyer: string;
  target: string;
  deliverable: string;
  steps: Array<{ label: string; detail: string; state: "pass" | "watch" | "action" }>;
  findings: ReliabilityFinding[];
  acceptance: string[];
};

export const reliabilityTracks: ReliabilityTrack[] = [
  {
    id: "marketplace",
    eyebrow: "MARKETPLACE RELEASES",
    title: "Listing Flow Lab",
    summary: "Protect a seller journey while the team is changing pricing, offers, photos, and shipping rules.",
    buyer: "Jawa-style marketplace teams",
    target: "Fewer invalid listings reaching review",
    deliverable: "A shared validator, replayable edge-case fixtures, and a release handoff report.",
    steps: [
      { label: "Schema contract", detail: "Listing fields are present and typed", state: "pass" },
      { label: "Conditional rules", detail: "Shipping requirements follow the selected label path", state: "pass" },
      { label: "Boundary fixtures", detail: "Offer and parcel limits are exercised", state: "watch" },
      { label: "Release handoff", detail: "A reviewer can export evidence with the change", state: "pass" },
    ],
    findings: [
      { id: "listing-boundary", label: "Boundary cases need a named owner", detail: "The fixture catches the limit, but a production ticket still needs the owner and acceptance threshold.", severity: "medium", evidence: "Oversized parcel fixture" },
      { id: "listing-telemetry", label: "Connect the gate to product telemetry", detail: "Instrument the real publish path so the team can see which rule blocks sellers most often.", severity: "low", evidence: "Synthetic-only demo" },
    ],
    acceptance: ["Every required field has a deterministic rule", "Five representative fixtures run in CI", "A JSON report is attached to the pull request"],
  },
  {
    id: "agent",
    eyebrow: "AGENT RELIABILITY",
    title: "Agent Run Review",
    summary: "Make an AI workflow inspectable when a tool call times out, returns an unsafe action, or needs a human.",
    buyer: "AiMi and AI product studios",
    target: "Catch silent agent failures before they become customer work",
    deliverable: "A run timeline, deterministic policy checks, and a small eval set the team can extend.",
    steps: [
      { label: "Input contract", detail: "The run has a versioned task and expected output", state: "pass" },
      { label: "Tool policy", detail: "External actions are checked before execution", state: "watch" },
      { label: "Recovery path", detail: "Timeouts have a bounded retry or human handoff", state: "action" },
      { label: "Evidence receipt", detail: "Every decision can be reviewed after the run", state: "pass" },
    ],
    findings: [
      { id: "agent-allowlist", label: "External action lacks an explicit allowlist", detail: "The run should show which connector and operation were permitted before a side effect is attempted.", severity: "high", evidence: "Synthetic tool-call trace" },
      { id: "agent-retry", label: "Timeout recovery needs a bounded policy", detail: "A retry should record its attempt number and stop before duplicate work becomes possible.", severity: "medium", evidence: "Synthetic timeout fixture" },
    ],
    acceptance: ["A failed tool call is visible with its reason", "Retries cannot exceed a declared limit", "A human handoff contains enough context to continue"],
  },
  {
    id: "offline",
    eyebrow: "OFFLINE OPERATIONS",
    title: "Sync Safety Console",
    summary: "Keep a mobile or operator workflow correct when connectivity disappears and the same action is retried.",
    buyer: "Rinse-style logistics and field teams",
    target: "Prevent duplicate actions and invisible sync loss",
    deliverable: "A queue receipt, idempotency checks, and conflict fixtures for one critical workflow.",
    steps: [
      { label: "Queue receipt", detail: "The action is durable before the screen moves on", state: "pass" },
      { label: "Retry identity", detail: "A repeated tap keeps the same operation key", state: "watch" },
      { label: "Conflict rule", detail: "The user sees what happens when server state changed", state: "action" },
      { label: "Sync audit", detail: "The final receipt is visible to an operator", state: "pass" },
    ],
    findings: [
      { id: "offline-idempotency", label: "Retry identity must survive reload", detail: "Without a stable operation key, a dropped connection can create a duplicate dispatch or status change.", severity: "high", evidence: "Synthetic double-submit fixture" },
      { id: "offline-conflict", label: "Conflict needs a human-readable resolution", detail: "A queue can be technically correct and still leave an operator unsure which state won.", severity: "medium", evidence: "Synthetic stale-record fixture" },
    ],
    acceptance: ["A queued action survives a refresh", "Duplicate submissions collapse to one operation", "Conflicts show the server and local state side by side"],
  },
];

export function getTrack(id: TrackId) {
  return reliabilityTracks.find((track) => track.id === id) ?? reliabilityTracks[0];
}

export function trackScore(track: ReliabilityTrack, resolved: Record<string, boolean>) {
  const open = track.findings.filter((finding) => !resolved[finding.id]).length;
  return { open, resolved: track.findings.length - open, total: track.findings.length };
}
