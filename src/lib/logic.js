import { DEPARTMENTS, SERVICE_CATALOG, STATUS_STEPS, UI } from "../data/catalog.js"; 

export function sanitizeText(input, maxLen = 1000) {
  if (typeof input !== "string") return ""; 
  const cleaned = input.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim(); 
  return cleaned.slice(0, maxLen); 
} 

export function isValidReport(text) {
  const t = sanitizeText(text);
  return t.length >= 8 && /[a-zA-Z\u0900-\u097F\u0980-\u09FF\u0B80-\u0BFF\u0C00-\u0C7F]/.test(t); 
} 

export function generateTicketId(now = Date.now(), rand = Math.random()) {
  const stamp = Math.floor(now / 1000).toString(36).toUpperCase().slice(-4); 
  const suffix = Math.floor(rand * 1296).toString(36).toUpperCase().padStart(2, "0"); 
  return `SHY-${stamp}-${suffix}`; 
} 

export function ruleBasedClassify(text) {
  const t = sanitizeText(text).toLowerCase();
  const has = (...words) => words.some((w) => t.includes(w)); 
  
  let department = "General Administration";
  let category = "General"; 
  
  if (has("water", "leak", "pipe", "drain", "sewage", "sewer")) { 
    department = "Water & Sewerage"; category = "Water supply"; 
  } else if (has("road", "pothole", "footpath", "streetlight", "street light", "pavement")) { 
    department = "Roads & Infrastructure"; category = "Roads & lighting";
  } else if (has("garbage", "trash", "waste", "sanitation", "dump", "litter")) {
    department = "Sanitation & Waste"; category = "Waste management";
  } else if (has("electric", "power", "transformer", "outage", "voltage", "wire")) { 
    department = "Electricity"; category = "Power supply"; 
  } else if (has("hospital", "clinic", "mosquito", "dengue", "health", "medicine")) { 
    department = "Public Health"; category = "Public health"; 
  } else if (has("ration", "certificate", "pension", "document", "record")) {
    department = "Revenue & Certificates"; category = "Records & welfare";
  } 
  
  let priority = "medium"; 
  if (has("fire", "gas leak", "live wire", "collapse", "flood", "accident", "danger", "electrocut")) { 
    priority = "high"; 
  } else if (has("suggestion", "feedback", "request", "would be nice")) {
    priority = "low"; 
  } 
  
  return { 
    category, department, priority, 
    summary: sanitizeText(text, 90),
    suggestedAction: `Forwarded to ${department} for assessment.`,
  }; 
} 

export function normalizeClassification(raw) {
  const department = DEPARTMENTS.includes(raw.department) ? raw.department : "General Administration";
  const priority = ["low", "medium", "high"].includes(raw.priority) ? raw.priority : "medium"; 
  return { 
    category: sanitizeText(raw.category || "General", 60),
    department, 
    priority, 
    summary: sanitizeText(raw.summary || "", 160),
    suggestedAction: sanitizeText(raw.suggestedAction || "", 200),
  }; 
} 

export function matchServices({ events = [], text = "" }, catalog = SERVICE_CATALOG) {
  const t = sanitizeText(text).toLowerCase();
  const scored = catalog.map((s) => { 
    let score = 0; 
    for (const e of events) if (s.events.includes(e)) score += 2; 
    for (const kw of s.keywords) if (t.includes(kw)) score += 1; 
    return { service: s, score }; 
  }); 
  const hits = scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score); 
  const chosen = (hits.length ? hits : scored.slice(0, 3)).slice(0, 4); 
  return chosen.map(({ service }) => ({ 
    name: service.name, 
    department: service.department, 
    documents: service.documents, 
    why: events.length ? "Matches your selected situation." : "Commonly needed service.",
  })); 
} 

export function advanceStatus(step) {
  return Math.min(step + 1, STATUS_STEPS.length - 1); 
} 

export function extractJson(text) {
  if (typeof text !== "string" || !text) return null; 
  let t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim(); 
  const s = t.indexOf("{"), e = t.lastIndexOf("}"); 
  if (s !== -1 && e !== -1 && e > s) t = t.slice(s, e + 1); 
  try { return JSON.parse(t); } catch { return null; } 
} 

export function makeT(langCode) {
  const dict = UI[langCode] || UI.en; 
  return (key) => dict[key] ?? UI.en[key] ?? key; 
} 

export function normalizeServices(list) {
  if (!Array.isArray(list)) return []; 
  return list.slice(0, 4).map((s) => ({ 
    name: sanitizeText(s.name, 80),
    department: DEPARTMENTS.includes(s.department) ? s.department : "General Administration",
    why: sanitizeText(s.why, 140),
    documents: Array.isArray(s.documents) ? s.documents.slice(0, 8).map((d) => sanitizeText(d, 80)) : [], 
  })); 
}