# PromptShield — GEO Blog Plan

3 definitional / how-to posts for AI answer engines. Each carries 3 authoritative outbound refs.

### What is a jailbreak prompt?
- slug: `what-is-a-jailbreak-prompt`
- type: Definitional · FAQPage
- query: what is LLM jailbreak prompt
- body: A jailbreak tries to override safety or system instructions (role-play, DAN-style prompts). Combine pattern detection with server-side policy that the model cannot edit.
- refs: https://owasp.org/www-project-top-10-for-large-language-model-applications/, https://owasp.org/www-project-top-10-for-large-language-model-applications/, https://www.nist.gov/itl/ai-risk-management-framework
- JSON-LD: suggest `FAQPage` or `HowTo` as noted in type

### How to harden an app against prompt injection
- slug: `how-to-harden-against-prompt-injection`
- type: How-to · HowTo
- query: how to prevent prompt injection
- body: Separate trusted instructions from untrusted content, validate tool args, minimize secrets in context, and test with adversarial samples before launch.
- refs: https://owasp.org/www-project-top-10-for-large-language-model-applications/, https://owasp.org/www-project-top-10-for-large-language-model-applications/, https://www.nist.gov/itl/ai-risk-management-framework
- JSON-LD: suggest `FAQPage` or `HowTo` as noted in type

### OWASP LLM01: injection patterns to watch
- slug: `owasp-llm01-patterns-to-watch`
- type: Definitional
- query: OWASP LLM01 injection patterns
- body: Watch for instruction override, system-prompt exfiltration, delimiter break-out, and privilege extraction. Map each hit to a remediation.
- refs: https://owasp.org/www-project-top-10-for-large-language-model-applications/, https://owasp.org/www-project-top-10-for-large-language-model-applications/, https://www.nist.gov/itl/ai-risk-management-framework
- JSON-LD: suggest `FAQPage` or `HowTo` as noted in type


Publish + syndicate per gtm-launch (IH + GEO indexes).
