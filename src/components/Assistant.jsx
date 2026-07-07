import React, { useState, useMemo, useRef, useEffect, useCallback } from "react"; 
import { sanitizeText } from "../lib/logic.js";
import { askAssistant } from "../lib/ai.js"; 
import { SourceNote } from "./StatusTracker.jsx"; 

export default function Assistant({ t, lang }) {
  const [input, setInput] = useState(""); 
  const [thread, setThread] = useState([]); 
  const [busy, setBusy] = useState(false); 
  const abortRef = useRef(null); 
  
  const suggestions = useMemo(() => [
    "How do I apply for an income certificate?",
    "What documents do I need for a new water connection?",
    "Explain the old-age pension scheme simply.", 
  ], []); 

  const submit = useCallback(async (text) => { 
    const q = sanitizeText(text, 1000);
    if (!q || busy) return; 
    setThread((prev) => [...prev, { role: "user", text: q }]); 
    setInput(""); 
    setBusy(true); 
    abortRef.current = new AbortController(); 
    try { 
      const res = await askAssistant(q, lang, abortRef.current.signal); 
      setThread((prev) => [...prev, { role: "assistant", text: res.text, source: res.source }]); 
    } catch (e) { 
      if (e.name !== "AbortError") { 
        setThread((prev) => [...prev, { role: "assistant", text: "Something went wrong. Please try again." }]); 
      } 
    } finally { 
      setBusy(false); 
    } 
  }, [busy, lang]); 

  useEffect(() => () => abortRef.current?.abort(), []); 

  return ( 
    <section aria-labelledby="assistant-h" className="panel"> 
      <h2 id="assistant-h">{t("ask_title")}</h2>
      <p className="hint">{t("ask_hint")}</p> 
      {thread.length === 0 && ( 
        <div className="suggestions">
          {suggestions.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => submit(s)}>{s}</button>
          ))} 
        </div> 
      )} 
      <div className="thread" aria-live="polite"> 
        {thread.map((m, i) => ( 
          <div key={i} className={`msg msg-${m.role}`}> 
            <span className="msg-role">{m.role === "user" ? "You" : "Sahaay"}</span> 
            <p className="msg-text">{m.text}</p> 
            {m.role === "assistant" && <SourceNote source={m.source} t={t} />} 
          </div> 
        ))} 
        {busy && <p className="busy" role="status">{t("thinking")}</p>} 
      </div> 
      <form className="composer" onSubmit={(e) => { e.preventDefault(); submit(input); }}> 
        <label htmlFor="ask-input" className="sr-only">{t("ask_title")}</label>
        <input 
          id="ask-input" className="text-input" value={input} 
          onChange={(e) => setInput(e.target.value)} placeholder={t("ask_placeholder")} 
          maxLength={1000} autoComplete="off" 
        /> 
        <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()}> 
          {t("send")} 
        </button>
      </form> 
    </section>
  ); 
}