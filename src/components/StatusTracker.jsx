import React from "react"; 
import { STATUS_STEPS, PRIORITY_META } from "../data/catalog.js"; 

export function PriorityPill({ level }) {
  const meta = PRIORITY_META[level] || PRIORITY_META.medium; 
  return <span className={`pill ${meta.cls}`}>{meta.label}</span>; 
} 

export function SourceNote({ source, t }) {
  if (source !== "rule") return null; 
  return <p className="source-note" role="note">{t("offline_note")}</p>; 
} 

export function StatusTracker({ step }) {
  return ( 
    <ol className="track" aria-label={`Status: ${STATUS_STEPS[step]}`}> 
      {STATUS_STEPS.map((label, i) => { 
        const state = i < step ? "done" : i === step ? "current" : "todo"; 
        return ( 
          <li key={label} className={`track-stop ${state}`}> 
            <span className="track-dot" aria-hidden="true" /> 
            <span className="track-label">{label}</span> 
          </li> 
        ); 
      })} 
    </ol> 
  ); 
}