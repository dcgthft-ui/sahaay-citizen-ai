import React, { useState } from "react"; 
import { sanitizeText, isValidReport, generateTicketId } from "../lib/logic.js";
import { classifyIssue } from "../lib/ai.js"; 
import { PRIORITY_META } from "../data/catalog.js"; 
import { StatusTracker, PriorityPill, SourceNote } from "./StatusTracker.jsx"; 

export default function ReportIssue({ t, lang, onFiled }) {
  const [text, setText] = useState(""); 
  const [busy, setBusy] = useState(false); 
  const [result, setResult] = useState(null); 
  const [error, setError] = useState(""); 

  const submit = async (e) => { 
    e.preventDefault(); 
    if (!isValidReport(text)) { setError("Please describe the issue in a little more detail."); return; }
    setError(""); setBusy(true); setResult(null); 
    const ctrl = new AbortController(); 
    try { 
      const classified = await classifyIssue(text, lang, ctrl.signal); 
      const complaint = { 
        id: generateTicketId(), 
        text: sanitizeText(text, 400),
        ...classified, 
        step: 2, 
        filedAt: new Date().toLocaleString(), 
      }; 
      onFiled(complaint); 
      setResult(complaint); 
      setText(""); 
    } catch { 
      setError("Could not file the report. Please try again."); 
    } finally { 
      setBusy(false); 
    } 
  }; 

  return ( 
    <section aria-labelledby="report-h" className="panel"> 
      <h2 id="report-h">{t("report_title")}</h2>
      <p className="hint">{t("report_hint")}</p> 
      <form onSubmit={submit}> 
        <label htmlFor="report-input" className="field-label">{t("report_title")}</label>
        <textarea 
          id="report-input" className="text-area" rows={4} value={text} 
          onChange={(e) => setText(e.target.value)} placeholder={t("report_placeholder")} 
          maxLength={1000} aria-describedby={error ? "report-error" : undefined} 
        /> 
        {error && <p id="report-error" className="error" role="alert">{error}</p>} 
        <button type="submit" className="btn btn-primary" disabled={busy}> 
          {busy ? t("routing") : t("submit_report")}
        </button>
      </form> 
      {result && ( 
        <div className="result-card" role="status" aria-live="polite"> 
          <div className="result-head"> 
            <span className="ticket-badge">{t("ticket")}: {result.id}</span>
            <PriorityPill level={result.priority} /> 
          </div> 
          <dl className="kv"> 
            <div><dt>{t("department")}</dt><dd>{result.department}</dd></div> 
            <div><dt>{t("priority")}</dt><dd>{PRIORITY_META[result.priority].label}</dd></div> 
          </dl> 
          {result.suggestedAction && <p className="result-action">{result.suggestedAction}</p>}
          <StatusTracker step={result.step} /> 
          <SourceNote source={result.source} t={t} /> 
        </div> 
      )} 
    </section>
  ); 
}