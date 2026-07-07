/**
 * Test definitions for the pure logic layer.
 * Single source of truth: consumed by the in-app "Self-check" tab
 * (src/components/SelfCheck.jsx) and by the vitest suite (test/logic.test.js).
 * Each test is a { name, fn } where fn returns true on pass.
 */

import {
  sanitizeText, isValidReport, generateTicketId, ruleBasedClassify,
  normalizeClassification, matchServices, advanceStatus, extractJson,
  makeT, normalizeServices,
} from "./logic.js";

export const TESTS = [
  { name: "sanitizeText strips control chars and caps length", fn: () => {
      const out = sanitizeText("a\u0000b\n c", 100);
      return out === "a b c" && sanitizeText("x".repeat(50), 10).length === 10;
  }},
  { name: "isValidReport rejects trivial input", fn: () =>
      !isValidReport("...") && !isValidReport("ok") && isValidReport("Pothole on Main Road") },
  { name: "isValidReport accepts non-Latin scripts", fn: () =>
      isValidReport("पानी की पाइप लीक हो रही है") },
  { name: "generateTicketId is deterministic for fixed inputs", fn: () => {
      const a = generateTicketId(1_700_000_000_000, 0.5);
      const b = generateTicketId(1_700_000_000_000, 0.5);
      return a === b && /^SHY-[A-Z0-9]{4}-[A-Z0-9]{2}$/.test(a);
  }},
  { name: "ruleBasedClassify routes water issues", fn: () =>
      ruleBasedClassify("There is a burst water pipe on my street").department === "Water & Sewerage" },
  { name: "ruleBasedClassify flags safety as high priority", fn: () =>
      ruleBasedClassify("A live wire is hanging and sparking").priority === "high" },
  { name: "ruleBasedClassify defaults unknowns safely", fn: () => {
      const r = ruleBasedClassify("I have a general question");
      return r.department === "General Administration" && r.priority === "medium";
  }},
  { name: "normalizeClassification clamps unknown department", fn: () => {
      const r = normalizeClassification({ department: "Ministry of Magic", priority: "urgent" });
      return r.department === "General Administration" && r.priority === "medium";
  }},
  { name: "normalizeServices bounds list to 4 and clamps departments", fn: () => {
      const many = Array.from({ length: 9 }, () => ({ name: "x", department: "Nope", why: "y", documents: [] }));
      const out = normalizeServices(many);
      return out.length === 4 && out[0].department === "General Administration";
  }},
  { name: "matchServices scores life events above text", fn: () =>
      matchServices({ events: ["new_child"], text: "" }).some((s) => s.name === "Birth Certificate") },
  { name: "matchServices always returns something", fn: () =>
      matchServices({ events: [], text: "" }).length > 0 },
  { name: "advanceStatus stops at Resolved", fn: () =>
      advanceStatus(3) === 4 && advanceStatus(4) === 4 },
  { name: "extractJson survives code fences", fn: () => {
      const j = extractJson('```json\n{"a":1}\n```');
      return j && j.a === 1 && extractJson("not json") === null;
  }},
  { name: "makeT falls back to English for missing keys", fn: () =>
      makeT("bn")("send") === "Send" },
];

export function runTests() {
  return TESTS.map((t) => {
    try { return { name: t.name, pass: t.fn() === true }; }
    catch (err) { return { name: t.name, pass: false, error: String(err) }; }
  });
}
