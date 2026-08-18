import { useEffect } from "react"
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site-config"

interface SeoOptions {
  title: string
  description: string
  /** pathname starting with "/", e.g. "/lessons/state" */
  path: string
  type?: "website" | "article"
  jsonLd?: object | object[]
}

function setMeta(key: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", "canonical")
    document.head.appendChild(el)
  }
  el.setAttribute("href", url)
}

function setJsonLd(jsonLd: object | object[] | undefined) {
  document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((el) => el.remove())
  if (!jsonLd) return
  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
  for (const item of items) {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.dataset.seoJsonld = "true"
    script.textContent = JSON.stringify(item)
    document.head.appendChild(script)
  }
}

/**
 * Updates document title + meta tags for the current route. This is a
 * client-side SPA (React Router, no SSR), so this only helps crawlers that
 * execute JavaScript (Googlebot does). It does not fix link-preview scrapers
 * that don't run JS — that needs server-side rendering or prerendering.
 */
export function useSeo({ title, description, path, type = "website", jsonLd }: SeoOptions) {
  useEffect(() => {
    const fullTitle = `${title} · ${SITE_NAME}`
    const url = `${SITE_URL}${path}`

    document.title = fullTitle

    setMeta("description", description)
    setMeta("og:title", fullTitle, "property")
    setMeta("og:description", description, "property")
    setMeta("og:url", url, "property")
    setMeta("og:type", type, "property")
    setMeta("og:image", DEFAULT_OG_IMAGE, "property")
    setMeta("og:site_name", SITE_NAME, "property")
    setMeta("twitter:card", "summary_large_image")
    setMeta("twitter:title", fullTitle)
    setMeta("twitter:description", description)
    setMeta("twitter:image", DEFAULT_OG_IMAGE)

    setCanonical(url)
    setJsonLd(jsonLd)
  }, [title, description, path, type, jsonLd])
}
