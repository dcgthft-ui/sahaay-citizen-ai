import React, { useState } from "react"; 
import { LIFE_EVENTS } from "../data/catalog.js"; 
import { recommendServices } from "../lib/ai.js"; 
import { SourceNote } from "./StatusTracker.jsx"; 

export default function FindServices({ t, lang }) {
  const [selected, setSelected] = useState([]); 
  const [notes, setNotes] = useState(""); 
  const [busy, setBusy] = useState(false); 
  const [result, setResult] = useState(null); 

  const toggle = (id) => 
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])); 

  const submit = async (e) => { 
    e.preventDefault(); 
    setBusy(true); setResult(null); 
    const ctrl = new AbortController(); 
    try { 
      const res = await recommendServices({ events: selected, text: notes }, lang, ctrl.signal); 
      setResult(res); 
    } finally { 
      setBusy(false); 
    } 
  }; 

  return ( 
    <section aria-labelledby="services-h" className="panel"> 
      <h2 id="services-h">{t("services_title")}</h2>
      <p className="hint">{t("services_hint")}</p> 
      <form onSubmit={submit}> 
        <fieldset className="fieldset"> 
          <legend>{t("situation")}</legend>
          <div className="event-grid"> 
            {LIFE_EVENTS.map((ev) => ( 
              <label key={ev.id} className={`event-opt ${selected.includes(ev.id) ? "on" : ""}`}> 
                <input type="checkbox" checked={selected.includes(ev.id)} onChange={() => toggle(ev.id)} /> 
                <span>{ev.label}</span> 
              </label> 
            ))} 
          </div> 
        </fieldset> 
        <label htmlFor="svc-notes" className="field-label">Anything else? (optional)</label>
        <input 
          id="svc-notes" className="text-input" value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="e.g. I just moved and need utilities set up" maxLength={500}
        /> 
        <button type="submit" className="btn btn-primary" disabled={busy}> 
          {busy ? t("matching") : t("recommend")} 
        </button>
      </form> 
      {result && ( 
        <div className="svc-results" role="status" aria-live="polite"> 
          {result.services.map((s, i) => ( 
            <article key={i} className="svc-card"> 
              <h3>{s.name}</h3> 
              <p className="svc-dept">{s.department}</p> 
              {s.why && <p className="svc-why"><strong>{t("why")}:</strong> {s.why}</p>} 
              {s.documents?.length > 0 && ( 
                <> 
                  <p className="svc-doc-label">{t("documents")}</p> 
                  <ul className="svc-docs"> 
                    {s.documents.map((d, j) => <li key={j}>{d}</li>)} 
                  </ul> 
                </> 
              )} 
            </article>
          ))} 
          {result.note && <p className="svc-note">{result.note}</p>} 
          <SourceNote source={result.source} t={t} /> 
        </div> 
      )} 
    </section>
  ); 
}