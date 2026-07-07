export const DEPARTMENTS = [ 
  "Water & Sewerage", 
  "Roads & Infrastructure", 
  "Sanitation & Waste",
  "Electricity", 
  "Public Health", 
  "Revenue & Certificates",
  "General Administration",
]; 

export const SERVICE_CATALOG = [ 
  { id: "birth_cert", name: "Birth Certificate", department: "Revenue & Certificates",
    events: ["new_child", "documents"], keywords: ["birth", "newborn", "baby"], 
    documents: ["Hospital birth record", "Parents' ID proof", "Address proof"] }, 
  { id: "income_cert", name: "Income Certificate", department: "Revenue & Certificates",
    events: ["study", "welfare", "documents"], keywords: ["income", "scholarship", "subsidy"], 
    documents: ["Salary slip or affidavit", "ID proof", "Ration card"] },
  { id: "ration_card", name: "Ration Card", department: "Revenue & Certificates",
    events: ["moving", "welfare", "new_child"], keywords: ["ration", "food", "pds"],
    documents: ["Address proof", "Family photo", "ID proof of head of family"] }, 
  { id: "water_conn", name: "New Water Connection", department: "Water & Sewerage",
    events: ["moving", "property"], keywords: ["water", "connection", "tap"],
    documents: ["Property ownership proof", "ID proof", "Site plan"] }, 
  { id: "property_tax", name: "Property Tax Payment", department: "Revenue & Certificates",
    events: ["property"], keywords: ["property", "tax", "house"], 
    documents: ["Property ID number", "Previous receipt (optional)"] },
  { id: "pension", name: "Old-Age Pension", department: "Public Health", 
    events: ["welfare", "senior"], keywords: ["pension", "senior", "old age"], 
    documents: ["Age proof", "Bank account details", "Income certificate"] },
  { id: "driving_license", name: "Driving Licence", department: "General Administration",
    events: ["vehicle", "documents"], keywords: ["driving", "license", "licence", "vehicle"], 
    documents: ["Age proof", "Address proof", "Passport photo", "Learner's permit"] }, 
  { id: "trade_license", name: "Trade Licence", department: "General Administration",
    events: ["business"], keywords: ["business", "shop", "trade", "startup"], 
    documents: ["Address proof of premises", "ID proof", "Rental agreement / ownership proof"] }, 
]; 

export const LIFE_EVENTS = [ 
  { id: "new_child", label: "A new child in the family" }, 
  { id: "moving", label: "Moving to a new home" }, 
  { id: "study", label: "Studies / scholarships" }, 
  { id: "property", label: "Buying or owning property" }, 
  { id: "vehicle", label: "Vehicles & driving" }, 
  { id: "business", label: "Starting a business" },
  { id: "welfare", label: "Welfare & pensions" }, 
]; 

// Ensure you include the rest of your LANGS and UI arrays below this...

// The selector drives the assistant's reply language for every request.
export const LANGS = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "es", label: "Spanish", native: "Español" },
];

// English is the source of truth; Hindi is fully translated. Missing keys fall
// back to English (see makeT in lib/logic.js) so nothing renders blank.
export const UI = {
  en: {
    tagline: "Your civic companion",
    nav_assistant: "Ask Sahaay", nav_report: "Report an issue",
    nav_track: "Track complaints", nav_services: "Find services", nav_tests: "Self-check",
    ask_title: "Ask about any public service",
    ask_hint: "Explain a scheme, list documents, or help you file something — in your language.",
    ask_placeholder: "e.g. How do I apply for an income certificate?",
    send: "Send", thinking: "Thinking…",
    report_title: "Report a public issue",
    report_hint: "Describe what's wrong. Sahaay routes it to the right department and gives you a tracking number.",
    report_placeholder: "e.g. Streetlight near the park has been off for a week",
    submit_report: "Submit report", routing: "Routing to the right department…",
    track_title: "Your complaints", track_empty: "No complaints yet. File one and it will appear here.",
    services_title: "Find the right service",
    services_hint: "Tell us your situation. Sahaay recommends services and lists what to bring.",
    recommend: "Recommend services", matching: "Finding relevant services…",
    tests_title: "Logic self-check",
    tests_hint: "Runs the app's unit tests in your browser so you can verify the core logic.",
    run_tests: "Run tests",
    department: "Department", priority: "Priority", ticket: "Ticket",
    documents: "Documents to bring", why: "Why this fits",
    offline_note: "Answered with built-in logic (AI service was unreachable).",
    advance: "Advance status", situation: "Your situation",
  },
  hi: {
    tagline: "आपका नागरिक साथी",
    nav_assistant: "सहाय से पूछें", nav_report: "शिकायत दर्ज करें",
    nav_track: "शिकायत ट्रैक करें", nav_services: "सेवाएँ खोजें", nav_tests: "स्व-जाँच",
    ask_title: "किसी भी सार्वजनिक सेवा के बारे में पूछें",
    ask_hint: "किसी योजना को समझें, दस्तावेज़ों की सूची पाएँ, या आवेदन में मदद लें — अपनी भाषा में।",
    ask_placeholder: "जैसे: आय प्रमाण पत्र के लिए आवेदन कैसे करें?",
    send: "भेजें", thinking: "सोच रहे हैं…",
    report_title: "सार्वजनिक समस्या दर्ज करें",
    report_hint: "समस्या बताएँ। सहाय इसे सही विभाग को भेजेगा और ट्रैकिंग नंबर देगा।",
    report_placeholder: "जैसे: पार्क के पास की स्ट्रीटलाइट एक हफ़्ते से बंद है",
    submit_report: "शिकायत भेजें", routing: "सही विभाग को भेजा जा रहा है…",
    track_title: "आपकी शिकायतें", track_empty: "अभी कोई शिकायत नहीं। दर्ज करें, यहाँ दिखेगी।",
    services_title: "सही सेवा खोजें",
    services_hint: "अपनी स्थिति बताएँ। सहाय सेवाएँ सुझाएगा और ज़रूरी दस्तावेज़ बताएगा।",
    recommend: "सेवाएँ सुझाएँ", matching: "प्रासंगिक सेवाएँ खोजी जा रही हैं…",
    tests_title: "लॉजिक स्व-जाँच",
    tests_hint: "ऐप के यूनिट टेस्ट ब्राउज़र में चलते हैं ताकि आप मुख्य लॉजिक जाँच सकें।",
    run_tests: "टेस्ट चलाएँ",
    department: "विभाग", priority: "प्राथमिकता", ticket: "टिकट",
    documents: "ज़रूरी दस्तावेज़", why: "यह क्यों उपयुक्त है",
    offline_note: "अंतर्निहित लॉजिक से उत्तर (AI सेवा उपलब्ध नहीं थी)।",
    advance: "स्थिति आगे बढ़ाएँ", situation: "आपकी स्थिति",
  },
};

export const STATUS_STEPS = ["Received", "Verified", "Assigned", "In progress", "Resolved"];

export const PRIORITY_META = {
  high: { label: "High", cls: "pri-high" },
  medium: { label: "Medium", cls: "pri-med" },
  low: { label: "Low", cls: "pri-low" },
};
