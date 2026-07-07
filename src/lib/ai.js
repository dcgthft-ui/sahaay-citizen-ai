/**
 * Client-side AI layer.
 *
 * The browser never talks to the model directly and never sees an API key.
 * It calls our own /api/* proxy (see server/index.js). If the proxy is
 * unreachable, we fall back to the deterministic rule-based logic so the app
 * keeps working offline.
 */

import {
  sanitizeText, ruleBasedClassify, matchServices,
} from "./logic.js";

async function postJson(path, body, signal) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`Proxy responded ${res.status}`);
  return res.json();
}

/** Conversational answer. Falls back to a helpful static message on failure. */
export async function askAssistant(question, lang, signal) {
  const q = sanitizeText(question, 1000);
  try {
    const data = await postJson("/api/ask", { question: q, lang }, signal);
    if (data?.text) return { text: data.text, source: data.source || "ai" };
    throw new Error("empty");
  } catch (e) {
    if (e.name === "AbortError") throw e;
    return {
      text: "I couldn't reach the assistant just now. You can still report an issue, track a complaint, or browse services from the menu above.",
      source: "rule",
    };
  }
}

/** Route a public issue. AI (via proxy) first, rule-based on failure. */
export async function classifyIssue(text, lang, signal) {
  const clean = sanitizeText(text, 1000);
  try {
    const data = await postJson("/api/classify", { text: clean, lang }, signal);
    if (data?.department) return { ...data, source: data.source || "ai" };
    throw new Error("unparseable");
  } catch (e) {
    if (e.name === "AbortError") throw e;
    return { ...ruleBasedClassify(clean), source: "rule" };
  }
}

/** Recommend services. AI (via proxy) first, catalog match on failure. */
export async function recommendServices({ events, text }, lang, signal) {
  const clean = sanitizeText(text, 500);
  try {
    const data = await postJson("/api/recommend", { events, text: clean, lang }, signal);
    if (Array.isArray(data?.services) && data.services.length) {
      return { services: data.services, note: data.note || "", source: data.source || "ai" };
    }
    throw new Error("unparseable");
  } catch (e) {
    if (e.name === "AbortError") throw e;
    return { services: matchServices({ events, text: clean }), note: "", source: "rule" };
  }
}
