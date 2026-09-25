import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AlertTriangle, ArrowDownToLine, ArrowRight, Check, CheckCircle2, CircleHelp, ClipboardCheck, FileCheck2, Layers3, RotateCcw, Save, ShieldCheck, X } from "lucide-react";
import { blankListing, restoreDraft, runScenarios, sampleListing, saveDraft, status, type Field, type Listing } from "./model.ts";
import { getTrack, reliabilityTracks, trackScore, type ReliabilityTrack, type TrackId } from "./reliability.ts";
import "./style.css";

const storageKey = "listing-flow-lab:v1";

type TrackConsoleProps = {
  track: ReliabilityTrack;
  resolved: Record<string, boolean>;
  onResolve: (id: string) => void;
  onReset: () => void;
};

function TrackConsole({ track, resolved, onResolve, onReset }: TrackConsoleProps) {
  const score = trackScore(track, resolved);
  const exportBrief = () => {
    const brief = {
      concept: "Workflow Reliability Console - independent product engineering sample",
      track: track.title,
      buyerHypothesis: track.buyer,
      targetOutcome: track.target,
      deliverable: track.deliverable,
      acceptanceCriteria: track.acceptance,
      findings: track.findings.map((finding) => ({ ...finding, status: resolved[finding.id] ? "mitigated-in-demo" : "open" })),
      caveat: "Synthetic data and a product hypothesis only. A production paid trial should be selected and scoped by the client team.",
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${track.id}-reliability-pilot-brief.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };

  return (
    <section className="track-console" id="track-console">
      <div className="track-console-head">
        <div><span className="section-kicker">{track.eyebrow}</span><h2>{track.title}</h2><p>{track.summary}</p></div>
        <div className={`score-card ${score.open === 0 ? "score-ready" : ""}`}><span>OPEN FINDINGS</span><strong>{score.open === 0 ? "READY" : score.open}</strong><small>{score.resolved}/{score.total} mitigated in this demo</small></div>
      </div>
      <div className="track-console-grid">
        <div className="panel track-panel"><div className="panel-head"><div><span className="panel-index">01 / RUN TRACE</span><h3>Where risk enters</h3></div><Layers3 size={21} className="track-icon" /></div><div className="trace-list">{track.steps.map((step) => <div className="trace-row" key={step.label}><span className={`trace-dot ${step.state}`} /> <span><strong>{step.label}</strong><small>{step.detail}</small></span><span className={`trace-state ${step.state}`}>{step.state === "pass" ? "PASS" : step.state === "watch" ? "WATCH" : "ACTION"}</span></div>)}</div></div>
        <div className="panel track-panel"><div className="panel-head"><div><span className="panel-index">02 / TICKET QUEUE</span><h3>Turn risk into work</h3></div><AlertTriangle size={21} className="track-warning" /></div><p className="checks-intro">These are deliberately bounded findings a client can confirm, reject, or turn into a paid first ticket.</p><div className="finding-list">{track.findings.map((finding) => <button type="button" key={finding.id} className={`finding ${resolved[finding.id] ? "resolved" : ""}`} onClick={() => onResolve(finding.id)}><span className={`finding-severity ${finding.severity}`} /> <span><strong>{finding.label}</strong><small>{resolved[finding.id] ? "Marked as mitigated in this demo" : finding.detail}</small><em>{finding.evidence}</em></span><span className="finding-action">{resolved[finding.id] ? <Check size={15} /> : <ArrowRight size={15} />}</span></button>)}</div><button type="button" className="export-button" onClick={exportBrief}><FileCheck2 size={16} /> Download pilot brief <ArrowRight size={15} /></button></div>
      </div>
      <div className="pilot-card"><div><span className="panel-index">03 / A BUYABLE FIRST TICKET</span><h3>{track.deliverable}</h3><p><strong>Target outcome:</strong> {track.target}. The demo is evidence of how the work could be approached, not a claim about a current client defect.</p></div><div className="acceptance"><span>Acceptance criteria</span>{track.acceptance.map((item) => <div key={item}><Check size={14} /> {item}</div>)}</div><button type="button" className="reset-button" onClick={onReset}><RotateCcw size={15} /> Reset findings</button></div>
    </section>
  );
}

function App() {
  const [listing, setListing] = useState<Listing>(() => restoreDraft(localStorage.getItem(storageKey)) ?? sampleListing);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<TrackId>("marketplace");
  const [resolvedFindings, setResolvedFindings] = useState<Record<string, boolean>>({});
  const result = useMemo(() => status(listing), [listing]);
  const checks = useMemo(runScenarios, []);
  const passed = checks.filter((check) => check.passed).length;
  const activeTrackDetails = getTrack(activeTrack);
  const activeScore = trackScore(activeTrackDetails, resolvedFindings);
  const activeReady = activeTrack === "marketplace" ? result.ready : activeScore.open === 0;

  useEffect(() => {
    localStorage.setItem(storageKey, saveDraft(listing));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, [listing]);

  const update = <K extends Field>(field: K, value: Listing[K]) => {
    setListing((current) => ({ ...current, [field]: value }));
    setSelectedScenario(null);
  };

  const loadScenario = (label: string, value: Listing) => {
    setListing(value);
    setSelectedScenario(label);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clear = () => {
    localStorage.removeItem(storageKey);
    setListing(blankListing);
    setSelectedScenario(null);
  };

  const exportReport = () => {
    const report = {
      concept: "Independent listing-flow QA work sample",
      generatedAt: new Date().toISOString(),
      syntheticDataOnly: true,
      currentDraft: listing,
      currentValidation: result,
      releaseChecks: checks.map(({ label, description, expectedReady, actualReady, passed, issues }) => ({ label, description, expectedReady, actualReady, passed, issues })),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `listing-flow-review-${Date.now()}.json`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };

  const selectTrack = (id: TrackId) => {
    setActiveTrack(id);
    setResolvedFindings({});
    window.setTimeout(() => document.getElementById(id === "marketplace" ? "workbench" : "track-console")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const input = (field: Extract<Field, "title" | "price" | "quantity" | "photoCount" | "minimumOffer" | "weight" | "length" | "width" | "height">, label: string, placeholder: string, type = "text") => (
    <label className={`field ${result.issues[field] ? "field-error" : ""}`}>
      <span className="field-label">{label}</span>
      <input value={listing[field]} type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "any" : undefined}
        placeholder={placeholder} aria-invalid={Boolean(result.issues[field])} aria-describedby={result.issues[field] ? `${field}-error` : undefined}
        onChange={(event) => update(field, event.target.value)} />
      {result.issues[field] && <span className="field-hint" id={`${field}-error`}>{result.issues[field]}</span>}
    </label>
  );

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><ClipboardCheck size={19} strokeWidth={2.3} /></span><span>RELIABILITY<span className="brand-accent">/</span><span className="brand-light">CONSOLE</span></span></div>
        <a className="source-link" href="https://github.com/YashAnand69" target="_blank" rel="noreferrer">Yash Anand <ArrowRight size={15} /></a>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow"><span className="live-dot" /> WORKFLOW RELIABILITY CONSOLE <span className="eyebrow-line" /> REACT + TYPESCRIPT</div>
          <h1>Ship the risky path<br /><em>with proof.</em></h1>
          <p>A working product-engineering console for the moments teams postpone: invalid marketplace listings, opaque agent runs, and offline actions that can duplicate. Pick a buyer problem, inspect the evidence, and download a paid-pilot brief.</p>
          <div className="hero-actions"><a href="#tracks" className="primary-button">Choose a buyer problem <ArrowRight size={17} /></a><a href="#evidence" className="text-button">See the scope <ArrowRight size={16} /></a></div>
          <div className="hero-metrics"><span><strong>{reliabilityTracks.length}</strong> buyer tracks</span><span><strong>{passed}/{checks.length}</strong> listing checks pass</span><span><strong>{activeScore.total}</strong> findings in focus</span></div>
          <div className="hero-orbit" aria-hidden="true"><div className="orbit-card"><span>ACTIVE PILOT SIGNAL</span><strong>{activeReady ? "READY" : "REVIEW"}</strong><div><i /><i /><i /><i /><i /></div><small>{activeTrackDetails.title} · synthetic evidence</small></div></div>
        </section>

        <section className="tracks" id="tracks"><div className="section-intro"><div><span className="section-kicker">THE BUYER PROBLEMS</span><h2>One console. Three paid-entry points.</h2></div><p>Each track turns a vague reliability concern into a small, reviewable ticket with acceptance criteria. The client chooses the real codebase and scope.</p></div><div className="track-picker">{reliabilityTracks.map((track) => <button type="button" key={track.id} className={`track-card ${activeTrack === track.id ? "active" : ""}`} onClick={() => selectTrack(track.id)}><span className="track-card-top"><span>{track.eyebrow}</span>{activeTrack === track.id && <CheckCircle2 size={17} />}</span><h3>{track.title}</h3><p>{track.summary}</p><div className="track-card-bottom"><strong>{track.target}</strong><ArrowRight size={16} /></div></button>)}</div></section>

        {activeTrack === "marketplace" ? <section className="workbench" id="workbench">
          <div className="section-intro"><div><span className="section-kicker">THE WORKBENCH</span><h2>Draft, validate, replay.</h2></div><p>Change fields on the left. The publish gate and QA checks respond to the actual model on the right.</p></div>
          <div className="workbench-grid">
            <div className="form-column">
              <div className="panel panel-form">
                <div className="panel-head"><div><span className="panel-index">01 / DRAFT</span><h3>Listing details</h3></div><span className="save-pill"><Save size={13} /> Saved locally{savedAt ? ` · ${savedAt}` : ""}</span></div>
                <div className="two-col">
                  <label className="field"><span className="field-label">Category</span><select value={listing.category} onChange={(event) => update("category", event.target.value as Listing["category"])}><option>Gaming PC</option><option>GPU</option></select></label>
                  <label className="field"><span className="field-label">Condition</span><select value={listing.condition} onChange={(event) => update("condition", event.target.value as Listing["condition"])}><option>New in box</option><option>Open box</option><option>Used, like new</option><option>Used, good</option><option>For parts</option></select></label>
                </div>
                {input("title", "Listing title", "e.g. Custom Ryzen gaming PC with RTX graphics")}
                <div className="three-col">{input("price", "Price · USD", "775", "number")}{input("quantity", "Quantity", "1", "number")}{input("photoCount", "Photo count", "5", "number")}</div>
                <div className="divider" />
                <label className="toggle-row"><span><strong>Accept offers</strong><small>Set a minimum below your listing price.</small></span><input type="checkbox" checked={listing.offers} onChange={(event) => update("offers", event.target.checked)} /><span className="switch" /></label>
                {listing.offers && input("minimumOffer", "Minimum offer · USD", "650", "number")}
              </div>

              <div className="panel panel-form shipping-panel">
                <div className="panel-head"><div><span className="panel-index">02 / FULFILLMENT</span><h3>Shipping details</h3></div><span className="icon-bubble"><ShieldCheck size={19} /></span></div>
                <div className="choice-grid"><button type="button" className={`choice ${listing.shipping === "platform" ? "selected" : ""}`} onClick={() => update("shipping", "platform")}><span className="choice-radio" /><strong>Platform label</strong><small>Dimensions needed for a label quote</small></button><button type="button" className={`choice ${listing.shipping === "own" ? "selected" : ""}`} onClick={() => update("shipping", "own")}><span className="choice-radio" /><strong>My own label</strong><small>No platform-label dimensions required</small></button></div>
                {listing.shipping === "platform" && <div className="dimensions"><div className="dimensions-title">Package dimensions <span>Public sample limits: 150 lb · 107 in length</span></div><div className="four-col">{input("weight", "Weight · lb", "24", "number")}{input("length", "Length · in", "22", "number")}{input("width", "Width · in", "20", "number")}{input("height", "Height · in", "12", "number")}</div></div>}
              </div>
              <button type="button" className="reset-button" onClick={clear}><RotateCcw size={15} /> Clear local draft</button>
            </div>

            <aside className="review-column">
              <div className={`gate-card ${result.ready ? "gate-ready" : "gate-blocked"}`}><div className="gate-top"><span className="panel-index">LIVE PUBLISH GATE</span>{result.ready ? <CheckCircle2 size={23} /> : <CircleHelp size={23} />}</div><h3>{result.ready ? "Ready to review" : "Needs attention"}</h3><p>{result.ready ? "The sample listing passes every rule in this bounded model. No real listing is published." : `${result.count} field${result.count === 1 ? "" : "s"} ${result.count === 1 ? "needs" : "need"} an update before this sample is ready.`}</p><div className="gate-footer"><span>{selectedScenario ? `Loaded: ${selectedScenario}` : "Current draft"}</span><strong>{result.ready ? "PASS" : `${result.count} ${result.count === 1 ? "ISSUE" : "ISSUES"}`}</strong></div></div>
              <div className="panel checks-panel"><div className="panel-head"><div><span className="panel-index">03 / RELEASE CHECKS</span><h3>Edge-case matrix</h3></div><span className="checks-count">{passed}/{checks.length} pass</span></div><p className="checks-intro">These expectations exercise the same validation function as the live draft. Select a row to load its synthetic fixture.</p><div className="scenario-list">{checks.map((check) => <button type="button" key={check.label} className={`scenario ${selectedScenario === check.label ? "active" : ""}`} onClick={() => loadScenario(check.label, check.listing)}><span className={`scenario-icon ${check.passed ? "ok" : "bad"}`}>{check.passed ? <Check size={14} /> : <X size={14} />}</span><span><strong>{check.label}</strong><small>{check.description}</small></span><ArrowRight className="scenario-arrow" size={16} /></button>)}</div><button type="button" className="export-button" onClick={exportReport}><ArrowDownToLine size={16} /> Export current QA report <ArrowRight size={15} /></button></div>
              <div className="note-card"><span className="note-line" /><strong>What the demo proves</strong><p>Deterministic checks, conditional requirements, versioned browser draft storage, replayable fixtures, and an inspectable report. It does not test a real marketplace or predict conversion.</p></div>
            </aside>
          </div>
        </section> : <TrackConsole track={activeTrackDetails} resolved={resolvedFindings} onResolve={(id) => setResolvedFindings((current) => ({ ...current, [id]: !current[id] }))} onReset={() => setResolvedFindings({})} />}

        <section className="evidence" id="evidence"><div><span className="section-kicker">SCOPE & EVIDENCE</span><h2>Built to be examined.</h2></div><div className="evidence-grid"><article><span>01</span><h3>Public field model</h3><p>The field names and sample shipping limits reflect the publicly visible seller form. This is an independent simplification, not an official product or parity claim.</p><a href="https://www.jawa.gg/sell" target="_blank" rel="noreferrer">View public flow <ArrowRight size={14} /></a></article><article><span>02</span><h3>Real validation logic</h3><p>The form, live publish gate, and scenario matrix call one TypeScript validation function. The five fixtures include boundary and conditional cases.</p><a href="https://github.com/YashAnand69" target="_blank" rel="noreferrer">Yash’s GitHub <ArrowRight size={14} /></a></article><article><span>03</span><h3>Honest handoff</h3><p>A real paid trial should use a team-selected backlog ticket and their own codebase, data contracts, analytics, and review standards.</p><a href="mailto:yashisreallyawesome@gmail.com?subject=Listing%20flow%20paid%20trial">Discuss a scoped trial <ArrowRight size={14} /></a></article></div></section>
      </main>
      <footer><span>RELIABILITY/CONSOLE · Independent concept by Yash Anand</span><span>No affiliation or endorsement by any company. Synthetic data only.</span></footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
