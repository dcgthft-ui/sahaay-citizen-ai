import React from "react"; 
import { STATUS_STEPS } from "../data/catalog.js"; 
import { StatusTracker, PriorityPill } from "./StatusTracker.jsx"; 

export default function TrackComplaints({ t, complaints, onAdvance }) {
  return ( 
    <section aria-labelledby="track-h" className="panel"> 
      <h2 id="track-h">{t("track_title")}</h2>
      {complaints.length === 0 ? ( 
        <p className="empty">{t("track_empty")}</p> 
      ) : ( 
        <ul className="complaint-list"> 
          {complaints.map((c) => ( 
            <li key={c.id} className="complaint"> 
              <div className="complaint-head"> 
                <span className="ticket-badge">{c.id}</span> 
                <PriorityPill level={c.priority} /> 
              </div> 
              <p className="complaint-text">{c.text}</p> 
              <p className="complaint-meta">{c.department} · {c.filedAt}</p>
              <StatusTracker step={c.step} /> 
              {c.step < STATUS_STEPS.length - 1 && ( 
                <button type="button" className="btn btn-ghost" onClick={() => onAdvance(c.id)}> 
                  {t("advance")} 
                </button>
              )} 
            </li> 
          ))} 
        </ul> 
      )} 
    </section>
  ); 
}