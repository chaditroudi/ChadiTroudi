/**
 * Privacy-friendly analytics that does nothing until configured.
 *
 * Set VITE_PLAUSIBLE_DOMAIN (e.g. "chaditroudi.github.io") at build time to load
 * Plausible (no cookies, no consent banner needed). Events below are the hiring
 * funnel: who read a case study, who downloaded the CV, who reached out.
 */
type EventName = "cv_download" | "email_click" | "email_copy" | "linkedin_click" | "case_study_open" | "external_project_click";

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Record<string, string> }) => void) & { q?: unknown[] };
  }
}

const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;

export function initAnalytics() {
  if (!domain || typeof document === "undefined" || window.plausible) return;
  window.plausible = Object.assign(
    (...args: unknown[]) => {
      (window.plausible!.q = window.plausible!.q || []).push(args);
    },
    { q: [] as unknown[] },
  );
  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = domain;
  script.src = "https://plausible.io/js/script.pageview-props.tagged-events.js";
  document.head.appendChild(script);
}

export function track(event: EventName, props?: Record<string, string>) {
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* analytics must never break the page */
  }
}
