export const RULESET_VERSION = 'prompt-injection@2026-07-19'

export type InjectionRule = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  pattern: RegExp
  remediation: string
}

export const INJECTION_RULES: InjectionRule[] = [
  {
    id: 'PI-01',
    title: 'Ignore / override system instructions',
    severity: 'high',
    pattern: /ignore (previous|prior|above|all)? ?(instructions|prompt|rules)|disregard (the )?(system|previous)/i,
    remediation: 'Reject override phrases at the input boundary; keep system prompt non-echoable.',
  },
  {
    id: 'PI-02',
    title: 'Role-play / jailbreak signal',
    severity: 'high',
    pattern: /you are now|act as|pretend|jailbreak|dan mode|developer mode/i,
    remediation: 'Add a pre-tool injection classifier; refuse role-swap requests.',
  },
  {
    id: 'PI-03',
    title: 'System-prompt exfiltration',
    severity: 'high',
    pattern: /print (your )?(system prompt|instructions|rules)|reveal (your )?(prompt|instructions)/i,
    remediation: 'Never return system content; use separate privileged channels.',
  },
  {
    id: 'PI-04',
    title: 'Secret / credential fishing',
    severity: 'medium',
    pattern: /password|api[ -]?key|secret|ssn|credit card|token/i,
    remediation: 'Block secret-related asks; redact model outputs for credential patterns.',
  },
  {
    id: 'PI-05',
    title: 'Delimiter / goal hijack',
    severity: 'medium',
    pattern: /<\/?system>|<\/?system-prompt>|###|forget (everything|all|previous)|from now on/i,
    remediation: 'Normalize delimiters; treat user text as untrusted data, not instructions.',
  },
]

export type RuleHit = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  passed: boolean
  remediation?: string
  ref?: string
}

export function runInjectionDomainChecks(inputs: Record<string, string>) {
  const text = `${inputs.appDescription || ''} ${inputs.userInput || inputs.topic || ''}`
  const hits = INJECTION_RULES.filter((r) => {
    const pat: any = r.pattern
    const re = pat instanceof RegExp ? pat : new RegExp(String(pat), 'i')
    return re.test(text)
  }).map((r) => ({
    id: r.id,
    title: r.title,
    severity: r.severity,
    remediation: r.remediation,
    source: 'Rule-based' as const,
  }))
  return { rulesetVersion: RULESET_VERSION, hits }
}

/** L1 tool adapter */
export function runDeterministicChecks(inputs: Record<string, string>): RuleHit[] {
  const { hits } = runInjectionDomainChecks(inputs)
  if (!hits.length) {
    const blob = Object.values(inputs || {}).join(' ').trim()
    return [{ id: 'R0', title: 'Inputs accepted', severity: 'low', passed: blob.length > 0 }]
  }
  return hits.map((h) => ({
    id: h.id,
    title: h.title,
    severity: h.severity,
    passed: false,
    remediation: h.remediation,
  }))
}
