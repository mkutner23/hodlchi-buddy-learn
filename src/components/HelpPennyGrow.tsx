import { useState } from "react";
import { useHodlchi } from "@/lib/hodlchi-store";
import { useI18n } from "@/lib/i18n";
import { getDeviceId } from "@/lib/analytics-client";
import { submitInterviewSignup, submitProductFeedback } from "@/lib/insights.functions";

type Mode = "closed" | "menu" | "interview" | "feedback" | "thanks";

/**
 * A single card that lets early users help shape Penny:
 *  - "Chat with the team" → interview signup (email + note)
 *  - "Give feedback" → rating + free text
 *
 * Shows only after the user has some skin in the game (>= 3 lessons)
 * and hides once they've engaged with either surface.
 */
export function HelpPennyGrow() {
  const { state, logEvent } = useHodlchi();
  const { locale } = useI18n();
  const [mode, setMode] = useState<Mode>("closed");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [rating, setRating] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadyEngaged =
    typeof window !== "undefined" &&
    localStorage.getItem("hodlchi.help-penny.done") === "1";

  const eligible = state.completedLessons.length >= 3 && !alreadyEngaged;
  if (!eligible) return null;

  const t = {
    title: locale === "es" ? "Ayuda a Penny a crecer" : "Help Penny grow",
    sub:
      locale === "es"
        ? "Estás en la beta privada. Tu voz da forma a Penny."
        : "You're in the private beta. Your voice shapes Penny.",
    interview: locale === "es" ? "Charla con el equipo" : "Chat with the team",
    feedback: locale === "es" ? "Cuéntanos qué mejorar" : "Tell us what to fix",
    later: locale === "es" ? "Ahora no" : "Not now",
    emailLabel: locale === "es" ? "Tu email" : "Your email",
    notePlaceholder:
      locale === "es"
        ? "¿Qué te encantaría preguntarnos?"
        : "Anything you'd love to ask us?",
    feedbackPlaceholder:
      locale === "es"
        ? "¿Qué cambiarías de Penny hoy?"
        : "What would you change about Penny today?",
    send: locale === "es" ? "Enviar" : "Send",
    thanks: locale === "es" ? "¡Gracias! 💚 Penny lo recordará." : "Thank you! 💚 Penny will remember.",
    ratingPrompt:
      locale === "es" ? "¿Cómo te sientes con Penny?" : "How does Penny feel to you?",
  };

  const finish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hodlchi.help-penny.done", "1");
    }
    setMode("thanks");
  };

  const sendInterview = async () => {
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitInterviewSignup({
        data: { device_id: getDeviceId(), email: email.trim(), note: note.trim() || undefined },
      });
      if ("ok" in res && res.ok) {
        logEvent("interview_signup", { has_note: !!note.trim() });
        finish();
      } else {
        setError(("error" in res && res.error) || "Something went wrong");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const sendFeedback = async () => {
    if (!rating) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitProductFeedback({
        data: {
          device_id: getDeviceId(),
          rating,
          text: feedbackText.trim() || undefined,
          surface: "help_penny_grow",
        },
      });
      if ("ok" in res && res.ok) {
        logEvent("product_feedback", { rating, has_text: !!feedbackText.trim() });
        finish();
      } else {
        setError(("error" in res && res.error) || "Something went wrong");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === "closed") {
    return (
      <section className="mt-4 rounded-3xl bg-gradient-primary p-4 text-primary-foreground shadow-pop">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🌱</div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-extrabold">{t.title}</div>
            <div className="mt-0.5 text-[12px] font-semibold text-primary-foreground/85">
              {t.sub}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setMode("interview")}
                className="rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-primary-deep shadow-soft"
              >
                💬 {t.interview}
              </button>
              <button
                onClick={() => setMode("feedback")}
                className="rounded-full bg-foreground/85 px-3 py-1.5 text-[12px] font-bold text-primary"
              >
                ✏️ {t.feedback}
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("hodlchi.help-penny.done", "1");
                  }
                  setMode("thanks");
                }}
                className="rounded-full bg-transparent px-2 py-1.5 text-[11px] font-semibold text-primary-foreground/80 underline"
              >
                {t.later}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (mode === "thanks") {
    return (
      <section className="mt-4 rounded-3xl bg-white/85 p-4 text-center shadow-soft">
        <div className="text-2xl">💚</div>
        <div className="mt-1 text-sm font-semibold text-foreground/85">{t.thanks}</div>
      </section>
    );
  }

  return (
    <section className="mt-4 rounded-3xl bg-white p-4 shadow-pop">
      {mode === "interview" && (
        <div>
          <div className="font-display text-base font-extrabold">💬 {t.interview}</div>
          <div className="mt-1 text-[12px] font-semibold text-foreground/60">
            {locale === "es"
              ? "20 min. Te escribimos para agendar."
              : "20 min chat. We'll email you to book."}
          </div>
          <label className="mt-3 block text-[11px] font-bold uppercase tracking-widest text-foreground/60">
            {t.emailLabel}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-2xl border-2 border-foreground/15 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.notePlaceholder}
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border-2 border-foreground/15 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {error && <div className="mt-2 text-[11px] font-semibold text-red-600">{error}</div>}
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setMode("closed")}
              className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground/60"
            >
              {t.later}
            </button>
            <button
              onClick={sendInterview}
              disabled={submitting || !email.trim()}
              className="rounded-full bg-gradient-primary px-4 py-1.5 text-[12px] font-bold text-primary-foreground shadow-soft disabled:opacity-40"
            >
              {t.send}
            </button>
          </div>
        </div>
      )}

      {mode === "feedback" && (
        <div>
          <div className="font-display text-base font-extrabold">✏️ {t.feedback}</div>
          <div className="mt-2 text-[12px] font-bold uppercase tracking-widest text-foreground/60">
            {t.ratingPrompt}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { v: "love", label: "😍" },
              { v: "good", label: "🙂" },
              { v: "meh", label: "😐" },
              { v: "confusing", label: "😕" },
            ].map((r) => (
              <button
                key={r.v}
                onClick={() => setRating(r.v)}
                className={`rounded-full border-2 px-3 py-1.5 text-lg ${
                  rating === r.v ? "border-primary bg-primary/10" : "border-foreground/10 bg-white"
                }`}
                aria-label={r.v}
              >
                {r.label}
              </button>
            ))}
          </div>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={t.feedbackPlaceholder}
            rows={3}
            className="mt-3 w-full resize-none rounded-2xl border-2 border-foreground/15 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {error && <div className="mt-2 text-[11px] font-semibold text-red-600">{error}</div>}
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setMode("closed")}
              className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground/60"
            >
              {t.later}
            </button>
            <button
              onClick={sendFeedback}
              disabled={submitting || !rating}
              className="rounded-full bg-gradient-primary px-4 py-1.5 text-[12px] font-bold text-primary-foreground shadow-soft disabled:opacity-40"
            >
              {t.send}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
