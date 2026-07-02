import { STATS, TESTIMONIALS, hasAnyStats, hasAnyTestimonials } from "@/lib/social-proof";

export function SocialProofStats() {
  if (!hasAnyStats()) return null;
  const enabled = STATS.filter((s) => s.enabled);
  return (
    <section className="mt-8 rounded-3xl bg-white/80 p-5 shadow-soft backdrop-blur">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {enabled.map((s) => (
          <div key={s.key} className="text-center">
            <div className="text-2xl font-black text-primary-deep">{s.value}</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-foreground/60">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SocialProofTestimonials() {
  if (!hasAnyTestimonials()) return null;
  const enabled = TESTIMONIALS.filter((t) => t.enabled);
  return (
    <section className="mt-10">
      <h2 className="text-center text-2xl font-extrabold tracking-tight">
        What early learners say
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {enabled.map((t) => (
          <figure
            key={t.key}
            className="rounded-2xl bg-white/80 p-5 text-left shadow-soft backdrop-blur"
          >
            <blockquote className="text-sm leading-relaxed text-foreground/85">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-3 text-xs font-bold text-foreground/60">
              — {t.attribution}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
