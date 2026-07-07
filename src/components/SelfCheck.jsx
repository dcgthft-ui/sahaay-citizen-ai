import React, { useState } from "react"; 
import { runTests } from "../lib/selftests.js";

export default function SelfCheck({ t }) {
  const [results, setResults] = useState(null); 
  const passed = results?.filter((r) => r.pass).length ?? 0; 
  const total = results?.length ?? 0; 

  return ( 
    <section aria-labelledby="tests-h" className="panel"> 
      <h2 id="tests-h">{t("tests_title")}</h2>
      <p className="hint">{t("tests_hint")}</p> 
      <button type="button" className="btn btn-primary" onClick={() => setResults(runTests())}> 
        {t("run_tests")} 
      </button>
      {results && ( 
        <div aria-live="polite"> 
          <p className={`test-summary ${passed === total ? "all-pass" : "some-fail"}`} role="status"> 
            {passed} / {total} passing 
          </p> 
          <ul className="test-list"> 
            {results.map((r, i) => ( 
              <li key={i} className={r.pass ? "t-pass" : "t-fail"}> 
                <span className="t-mark" aria-hidden="true">{r.pass ? "✓" : "✕"}</span> 
                <span>{r.name}</span> 
                {r.error && <code className="t-err">{r.error}</code>} 
              </li> 
            ))} 
          </ul> 
        </div> 
      )} 
    </section>
  ); 
}