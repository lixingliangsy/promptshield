import React from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { PRODUCT } from '../lib/product'

const segments = [
  {
    name: "Customer chatbots",
    pain: "Untrusted users try ignore-previous-instructions attacks.",
    how: "Scan description + sample input; get pattern hits and hardening steps.",
  },
  {
    name: "RAG apps",
    pain: "Retrieved docs carry indirect injection.",
    how: "Flag delimiter break-out and goal-hijack patterns.",
  },
  {
    name: "CI for AI apps",
    pain: "Need a pre-merge gate.",
    how: "Pro: CI-oriented runs with audit log.",
  },
  {
    name: "Security reviews",
    pain: "Need an explainable pattern checklist.",
    how: "Deterministic rules fire before the model.",
  },
]

export default function UseCasesPage() {
  return (
    <Layout>
      <Head>
        <title>{`${PRODUCT.name} — Use Cases`}</title>
        <meta name="description" content={`How ${PRODUCT.name} helps ${PRODUCT.tagline}`} />
      </Head>
      <div className="max-w-4xl">
        <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">Use Cases</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Built for LLM product and security engineers</h1>
        <p className="text-lg text-slate-600 mb-10">Pick your segment to see the workflows that matter most.</p>

        <div className="space-y-5">
          {segments.map((s) => (
            <div key={s.name} className="rounded-2xl border border-slate-200 p-6 bg-white">
              <h2 className="text-xl font-bold mb-2 text-slate-900">{s.name}</h2>
              <p className="text-sm text-slate-600 mb-2"><span className="font-semibold text-slate-900">Pain: </span>{s.pain}</p>
              <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">How {PRODUCT.name} helps: </span>{s.how}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-8">refs: OWASP LLM01 Prompt Injection · OWASP Top 10 for LLM Applications · NIST AI RMF</p>
      </div>
    </Layout>
  )
}
