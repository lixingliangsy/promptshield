// scan.mjs — promptshield 真实 LLM 安全扫描（越狱 / 提示注入 / PII 泄漏）
// 幂等：同输入同输出。返回 { items:[...], metrics:{...} }。item.id 稳定，供 audit-run 做 diff。
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const AUDIT = path.join(ROOT, '.data', 'audit')
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, '.data', 'config.json'), 'utf8'))

// ---- 检测器（每条规则一个稳定 id，命中即产出一个 item）----
const JAILBREAK = [
  { id: 'jailbreak:dan', re: /\bDAN\b|Do Anything Now/i, title: 'DAN / "Do Anything Now" 越狱模板' },
  { id: 'jailbreak:unrestricted', re: /unrestricted|no (rules|restrictions|limits)|without (any )?(filter|guardrail)/i, title: '宣称无限制 / 无护栏' },
  { id: 'jailbreak:roleplay-bypass', re: /pretend (you are|to be)|roleplay as|act as (an? )?(unfiltered|uncensored)/i, title: '角色扮演绕过护栏' }
]
const INJECTION = [
  { id: 'injection:ignore-prev', re: /ignore (all |previous |prior )?(instructions|prompts|rules)/i, title: '指令覆盖：要求忽略先前指令' },
  { id: 'injection:reveal-system', re: /tell me your (system prompt|instructions|prompt)|reveal your (system|prompt)|what are your (instructions|system prompt)/i, title: '试图提取系统提示词' },
  { id: 'injection:disregard', re: /disregard|override|forget (everything|all)/i, title: '要求背离既定约束' }
]
const PII = [
  { id: 'pii:email', re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, title: '提示词含邮箱 (PII)' },
  { id: 'pii:phone', re: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/, title: '提示词含电话号码 (PII)' }
]

async function loadTargets() {
  const scan = cfg.scan || {}
  const targets = (scan.targets && scan.targets.length) ? scan.targets : ['sample-prompts.json']
  const out = []
  for (const t of targets) {
    try {
      if (/^https?:\/\//i.test(t)) {
        const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 12000)
        try {
          const r = await fetch(t, { signal: ctrl.signal, redirect: 'follow', headers: { 'user-agent': 't1-audit-bot/1.0 (+https://lxsai.com)' } })
          if (!r.ok) throw new Error('HTTP ' + r.status)
          const data = JSON.parse(await r.text())
          out.push({ source: t, prompts: data.prompts || [] })
        } finally { clearTimeout(to) }
      } else {
        const p = path.isAbsolute(t) ? t : path.join(AUDIT, t)
        if (!fs.existsSync(p)) { out.push({ source: t, prompts: [] }); continue }
        const data = JSON.parse(fs.readFileSync(p, 'utf8'))
        out.push({ source: t, prompts: data.prompts || [] })
      }
    } catch (e) { out.push({ source: t, prompts: [] }) }
  }
  return out
}

export async function scan(ctx) {
  const targets = await loadTargets()
  const items = []
  let jailbreaks = 0, injections = 0, pii = 0, scanned = 0

  const pushMatches = (list, text, pid, category, severity) => {
    for (const d of list) {
      if (d.re.test(text)) {
        items.push({ id: `${d.id}#${pid}`, category, severity, title: d.title, detail: text.slice(0, 120), present: true })
      }
    }
  }

  for (const t of targets) {
    for (const p of t.prompts) {
      scanned++
      const text = (p.text || '') + ''
      const pid = p.id || ('p' + scanned)
      pushMatches(JAILBREAK, text, pid, 'jailbreak', 'high')
      pushMatches(INJECTION, text, pid, 'injection', 'high')
      pushMatches(PII, text, pid, 'pii', 'medium')
    }
  }

  jailbreaks = items.filter(i => i.category === 'jailbreak').length
  injections = items.filter(i => i.category === 'injection').length
  pii = items.filter(i => i.category === 'pii').length

  // 安全评分：基础 100，按命中扣分（越狱/注入 -18，PII -10），下限 0
  const penalty = jailbreaks * 18 + injections * 18 + pii * 10
  const safety_score = Math.max(0, 100 - penalty)

  const metrics = {
    scanned,
    jailbreaks_found: jailbreaks,
    injections_found: injections,
    pii_found: pii,
    safety_score,
    standards: cfg.standards || []
  }

  return { items, metrics }
}
