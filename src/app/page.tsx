"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Copy,
  FileText,
  FlaskConical,
  Lightbulb,
  Menu,
  PanelsTopLeft,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type Section = "overview" | "lab" | "guide" | "checklist" | "library";

const navItems = [
  { id: "overview" as const, label: "Project Overview", icon: PanelsTopLeft },
  { id: "lab" as const, label: "AI Workflow Lab", icon: FlaskConical },
  { id: "guide" as const, label: "Quick Start Guide", icon: BookOpen },
  { id: "checklist" as const, label: "Responsible AI Checklist", icon: ShieldCheck },
  { id: "library" as const, label: "Prompt Library", icon: FileText },
];

const capabilities = [
  ["01", "AI Enablement", "Helping non-technical users understand practical and responsible ways to work with generative AI."],
  ["02", "Workflow Testing", "Comparing initial and refined approaches to understand how instruction quality affects usefulness and risk."],
  ["03", "Prompt Iteration", "Identifying missing context, constraints, audience, and output requirements and refining instructions accordingly."],
  ["04", "Output Evaluation", "Assessing clarity, relevance, instruction adherence, unsupported assumptions, and need for human review."],
  ["05", "Documentation & Training", "Creating quick-reference guidance, reusable examples, checklists, and documented lessons learned."],
  ["06", "Responsible AI Adoption", "Reinforcing confidentiality awareness, verification, approved-tool usage, professional accountability, and human oversight."],
];

const workflows = [
  {
    id: "email",
    short: "Client email",
    title: "Draft a professional client email",
    icon: "01",
    original: "Write an email to the client about the delay.",
    initial:
      "Hi,\n\nWe wanted to let you know that the project has been delayed due to unforeseen circumstances. We apologize for the inconvenience and will keep you updated.\n\nBest,\nThe Team",
    issues: [
      "No new timeline, owner, or next step is provided",
      "The audience and relationship are unclear",
      "“Unforeseen circumstances” is an unsupported assumption",
      "The requested tone and length are not defined",
    ],
    improved:
      "Draft a concise email to Jordan Lee, operations director at fictional client Northstar Works. Explain that the process review will arrive Thursday instead of Tuesday because our internal quality review needs two more days. Acknowledge the impact, confirm that the Friday discussion remains scheduled, and invite questions. Use a calm, accountable tone. Do not speculate or make commitments beyond these facts. Limit to 130 words and include a subject line.",
    output: {
      subject: "Updated timing for the process review",
      body: "Jordan,\n\nI’m writing to confirm that we will deliver the process review on Thursday, rather than Tuesday. Our internal quality review requires two additional days to complete. I recognize that this adjustment may affect your planning, and I appreciate your flexibility.\n\nOur discussion remains scheduled for Friday, so your team will still have the review in advance. Please let me know if this change creates a specific concern we should address before then.\n\nBest,\nMorgan",
    },
    scores: [
      ["Clarity", 2, 5],
      ["Relevance", 2, 5],
      ["Instruction adherence", 3, 5],
      ["Assumption risk", 4, 1],
      ["Human review needed", 5, 3],
    ],
  },
  {
    id: "summary",
    short: "Document summary",
    title: "Summarize a business document",
    icon: "02",
    original: "Summarize this report for me.",
    initial:
      "The report discusses the company’s performance, current market conditions, and several recommendations. Overall, the business is performing well, though some areas need improvement. Leadership should focus on growth opportunities and operational efficiency.",
    issues: [
      "The intended reader and decision are not specified",
      "The summary is generic and omits evidence",
      "“Performing well” is not grounded in a cited fact",
      "No length, structure, or source-boundary is defined",
    ],
    improved:
      "Summarize the attached fictional quarterly operations report for the executive committee. In 5 bullets, cover: performance against targets, two material risks, key operational changes, and decisions needed this month. Use only information in the report; label missing information as ‘not stated.’ Include section references after each bullet. Keep the summary under 180 words and avoid recommendations not present in the source.",
    output: {
      subject: "Executive summary — Q3 operations",
      body: "• Service response time improved 12% quarter over quarter, but remains 4% below target. [§2.1]\n• Vendor onboarding exceeded the 10-day target by an average of 3 days. [§3.2]\n• Material risks: single-vendor dependency and a forecast staffing gap in November. [§4.1–4.2]\n• The team introduced a weekly capacity review across three regions. [§3.4]\n• Decision needed: approve or defer the proposed backup-vendor assessment by September 15. Budget impact: not stated. [§5.1]",
    },
    scores: [
      ["Clarity", 1, 5],
      ["Relevance", 2, 5],
      ["Instruction adherence", 2, 5],
      ["Assumption risk", 5, 1],
      ["Human review needed", 5, 3],
    ],
  },
  {
    id: "actions",
    short: "Action items",
    title: "Convert meeting notes into action items",
    icon: "03",
    original: "Turn these meeting notes into action items.",
    initial:
      "1. Update the project plan.\n2. Contact the vendor.\n3. Schedule a follow-up meeting.\n4. Review the budget.\n5. Share the final materials.",
    issues: [
      "Owners and due dates are missing",
      "Tentative ideas may be presented as commitments",
      "There is no treatment for unclear or conflicting notes",
      "The desired format is not specified",
    ],
    improved:
      "Using only the fictional meeting notes, extract confirmed action items into a table with Action, Owner, Due date, and Source note. Do not convert suggestions into commitments. If an owner or date is absent, write ‘Unassigned’ or ‘Not set.’ After the table, list open questions separately. Preserve names and dates exactly as written. Do not infer responsibility.",
    output: {
      subject: "Confirmed actions",
      body: "ACTION | OWNER | DUE\nRevise implementation plan | Priya | Aug 28\nSend vendor security questions | Unassigned | Not set\nCirculate approved training outline | Mateo | Aug 30\n\nOPEN QUESTIONS\n• Who owns vendor follow-up?\n• Is the September 3 check-in confirmed?",
    },
    scores: [
      ["Clarity", 2, 5],
      ["Relevance", 3, 5],
      ["Instruction adherence", 2, 5],
      ["Assumption risk", 4, 1],
      ["Human review needed", 5, 3],
    ],
  },
];

const checklistItems = [
  ["Sensitive information", "I removed confidential, personal, privileged, or sensitive information."],
  ["Approved tools", "I used an AI tool approved by my fictional organization."],
  ["Factual verification", "I checked names, dates, figures, quotations, and source references."],
  ["Fabrication check", "I looked for unsupported claims, invented details, and false confidence."],
  ["Human review", "A person with the right subject knowledge reviewed the output."],
  ["Tone & audience", "The content is appropriate for its intended reader and purpose."],
  ["Policies", "The use and output follow applicable organizational policies."],
  ["Accountability", "A responsible person—not the AI—owns the final decision and communication."],
];

const promptExamples = [
  { category: "Summarization", title: "Decision-focused summary", prompt: "Summarize [document] for [audience]. In 5 bullets, identify the main conclusion, supporting evidence, material risks, open questions, and decisions required. Use only the source. Cite page or section references. Mark anything missing as ‘not stated.’", why: "Defines the reader, decision context, evidence boundary, and a scannable format." },
  { category: "Email drafting", title: "Professional client update", prompt: "Draft a [length] email to [recipient and role] about [topic]. The objective is [outcome]. Include [key facts and next step]. Use a [tone] tone. Do not add facts or commitments. Provide a subject line.", why: "Separates facts from tone and makes the desired action explicit." },
  { category: "Action extraction", title: "Reliable action register", prompt: "Extract only confirmed actions from these meeting notes. Return a table with action, owner, due date, and source phrase. Use ‘unassigned’ or ‘not set’ when details are absent. List unresolved questions separately. Do not infer commitments.", why: "Prevents suggestions from becoming false assignments and preserves traceability." },
  { category: "Comparison", title: "Document comparison", prompt: "Compare Version A and Version B. List material changes by topic in a table: A wording, B wording, practical effect, and review needed. Do not interpret beyond the text. Quote the relevant section from each version.", why: "Creates a consistent comparison and distinguishes textual changes from interpretation." },
  { category: "Brainstorming", title: "Bounded idea generation", prompt: "Generate 8 ideas for [objective] for [audience], within [constraints]. Group ideas as low, medium, or high effort. State one benefit and one risk for each. These are options, not recommendations.", why: "Encourages variety while setting limits and avoiding false recommendations." },
  { category: "Rewriting", title: "Rewrite for clarity", prompt: "Rewrite the text for a non-specialist reader at approximately grade 8 level. Preserve all facts, qualifications, and defined terms. Shorten sentences and use active voice where accurate. Flag any sentence whose meaning is unclear rather than guessing.", why: "Improves readability without permitting silent changes to meaning." },
];

function SimulatedLabel() {
  return <span className="sim-label"><Sparkles size={11} /> Simulated example</span>;
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const workflow = workflows[activeWorkflow];

  const filteredPrompts = useMemo(() => promptExamples.filter((item) =>
    `${item.category} ${item.title}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const navigate = (section: Section) => {
    setActiveSection(section);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyPrompt = (title: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(title);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">A<span>I</span></div>
          <div><strong>Enterprise AI</strong><small>Enablement Lab</small></div>
        </div>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
        <div className="workspace-label">Learning workspace</div>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={activeSection === item.id ? "active" : ""} onClick={() => navigate(item.id)}><Icon size={18} /><span>{item.label}</span></button>;
          })}
        </nav>
        <div className="side-note">
          <div className="status-dot" />
          <div><strong>Demonstration environment</strong><span>Fictional data · No AI connection</span></div>
        </div>
        <div className="org-lockup"><span className="org-mark"><Image src="/assets/northvale-advisory-logo.png" alt="" fill sizes="32px" /></span><div><strong>Northvale Advisory</strong><small>Fictional organization</small></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
          <div className="breadcrumb"><span>Enablement Hub</span><ChevronDown size={14} /><strong>{navItems.find(i => i.id === activeSection)?.label}</strong></div>
          <div className="top-actions"><span className="version">Portfolio demo · v1.0</span><button className="avatar" onClick={() => navigate("overview")} aria-label="View project creator"><Image src="/assets/meet-desai.jpeg" alt="Meet Desai" fill sizes="31px" /></button></div>
        </header>

        <div className="content-wrap">
          {activeSection === "overview" && <OverviewSection navigate={navigate} />}
          {activeSection === "lab" && (
            <section className="page-section">
              <SectionHeading eyebrow="Prompt testing workspace" title="AI Workflow Lab" text="See how better instructions change the usefulness—and risk—of a simulated AI response." />
              <div className="task-tabs" role="tablist" aria-label="Select a workflow">
                {workflows.map((item, index) => <button role="tab" aria-selected={activeWorkflow === index} className={activeWorkflow === index ? "selected" : ""} key={item.id} onClick={() => setActiveWorkflow(index)}><span>{item.icon}</span><div><small>Workflow</small>{item.short}</div><CheckCircle2 size={18} /></button>)}
              </div>

              <div className="workflow-title"><div><span>Current test</span><h2>{workflow.title}</h2></div><div className="human-pill"><ShieldCheck size={15} /> Human review required</div></div>

              <div className="comparison-grid">
                <article className="comparison-column initial">
                  <div className="column-head"><span>1</span><div><small>Starting point</small><h3>Initial approach</h3></div></div>
                  <div className="content-block request"><label>Original request</label><p>“{workflow.original}”</p></div>
                  <div className="content-block output"><div className="block-title"><label>Initial AI output</label><SimulatedLabel /></div><p>{workflow.initial}</p></div>
                  <div className="content-block issues"><label>Issues identified</label><ul>{workflow.issues.map(issue => <li key={issue}><X size={14} />{issue}</li>)}</ul></div>
                </article>

                <article className="comparison-column improved">
                  <div className="column-head"><span>2</span><div><small>After refinement</small><h3>Improved approach</h3></div></div>
                  <div className="content-block prompt"><label>Improved prompt</label><p>{workflow.improved}</p><div className="prompt-tags"><span>Context</span><span>Audience</span><span>Constraints</span><span>Format</span></div></div>
                  <div className="content-block output good"><div className="block-title"><label>Improved AI output</label><SimulatedLabel /></div><strong>{workflow.output.subject}</strong><p>{workflow.output.body}</p></div>
                </article>
              </div>

              <article className="evaluation-card">
                <div className="evaluation-head"><div><span className="eyebrow">Side-by-side review</span><h2>Evaluation</h2></div><p>Scores are illustrative, not automated assessments.</p></div>
                <div className="score-table">
                  <div className="score-row labels"><strong>Criterion</strong><span>Initial</span><span>Improved</span></div>
                  {workflow.scores.map(([label, before, after]) => <div className="score-row" key={label}><strong>{label}</strong><span><i style={{ width: `${Number(before) * 20}%` }} className="before" /></span><b>{before}/5</b><span><i style={{ width: `${Number(after) * 20}%` }} className="after" /></span><b>{after}/5</b></div>)}
                </div>
                <div className="evaluation-note"><Lightbulb size={20} /><p><strong>Takeaway</strong> A stronger prompt improves consistency, but it does not make the output authoritative. Verify the facts, source, tone, and implications before use.</p></div>
              </article>
              <TestingPanel />
            </section>
          )}

          {activeSection === "guide" && <GuideSection onChecklist={() => navigate("checklist")} />}
          {activeSection === "checklist" && <ChecklistSection checked={checked} setChecked={setChecked} />}
          {activeSection === "library" && <LibrarySection query={query} setQuery={setQuery} filtered={filteredPrompts} copyPrompt={copyPrompt} copied={copied} />}
        </div>
        <footer><span>Enterprise AI Enablement Lab</span><p>Educational portfolio demonstration. Not legal, professional, or business advice.</p><span>Northvale Advisory · Fictional</span></footer>
      </main>
      {menuOpen && <button className="overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}

function OverviewSection({ navigate }: { navigate: (section: Section) => void }) {
  const challenges = [
    "Unclear instructions and inconsistent outputs",
    "Unsupported assumptions or fabricated information",
    "Uncertainty about appropriate AI use",
    "Confidentiality and sensitive-information concerns",
    "Difficulty verifying AI-generated work",
    "Lack of repeatable guidance and workflows",
  ];
  const approach = [
    "AI workflow testing",
    "Prompt refinement",
    "Output evaluation",
    "Reusable prompt examples",
    "User education",
    "Responsible AI safeguards",
    "Documentation of limitations and lessons learned",
    "Human review",
  ];

  return <section className="page-section overview-page">
    <div className="overview-hero">
      <div>
        <span className="eyebrow">Independent portfolio proof-of-work</span>
        <h1>Enterprise AI<br />Enablement Lab</h1>
        <p>A portfolio proof-of-work project exploring practical AI enablement, workflow testing, responsible adoption, and user education in a fictional professional-services environment.</p>
        <div className="hero-meta"><span>Created by <strong>Meet Desai</strong></span><i /><span>Fictional demonstration</span></div>
      </div>
      <aside className="overview-principle"><span>Project perspective</span><blockquote>“Here is how I think about and approach AI enablement problems.”</blockquote><p>This is an educational case study—not a production enterprise system or a claim of prior platform administration.</p></aside>
    </div>

    <div className="overview-intro-grid">
      <article>
        <span className="eyebrow">01 · Context</span><h2>The Problem</h2>
        <p>Generative AI can be powerful, but successful workplace adoption requires more than simply giving employees access to an AI tool. Non-technical users may face challenges such as:</p>
        <ul>{challenges.map(item => <li key={item}><X size={13} />{item}</li>)}</ul>
      </article>
      <article className="approach-card">
        <span className="eyebrow">02 · Method</span><h2>My Approach</h2>
        <p>This demonstration explores a practical enablement approach combining:</p>
        <div className="approach-list">{approach.map((item, index) => <span key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</span>)}</div>
      </article>
    </div>

    <div className="capabilities-section">
      <div className="overview-section-head"><div><span className="eyebrow">03 · Evidence</span><h2>What This Project Demonstrates</h2></div><p>Six connected capabilities shown through the working demonstration.</p></div>
      <div className="capability-grid">{capabilities.map(([number, title, text]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </div>

    <div className="overview-identity-grid">
      <article className="creator-card">
        <div className="creator-photo"><Image src="/assets/meet-desai.jpeg" alt="Meet Desai, project creator" fill sizes="(max-width: 600px) 100vw, 250px" priority /></div>
        <div><span className="eyebrow">Project Creator</span><h2>Meet Desai</h2><strong>AI Enablement <i /> Workflow Testing <i /> Responsible AI Adoption</strong><p>Built as an independent portfolio proof-of-work project to demonstrate a practical, user-focused approach to generative AI enablement in professional environments.</p></div>
      </article>
      <article className="scenario-card">
        <div className="scenario-logo"><Image src="/assets/northvale-advisory-logo.png" alt="Northvale Advisory logo" fill sizes="280px" /></div>
        <span className="eyebrow">Demonstration Environment</span><h2>A clearly fictional scenario</h2><p>Northvale Advisory is a fictional professional-services organization created solely for this portfolio demonstration. All names, business information, documents, AI outputs, scores, and scenarios shown in this project are fictional or simulated.</p><div className="offline-status"><span /><strong>No live AI model is connected to this demonstration.</strong></div>
      </article>
    </div>

    <div className="explore-panel">
      <div><span className="eyebrow">Explore the evidence</span><h2>See the approach in practice.</h2><p>Begin with a side-by-side workflow test, then review the supporting education and safeguards.</p></div>
      <button className="explore-primary" onClick={() => navigate("lab")}>Explore the AI Workflow Lab <ArrowRight size={17} /></button>
      <div className="explore-links"><button onClick={() => navigate("guide")}>Quick Start Guide</button><button onClick={() => navigate("checklist")}>Responsible AI Checklist</button><button onClick={() => navigate("library")}>Prompt Examples Library</button></div>
    </div>
  </section>;
}

function TestingPanel() {
  const steps = ["Test", "Identify issue", "Refine instruction", "Retest", "Document limitation", "Human review"];
  return <article className="testing-panel">
    <div className="testing-head"><div className="icon-box"><RefreshCw size={20} /></div><div><span className="eyebrow">Documentation panel</span><h2>Testing & Lessons Learned</h2></div></div>
    <div className="process-line">{steps.map((step, i) => <div key={step}><span>{i + 1}</span><strong>{step}</strong>{i < steps.length - 1 && <ArrowRight size={15} />}</div>)}</div>
    <div className="lessons-grid">
      <div><span className="worked"><Check size={13} /> What worked</span><p>Specific audience, source boundaries, and required structure produced a more useful draft.</p></div>
      <div><span className="failed"><X size={13} /> What did not</span><p>A broad request led to generic language and an invented explanation for the delay.</p></div>
      <div><span className="limited">!</span><p><strong>Remaining limitation</strong>The model cannot confirm whether the supplied facts are complete, current, or approved.</p></div>
      <div><span className="next"><ArrowRight size={13} /></span><p><strong>Recommended next step</strong>Validate facts with the project owner and complete a tone and policy review.</p></div>
    </div>
  </article>;
}

function GuideSection({ onChecklist }: { onChecklist: () => void }) {
  const cards = [
    ["01", "What generative AI is", "A tool that predicts and creates text or other content from patterns in data. It can produce fluent drafts, but it does not understand or verify information like a person does."],
    ["02", "Appropriate workplace uses", "Use it to create a first draft, organize supplied notes, explore ideas, simplify wording, or summarize non-sensitive material—when your organization permits it."],
    ["03", "Provide useful context", "State the objective, audience, facts, constraints, source material, tone, and output format. Say what the tool must not infer or include."],
    ["04", "Verify every output", "Check every name, date, number, quote, source, and conclusion. Plausible wording is not proof that information is accurate."],
    ["05", "Know when not to rely on AI", "Do not rely on AI for final professional judgment, high-impact decisions, urgent safety matters, or topics requiring current authoritative guidance."],
    ["06", "Escalate to a human", "Ask a manager or qualified specialist when the facts are uncertain, the issue is sensitive, policies are unclear, or an error could materially affect someone."],
  ];
  return <section className="page-section guide-page">
    <SectionHeading eyebrow="Practical foundations" title="AI Quick Start Guide" text="Six essentials for using generative AI thoughtfully in everyday professional work." />
    <div className="definition-banner"><div><Sparkles size={21} /></div><p><strong>Think “capable drafting assistant,” not “source of truth.”</strong> Generative AI can accelerate a task. You remain responsible for deciding whether the result is accurate, appropriate, and safe to use.</p></div>
    <div className="guide-grid">{cards.map(([n, title, text]) => <article key={n}><span>{n}</span><h2>{title}</h2><p>{text}</p></article>)}</div>
    <div className="do-dont-grid"><article><h2><CheckCircle2 /> Good starting tasks</h2><ul><li>Outline a non-sensitive internal update</li><li>Organize fictional or approved notes</li><li>Generate questions for human review</li><li>Rewrite supplied text for readability</li></ul></article><article><h2><ShieldCheck /> Pause and ask first</h2><ul><li>Sensitive or confidential information</li><li>Decisions affecting people or rights</li><li>Authoritative professional guidance</li><li>Unknown tool or policy status</li></ul></article></div>
    <button className="primary-action" onClick={onChecklist}>Review the responsible AI checklist <ArrowRight size={16} /></button>
  </section>;
}

function ChecklistSection({ checked, setChecked }: { checked: number[]; setChecked: (value: number[]) => void }) {
  const progress = Math.round((checked.length / checklistItems.length) * 100);
  const toggle = (index: number) => setChecked(checked.includes(index) ? checked.filter(i => i !== index) : [...checked, index]);
  return <section className="page-section checklist-page">
    <SectionHeading eyebrow="Pre-use review" title="Responsible AI Checklist" text="Use this practical review before relying on or sharing any AI-assisted work." />
    <div className="review-warning"><ShieldCheck size={24} /><p><strong>AI-generated content should be reviewed by a qualified human before it is relied upon or shared.</strong><span>This checklist supports good judgment; it does not replace organizational policy or professional review.</span></p></div>
    <div className="checklist-layout">
      <div className="checklist-card">
        <div className="checklist-card-head"><div><span className="eyebrow">Output readiness</span><h2>Complete all eight checks</h2></div><strong>{checked.length} / {checklistItems.length}</strong></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <div className="check-items">{checklistItems.map(([title, text], index) => <button key={title} className={checked.includes(index) ? "checked" : ""} onClick={() => toggle(index)}><span className="check-box">{checked.includes(index) && <Check size={16} />}</span><p><strong>{title}</strong>{text}</p></button>)}</div>
      </div>
      <aside className="readiness-card"><div className={`readiness-ring ${progress === 100 ? "complete" : ""}`} style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div><h2>{progress === 100 ? "Review complete" : "Review in progress"}</h2><p>{progress === 100 ? "All checks are marked. A qualified human still owns the final decision." : "Mark each item only after you have actively checked it."}</p>{checked.length > 0 && <button onClick={() => setChecked([])}>Reset checklist</button>}<div><ClipboardCheck size={18} /><span><strong>Local session only</strong>Your selections are not stored or shared.</span></div></aside>
    </div>
  </section>;
}

function LibrarySection({ query, setQuery, filtered, copyPrompt, copied }: { query: string; setQuery: (v: string) => void; filtered: typeof promptExamples; copyPrompt: (title: string, prompt: string) => void; copied: string | null }) {
  return <section className="page-section library-page">
    <SectionHeading eyebrow="Reusable patterns" title="Prompt Examples Library" text="Adapt these structures to your task. Replace brackets with approved, non-sensitive context." />
    <div className="library-toolbar"><div><Search size={17} /><input aria-label="Search prompt examples" placeholder="Search prompt examples" value={query} onChange={e => setQuery(e.target.value)} /></div><span>{filtered.length} examples</span></div>
    <div className="prompt-grid">{filtered.map((item, i) => <article className="prompt-card" key={item.title}>
      <div className="prompt-card-head"><span>{String(i + 1).padStart(2, "0")}</span><div><small>{item.category}</small><h2>{item.title}</h2></div></div>
      <div className="prompt-text"><p>{item.prompt}</p><button onClick={() => copyPrompt(item.title, item.prompt)} aria-label={`Copy ${item.title} prompt`}>{copied === item.title ? <Check size={16} /> : <Copy size={16} />}{copied === item.title ? "Copied" : "Copy"}</button></div>
      <div className="why"><Lightbulb size={17} /><p><strong>Why it works</strong>{item.why}</p></div>
    </article>)}</div>
    {filtered.length === 0 && <div className="empty-state"><Search /><h2>No examples found</h2><p>Try a broader term such as “email” or “summary.”</p></div>}
  </section>;
}
