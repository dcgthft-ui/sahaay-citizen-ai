import React, { useState, useMemo, useRef } from "react";
import { LANGS } from "./data/catalog.js";
import { makeT, advanceStatus } from "./lib/logic.js";
import Assistant from "./components/Assistant.jsx";
import ReportIssue from "./components/ReportIssue.jsx";
import TrackComplaints from "./components/TrackComplaints.jsx";
import FindServices from "./components/FindServices.jsx";
import SelfCheck from "./components/SelfCheck.jsx";

const TABS = [
  { id: "assistant", key: "nav_assistant" },
  { id: "report", key: "nav_report" },
  { id: "track", key: "nav_track" },
  { id: "services", key: "nav_services" },
  { id: "tests", key: "nav_tests" },
];

// One seeded complaint so the tracker is visible on first load.
const SEED = [{
  id: "SHY-DEMO-01",
  text: "Overflowing garbage bin near the bus stop for several days.",
  category: "Waste management", department: "Sanitation & Waste",
  priority: "medium", suggestedAction: "Forwarded to Sanitation & Waste for pickup.",
  step: 3, filedAt: "Earlier this week", source: "rule",
}];

export default function App() {
  const [tab, setTab] = useState("assistant");
  const [lang, setLang] = useState("en");
  const [complaints, setComplaints] = useState(SEED);
  const tabRefs = useRef({});
  const t = useMemo(() => makeT(lang), [lang]);

  const fileComplaint = (c) => setComplaints((prev) => [c, ...prev]);
  const advance = (id) =>
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, step: advanceStatus(c.step) } : c)));

  // Keyboard navigation for the tablist (Left/Right/Home/End).
  const onTabKey = (e, idx) => {
    const order = TABS.map((x) => x.id);
    let next = null;
    if (e.key === "ArrowRight") next = order[(idx + 1) % order.length];
    else if (e.key === "ArrowLeft") next = order[(idx - 1 + order.length) % order.length];
    else if (e.key === "Home") next = order[0];
    else if (e.key === "End") next = order[order.length - 1];
    if (next) { e.preventDefault(); setTab(next); tabRefs.current[next]?.focus(); }
  };

  return (
    <div className="sahaay" lang={lang}>
      <a href="#main" className="skip-link">Skip to content</a>

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">◈</span>
          <span className="brand-name">Sahaay</span>
          <span className="brand-tag">{t("tagline")}</span>
        </div>
        <label className="lang-select">
          <span className="sr-only">Language</span>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            {LANGS.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
          </select>
        </label>
      </header>

      <nav className="tabbar" role="tablist" aria-label="Sahaay sections">
        {TABS.map((tb, i) => (
          <button
            key={tb.id} role="tab" id={`tab-${tb.id}`}
            aria-selected={tab === tb.id} aria-controls={`panel-${tb.id}`}
            tabIndex={tab === tb.id ? 0 : -1}
            ref={(el) => (tabRefs.current[tb.id] = el)}
            className={`tab ${tab === tb.id ? "tab-active" : ""}`}
            onClick={() => setTab(tb.id)} onKeyDown={(e) => onTabKey(e, i)}
          >
            {t(tb.key)}
          </button>
        ))}
      </nav>

      <main id="main" className="main">
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === "assistant" && <Assistant t={t} lang={lang} />}
          {tab === "report" && <ReportIssue t={t} lang={lang} onFiled={fileComplaint} />}
          {tab === "track" && <TrackComplaints t={t} complaints={complaints} onAdvance={advance} />}
          {tab === "services" && <FindServices t={t} lang={lang} />}
          {tab === "tests" && <SelfCheck t={t} />}
        </div>
      </main>

      <footer className="foot">
        <p>Sahaay is a demonstration companion. Confirm details with the official department before you act.</p>
      </footer>
    </div>
  );
}
