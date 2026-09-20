import type { KbEntry } from "../support-kit/types";
export type { KbEntry };

export const KB: KbEntry[] = [
  {
    id: "what",
    title: "What PromptShield does",
    keywords: ["PromptShield", "promptshield", "what", "product", "about", "Scan your AI app for prompt-injection & jailbreak vulnerabilities before you ship."],
    body: "Scan your AI app for prompt-injection & jailbreak vulnerabilities before you ship.. PromptShield scans an AI app for prompt-injection and jailbreak risk before you ship — paste untrusted input samples, get the patterns that fired, and a hardening checklist for LLM/agent product teams.",
    source: "PromptShield product definition",
    tags: [],
  },
  {
    id: "features",
    title: "PromptShield features",
    keywords: ["features", "feature", "can", "does", "Deterministic injection pattern checklist", "Injection pattern detection", "Jailbreak signal flags", "Hardening checklist", "CI-ready (Pro)"],
    body: "PromptShield includes: Deterministic injection pattern checklist; Injection pattern detection; Jailbreak signal flags; Hardening checklist; CI-ready (Pro). It does not add capabilities that are not listed here.",
    source: "PromptShield feature list",
    tags: [],
  },
  {
    id: "pricing",
    title: "PromptShield pricing",
    keywords: ["price", "pricing", "plan", "cost", "billing", "subscription", "monthly", "yearly"],
    body: "Listed prices for PromptShield: $29/month and $290/year. Checkout uses the in-app checkout route. This assistant cannot change a subscription or issue a refund.",
    source: "PromptShield pricing fields",
    tags: [],
  },
  {
    id: "howto",
    title: "How to use PromptShield",
    keywords: ["how", "start", "use", "tool", "run", "Scan for injection"],
    body: "Open PromptShield and use Scan for injection. The form asks for: Describe your AI app; Sample untrusted user input (optional).",
    source: "PromptShield tool fields",
    tags: [],
  },
  {
    id: "faq-1",
    title: "What is PromptShield?",
    keywords: ["What", "is", "PromptShield?"],
    body: "PromptShield scans AI apps for prompt-injection and jailbreak vulnerabilities before you ship.",
    source: "PromptShield FAQ",
    tags: [],
  },
  {
    id: "faq-2",
    title: "What do I paste in?",
    keywords: ["What", "do", "I", "paste", "in?"],
    body: "A short description of your AI app and samples of untrusted user input.",
    source: "PromptShield FAQ",
    tags: [],
  },
  {
    id: "faq-3",
    title: "What does the report include?",
    keywords: ["What", "does", "the", "report", "include?"],
    body: "The patterns that fired plus a hardening checklist you can action.",
    source: "PromptShield FAQ",
    tags: [],
  },
  {
    id: "honesty",
    title: "What this assistant will not claim",
    keywords: ["legal", "advice", "guarantee", "demo", "human", "refund", "support"],
    body: "Answers about PromptShield are decision support only, not legal, tax, accessibility-certification, or compliance sign-off. This assistant does not invent integrations, SSO, CSV export, or Slack connections unless they are already in the product description. If live AI is unavailable, the product must not pretend a demo result is live. Say you want a human and leave an email if you need a person.",
    source: "PromptShield support policy",
    tags: ["compliance"],
  },
];

function normalize(s: string): string {
  return (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}
function toWords(s: string): string[] {
  return normalize(s).split(/\s+/).map((w) => w.trim()).filter(Boolean);
}
function cjkBigrams(s: string): string[] {
  const grams: string[] = [];
  const han = /[\u4e00-\u9fff]/;
  for (const w of toWords(s)) {
    if (han.test(w) && w.length >= 2) {
      for (let i = 0; i < w.length - 1; i++) grams.push(w.slice(i, i + 2));
    }
  }
  return grams;
}
function scoreEntry(entry: KbEntry, query: string): number {
  const q = normalize(query);
  const qWords = new Set(toWords(q));
  const qGrams = new Set(cjkBigrams(q));
  let s = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) s += 3;
  }
  for (const tw of toWords(entry.title)) {
    if (qWords.has(tw)) s += 2;
  }
  const idx = normalize(entry.keywords.join(" ") + " " + entry.title + " " + entry.body.slice(0, 400));
  for (const g of qGrams) if (idx.includes(g)) s += 0.5;
  return s;
}

export interface RetrieveResult {
  entries: KbEntry[];
  topScore: number;
}

export function retrieve(query: string, topK = 4, entries: KbEntry[] = KB): RetrieveResult {
  const scored = entries
    .map((e) => ({ e, s: scoreEntry(e, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK);
  return { entries: scored.map((x) => x.e), topScore: scored.length ? scored[0].s : 0 };
}

export function isComplianceRelated(entries: KbEntry[]): boolean {
  return entries.some((e) => e.tags.includes("compliance"));
}
