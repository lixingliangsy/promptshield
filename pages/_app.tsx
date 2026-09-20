import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_ID
const UMAMI_URL = (process.env.NEXT_PUBLIC_UMAMI_URL || 'https://analytics.umami.is').replace(/\/$/, '')

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {UMAMI_ID && (
        <Script
          async
          src={`${UMAMI_URL}/script.js`}
          data-website-id={UMAMI_ID}
          strategy="afterInteractive"
        />
      )}
            <><Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PromptShield" />
        <meta property="og:description" content="Describe your AI app and paste a sample of untrusted user input; get an injection-risk report with the exact patterns that fired and a hardening checklist. For LLM/agent product teams (devs + security) shipping customer-facing chatbots that accept untrusted input." />
        <meta property="og:url" content="https://promptshield.lxsaihub.com/" />
        <meta property="og:image" content="https://promptshield.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PromptShield" />
        <meta name="twitter:description" content="Describe your AI app and paste a sample of untrusted user input; get an injection-risk report with the exact patterns that fired and a hardening checklist. For LLM/agent product teams (devs + security) shipping customer-facing chatbots that accept untrusted input." />
        <meta name="twitter:image" content="https://promptshield.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"PromptShield","url":"https://promptshield.lxsaihub.com/","description":"Describe your AI app and paste a sample of untrusted user input; get an injection-risk report with the exact patterns that fired and a hardening checklist. For LLM/agent product teams (devs + security) shipping customer-facing chatbots that accept untrusted input.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","priceCurrency":"USD","price":"0","availability":"https://schema.org/OnlineOnly"}}' }} />
      </Head>
      <Component {...pageProps} />
      <ChatWidget productName={SUPPORT.productName} brandColor={SUPPORT.brandColor} sessionKeyPrefix={SUPPORT.productSlug} /></>
    </>
  )
}
