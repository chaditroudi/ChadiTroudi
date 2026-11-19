import { useEffect } from "react";
import { absoluteUrl, type PageMeta } from "@/content/seo";

function setMeta(selector: string, attr: "content" | "href", value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/**
 * Keeps <title>, description, canonical and Open Graph tags in sync with the route.
 * The same values are written into the static HTML of each route at build time
 * (scripts/postbuild.ts), so crawlers that don't run JavaScript see them too.
 */
export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;
    const url = absoluteUrl(meta.path);
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:title"]', "content", meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", meta.title);
    setMeta('meta[name="twitter:description"]', "content", meta.description);
  }, [meta.title, meta.description, meta.path]);
}
