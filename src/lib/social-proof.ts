/**
 * Social proof configuration.
 *
 * Every stat and testimonial is `enabled: false` by default. Nothing renders
 * on the site until real data is available. Do NOT flip a flag to `true`
 * with a placeholder number — the site should never claim numbers it hasn't
 * earned.
 *
 * When beta data arrives, update the `value` and set `enabled: true`.
 */

export interface Stat {
  key: string;
  label: string;
  value: string; // display string, e.g. "10,000+" or "4.9/5"
  enabled: boolean;
}

export interface Testimonial {
  key: string;
  quote: string;
  attribution: string; // e.g. "Maria — parent of two"
  enabled: boolean;
}

// TODO: enable once we have real analytics.
export const STATS: Stat[] = [
  { key: "hatched",   label: "Hodlchis hatched",     value: "—", enabled: false },
  { key: "lessons",   label: "Lessons completed",    value: "—", enabled: false },
  { key: "avgLesson", label: "Avg. lesson length",   value: "—", enabled: false },
  { key: "rating",    label: "Beta rating",          value: "—", enabled: false },
];

// TODO: enable once we have signed testimonials from beta testers.
export const TESTIMONIALS: Testimonial[] = [
  { key: "t1", quote: "", attribution: "", enabled: false },
  { key: "t2", quote: "", attribution: "", enabled: false },
  { key: "t3", quote: "", attribution: "", enabled: false },
];

export function hasAnyStats() {
  return STATS.some((s) => s.enabled);
}

export function hasAnyTestimonials() {
  return TESTIMONIALS.some((t) => t.enabled);
}
