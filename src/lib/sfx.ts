// Tiny procedural sound effects powered by the Web Audio API.
// No assets — sounds are synthesised on the fly so they load instantly and
// stay under a few kilobytes of code. Every sound is short (<400ms), soft,
// and designed to feel like Duolingo: pop, ding, crunch, sparkle, chirp.

let ctx: AudioContext | null = null;
let muted = false;
const STORAGE_KEY = "hodlchi-sfx-muted";

if (typeof window !== "undefined") {
  try {
    muted = window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    /* ignore */
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

interface ToneOptions {
  freq: number;
  endFreq?: number;
  duration: number; // seconds
  type?: OscillatorType;
  volume?: number; // 0..1
  attack?: number; // seconds
  delay?: number; // seconds to wait before playing
}

function tone({
  freq,
  endFreq,
  duration,
  type = "sine",
  volume = 0.15,
  attack = 0.005,
  delay = 0,
}: ToneOptions) {
  const ac = getCtx();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), start + duration);
  }
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noiseBurst(duration: number, volume = 0.08, filterFreq = 2000, delay = 0) {
  const ac = getCtx();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const bufferSize = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = filterFreq;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(start);
  src.stop(start + duration + 0.02);
}

function play(fn: () => void) {
  if (muted) return;
  try {
    fn();
  } catch {
    /* audio failures are non-fatal */
  }
}

export const sfx = {
  isMuted: () => muted,
  setMuted(next: boolean) {
    muted = next;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
    }
  },
  toggle() {
    this.setMuted(!muted);
    return muted;
  },

  // A soft UI pop for taps / selections.
  pop: () =>
    play(() =>
      tone({ freq: 520, endFreq: 780, duration: 0.09, type: "sine", volume: 0.12 }),
    ),

  // Correct answer: cheerful two-note ding.
  ding: () =>
    play(() => {
      tone({ freq: 880, duration: 0.12, type: "triangle", volume: 0.16 });
      tone({ freq: 1318, duration: 0.18, type: "triangle", volume: 0.14, delay: 0.09 });
    }),

  // Wrong answer: gentle, non-punishing low blip.
  wrong: () =>
    play(() => {
      tone({ freq: 320, endFreq: 180, duration: 0.22, type: "sine", volume: 0.14 });
    }),

  // Fruit crunch — a filtered noise burst.
  crunch: () =>
    play(() => {
      noiseBurst(0.09, 0.14, 1400);
      noiseBurst(0.07, 0.1, 900, 0.06);
    }),

  // XP pop — quick rising blip.
  xp: () =>
    play(() =>
      tone({ freq: 660, endFreq: 1200, duration: 0.16, type: "triangle", volume: 0.14 }),
    ),

  // Happy chirp for Penny greetings / hatching.
  chirp: () =>
    play(() => {
      tone({ freq: 1200, endFreq: 1800, duration: 0.09, type: "sine", volume: 0.12 });
      tone({ freq: 1600, endFreq: 2200, duration: 0.09, type: "sine", volume: 0.1, delay: 0.08 });
    }),

  // Sparkle — arpeggio for evolution / milestone.
  sparkle: () =>
    play(() => {
      const notes = [784, 988, 1175, 1568, 1976];
      notes.forEach((f, i) =>
        tone({ freq: f, duration: 0.18, type: "triangle", volume: 0.13, delay: i * 0.06 }),
      );
    }),

  // Level-up fanfare — used at lesson completion.
  levelUp: () =>
    play(() => {
      const notes = [523, 659, 784, 1046];
      notes.forEach((f, i) =>
        tone({ freq: f, duration: 0.2, type: "triangle", volume: 0.15, delay: i * 0.09 }),
      );
    }),
};
