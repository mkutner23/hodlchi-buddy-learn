// Procedural sound effects — Web Audio API only, no assets, no network.
// Every "instance" sound (pop / ding / xp / crunch / chirp) has 8–12 subtle
// variations (pitch, timing, harmonic jitter) so nothing ever sounds identical
// twice — the trick Duolingo / Animal Crossing / Mario use so your brain never
// gets tired of them. Penny also has a tiny set of wordless vocalizations
// (happy/sleepy/hungry/proud/excited/confused) so her voice becomes brand.
//
// The two "hero" moments — evolve sparkle & level-up fanfare — try to play a
// cached ElevenLabs clip first (fetched once from `/api/public/hero-sfx` and
// stored in-memory + localStorage), and fall back to the procedural version if
// the network isn't there or the clip hasn't loaded yet.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
let unlocked = false;
const STORAGE_KEY = "hodlchi-sfx-muted";
const HERO_CACHE_PREFIX = "hodlchi-hero-sfx-v2:";

if (typeof window !== "undefined") {
  try {
    muted = window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    /* ignore */
  }
}

// Create the AudioContext. On iOS/Android, this MUST happen inside a real user
// gesture — otherwise the context is created in a permanently-suspended state
// that later resume() calls cannot revive. `allowCreate` gates creation so
// timer-driven callers (idle animations, greeting delays) don't accidentally
// create a locked ctx before the user's first tap.
function getCtx(allowCreate = false): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    if (!allowCreate) return null;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 20;
    comp.ratio.value = 3;
    comp.attack.value = 0.003;
    comp.release.value = 0.15;
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(comp).connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function dest(): AudioNode {
  return master ?? getCtx(true)!.destination;
}


// ---------- small helpers ----------

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
// small pitch jitter in cents → ratio
const jitter = (cents: number) => Math.pow(2, rand(-cents, cents) / 1200);

interface ToneOptions {
  freq: number;
  endFreq?: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  attack?: number;
  release?: number;
  delay?: number;
  detune?: number;
  ramp?: "exp" | "lin";
}

function tone({
  freq,
  endFreq,
  duration,
  type = "sine",
  volume = 0.15,
  attack = 0.006,
  release,
  delay = 0,
  detune = 0,
  ramp = "exp",
}: ToneOptions) {
  const ac = getCtx(true);
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.detune.value = detune;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq !== undefined) {
    if (ramp === "lin") osc.frequency.linearRampToValueAtTime(endFreq, start + duration);
    else osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), start + duration);
  }
  const relStart = start + Math.max(attack, duration - (release ?? duration * 0.85));
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + attack);
  gain.gain.setValueAtTime(volume, relStart);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(dest());
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function bell({
  freq,
  duration = 0.6,
  volume = 0.14,
  delay = 0,
  shimmer = true,
  partial = 3.01,
}: {
  freq: number;
  duration?: number;
  volume?: number;
  delay?: number;
  shimmer?: boolean;
  partial?: number;
}) {
  const ac = getCtx(true);
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(dest());
  osc.start(start);
  osc.stop(start + duration + 0.02);
  if (shimmer) {
    const osc2 = ac.createOscillator();
    const g2 = ac.createGain();
    osc2.type = "sine";
    osc2.frequency.value = freq * partial;
    g2.gain.setValueAtTime(0.0001, start);
    g2.gain.exponentialRampToValueAtTime(volume * 0.35, start + 0.005);
    g2.gain.exponentialRampToValueAtTime(0.0001, start + duration * 0.7);
    osc2.connect(g2).connect(dest());
    osc2.start(start);
    osc2.stop(start + duration + 0.02);
  }
}

function noiseBurst(
  duration: number,
  volume = 0.08,
  filterFreq = 2000,
  delay = 0,
  filterType: BiquadFilterType = "lowpass",
  q = 0.7,
) {
  const ac = getCtx(true);
  if (!ac) return;
  const start = ac.currentTime + delay;
  const bufferSize = Math.max(1, Math.floor(ac.sampleRate * duration));
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;
  filter.Q.value = q;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter).connect(gain).connect(dest());
  src.start(start);
  src.stop(start + duration + 0.02);
}

function woodClick(delay = 0, volume = 0.09, freq = 3200) {
  noiseBurst(0.018, volume, freq, delay, "bandpass", 4);
}

function play(fn: () => void) {
  if (muted) return;
  // Don't create an AudioContext outside a real user gesture — iOS locks any
  // context created from a timer/effect callback and later `resume()` calls
  // can't revive it. Skip until the first real tap has unlocked audio.
  if (!unlocked) return;
  try {
    fn();
  } catch {
    /* audio failures are non-fatal */
  }
}


// ---------- Hero-moment sample cache (ElevenLabs) ----------

type HeroKey = "sparkle" | "levelUp";
const heroBuffers: Partial<Record<HeroKey, AudioBuffer>> = {};
const heroFetching: Partial<Record<HeroKey, Promise<void>>> = {};

async function decodeToBuffer(ac: AudioContext, bytes: ArrayBuffer): Promise<AudioBuffer> {
  return await new Promise((resolve, reject) => {
    // Safari needs the callback form.
    ac.decodeAudioData(bytes.slice(0), resolve, reject);
  });
}

function b64ToBytes(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

async function ensureHero(key: HeroKey) {
  if (heroBuffers[key]) return;
  if (heroFetching[key]) return heroFetching[key];
  if (typeof window === "undefined") return;
  heroFetching[key] = (async () => {
    const ac = getCtx(true);
    if (!ac) return;
    // 1. try localStorage
    try {
      const cached = window.localStorage.getItem(HERO_CACHE_PREFIX + key);
      if (cached) {
        const buf = await decodeToBuffer(ac, b64ToBytes(cached));
        heroBuffers[key] = buf;
        return;
      }
    } catch {
      /* ignore */
    }
    // 2. fetch from server
    try {
      const res = await fetch(`/api/public/hero-sfx?name=${key}`);
      if (!res.ok) return;
      const bytes = await res.arrayBuffer();
      const buf = await decodeToBuffer(ac, bytes);
      heroBuffers[key] = buf;
      // cache
      try {
        let bin = "";
        const view = new Uint8Array(bytes);
        for (let i = 0; i < view.length; i++) bin += String.fromCharCode(view[i]);
        window.localStorage.setItem(HERO_CACHE_PREFIX + key, btoa(bin));
      } catch {
        /* quota — skip */
      }
    } catch {
      /* offline / no key — fall back to procedural */
    }
  })();
  return heroFetching[key];
}

function playHero(key: HeroKey, volume = 0.9): boolean {
  const ac = getCtx(true);
  const buf = heroBuffers[key];
  if (!ac || !buf) return false;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const g = ac.createGain();
  g.gain.value = volume;
  src.connect(g).connect(dest());
  src.start();
  return true;
}

// Mobile browsers (iOS Safari, Android Chrome) require the AudioContext to be
// created AND resumed inside a user gesture. We defer both context creation
// and hero-sample prefetch until the first tap/click/keypress anywhere.
if (typeof window !== "undefined") {
  const unlock = () => {
    const ac = getCtx(true); // creates + resumes inside the gesture
    if (ac && ac.state === "suspended") ac.resume().catch(() => {});
    // Play a near-silent buffer to fully unlock iOS audio output.
    try {
      if (ac) {
        const buf = ac.createBuffer(1, 1, 22050);
        const src = ac.createBufferSource();
        src.buffer = buf;
        src.connect(ac.destination);
        src.start(0);
      }
    } catch {
      /* ignore */
    }
    ensureHero("sparkle");
    ensureHero("levelUp");
    window.removeEventListener("touchend", unlock);
    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("click", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("touchend", unlock, { once: false, passive: true });
  window.addEventListener("touchstart", unlock, { once: false, passive: true });
  window.addEventListener("click", unlock, { once: false });
  window.addEventListener("keydown", unlock, { once: false });
}

// ---------- Procedural voices (with variation) ----------

// Bubble/pop tap. 10 variants — different click freq, bubble pitch center, tail.
function proceduralPop() {
  const clickFreq = rand(2600, 3600);
  const bubbleBase = rand(560, 700);
  const bubbleEnd = bubbleBase * rand(1.35, 1.55);
  const overtone = bubbleEnd * rand(1.9, 2.15);
  woodClick(0, 0.07, clickFreq);
  tone({ freq: bubbleBase, endFreq: bubbleEnd, duration: 0.07, type: "sine", volume: 0.09, delay: 0.005 });
  tone({ freq: overtone, duration: 0.05, type: "sine", volume: 0.04, delay: 0.005 });
}

// Correct-answer ding. Variants pick from a small set of "sparkle" note pairs
// within C major and re-jitter the shimmer envelope.
const DING_PAIRS: Array<[number, number]> = [
  [659.25, 987.77], // E5 → B5
  [698.46, 1046.5], // F5 → C6
  [783.99, 1174.66], // G5 → D6
  [880.0, 1318.51], // A5 → E6
  [739.99, 1108.73], // F#5 → C#6
];
function proceduralDing() {
  const [n1, n2] = pick(DING_PAIRS);
  const j = jitter(8);
  woodClick(0, 0.08, rand(2800, 3400));
  bell({ freq: n1 * j, duration: 0.42, volume: 0.15, delay: 0.02 });
  bell({ freq: n2 * j, duration: 0.5, volume: 0.13, delay: rand(0.09, 0.13) });
  // Shimmer tail — 20% longer than before, per feedback.
  const ac = getCtx(true);
  if (ac) {
    const dur = 0.32;
    const start = ac.currentTime + 0.18;
    const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buf;
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 8;
    const fStart = rand(2800, 3200);
    f.frequency.setValueAtTime(fStart, start);
    f.frequency.exponentialRampToValueAtTime(fStart * rand(2.4, 3.1), start + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.05, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(f).connect(g).connect(dest());
    src.start(start);
    src.stop(start + dur + 0.02);
  }
}

// Downward marimba — a few tuning variants inside F major/minor territory.
const WRONG_PAIRS: Array<[number, number]> = [
  [349.23, 261.63], // F4 → C4
  [329.63, 246.94], // E4 → B3
  [369.99, 277.18], // F#4 → C#4
  [311.13, 233.08], // Eb4 → Bb3
];
function proceduralWrong() {
  const [n1, n2] = pick(WRONG_PAIRS);
  bell({ freq: n1, duration: 0.35, volume: 0.11, shimmer: false });
  bell({ freq: n2, duration: 0.42, volume: 0.09, delay: 0.09, shimmer: false });
  noiseBurst(0.14, 0.035, 500, 0.18, "lowpass", 0.7);
}

// Crunch — layered "wooden bite" using two short bandpass noise transients
// plus a tiny wooden knock for the initial break. More texture, less "digital".
function proceduralCrunch() {
  const ac = getCtx(true);
  if (!ac) return;
  // Initial break — a wooden knock (short bandpass noise).
  noiseBurst(0.03, 0.14, rand(1400, 2000), 0, "bandpass", 6);
  // Cracker/cookie body — mid noise with a light pitch drop.
  noiseBurst(0.07, 0.11, rand(900, 1300), 0.02, "bandpass", 2.5);
  // Wet chew tail — quieter low noise.
  noiseBurst(0.08, 0.07, rand(400, 700), 0.06, "lowpass", 1);
  // Micro-crackles — 2–4 tiny bandpass ticks in the tail for texture.
  const crackles = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < crackles; i++) {
    noiseBurst(0.008, rand(0.03, 0.06), rand(2500, 5500), rand(0.03, 0.13), "bandpass", 8);
  }
}

// XP — magic coin. Brighter than v2 + shimmer harmonics + tiny star ping.
const XP_ROOTS = [1568, 1661.22, 1760, 1567.98]; // G6, G#6, A6, G6
function proceduralXp() {
  const root = pick(XP_ROOTS) * jitter(10);
  // Coin body (bright square).
  tone({ freq: root, duration: 0.08, type: "square", volume: 0.06 });
  tone({ freq: root * 1.335, duration: 0.14, type: "square", volume: 0.06, delay: 0.06 }); // ~perfect 4th up
  // Glass shimmer higher partials — three bells instead of two.
  bell({ freq: root * 1.68, duration: 0.32, volume: 0.07, delay: 0.02, partial: 3.5 });
  bell({ freq: root * 2.0, duration: 0.3, volume: 0.06, delay: 0.09, partial: 4.0 });
  bell({ freq: root * 2.52, duration: 0.28, volume: 0.05, delay: 0.14, partial: 4.5 });
  // Tiny "star" high ping for the magical top.
  bell({ freq: root * 3.0, duration: 0.22, volume: 0.04, delay: 0.18, partial: 2.0 });
}

// Chirp — Penny idle pet chirp. Variants tweak sweep range, formant, tail.
function proceduralChirp() {
  const base = rand(1300, 1550);
  const peak = base * rand(1.4, 1.6);
  tone({ freq: base, endFreq: peak, duration: 0.09, type: "triangle", volume: 0.11 });
  tone({ freq: peak * 0.95, endFreq: base * 1.05, duration: 0.08, type: "triangle", volume: 0.09, delay: 0.08 });
  tone({ freq: rand(850, 950), endFreq: rand(1250, 1400), duration: 0.05, type: "sine", volume: 0.06, delay: 0.14 });
}

// ---------- Penny wordless vocalizations (formant-shaped blips) ----------
// Very short (0.15–0.4s), triangle+sine layered, no words — pure emotion.
// Each mood has 2–3 micro-variants for variation.

interface PennyVoice {
  base: number;      // starting pitch (Hz)
  end: number;       // ending pitch (Hz)
  duration: number;  // seconds
  wobble?: number;   // small vibrato depth in Hz
  breath?: boolean;  // add tiny breathy noise
}
function pennyVoice({ base, end, duration, wobble = 0, breath = false }: PennyVoice) {
  const ac = getCtx(true);
  if (!ac) return;
  const start = ac.currentTime;
  const osc = ac.createOscillator();
  const osc2 = ac.createOscillator(); // 2nd formant an octave up, quieter
  const gain = ac.createGain();
  const gain2 = ac.createGain();
  osc.type = "triangle";
  osc2.type = "sine";
  osc.frequency.setValueAtTime(base, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, end), start + duration);
  osc2.frequency.setValueAtTime(base * 2, start);
  osc2.frequency.exponentialRampToValueAtTime(Math.max(20, end * 2), start + duration);
  // Small vibrato via detune LFO.
  if (wobble > 0) {
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    lfo.frequency.value = 6;
    lfoGain.gain.value = wobble;
    lfo.connect(lfoGain).connect(osc.detune);
    lfo.start(start);
    lfo.stop(start + duration + 0.02);
  }
  // Attack + release envelope — quick in, gentle out.
  const atk = 0.02;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.14, start + atk);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  gain2.gain.setValueAtTime(0.0001, start);
  gain2.gain.exponentialRampToValueAtTime(0.05, start + atk);
  gain2.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(dest());
  osc2.connect(gain2).connect(dest());
  osc.start(start);
  osc.stop(start + duration + 0.02);
  osc2.start(start);
  osc2.stop(start + duration + 0.02);
  if (breath) noiseBurst(duration * 0.9, 0.02, 1200, 0, "bandpass", 2);
}

const PENNY_VARIANTS: Record<
  "happy" | "sleepy" | "hungry" | "proud" | "excited" | "confused",
  PennyVoice[]
> = {
  // "mm!" — short, rising.
  happy: [
    { base: 520, end: 720, duration: 0.22, wobble: 4 },
    { base: 560, end: 780, duration: 0.24, wobble: 3 },
    { base: 500, end: 700, duration: 0.2, wobble: 5 },
  ],
  // "yawn..." — long, downward, breathy.
  sleepy: [
    { base: 380, end: 240, duration: 0.42, wobble: 2, breath: true },
    { base: 360, end: 220, duration: 0.4, wobble: 3, breath: true },
  ],
  // "mmm..." — mid, dips down then back up slightly.
  hungry: [
    { base: 400, end: 360, duration: 0.34, wobble: 6 },
    { base: 420, end: 380, duration: 0.32, wobble: 5 },
    { base: 380, end: 340, duration: 0.36, wobble: 7 },
  ],
  // "hm!" — short punchy, small pitch rise.
  proud: [
    { base: 480, end: 620, duration: 0.18, wobble: 2 },
    { base: 500, end: 640, duration: 0.2, wobble: 3 },
  ],
  // "eee!" — bright, higher, rising fast.
  excited: [
    { base: 680, end: 1020, duration: 0.2, wobble: 8 },
    { base: 720, end: 1080, duration: 0.22, wobble: 7 },
    { base: 660, end: 980, duration: 0.18, wobble: 9 },
  ],
  // "huh?" — dip then rise (question intonation).
  confused: [
    { base: 500, end: 640, duration: 0.28, wobble: 3 },
    { base: 480, end: 620, duration: 0.3, wobble: 4 },
  ],
};

// ---------- Hero moments (ElevenLabs preferred, procedural fallback) ----------

function proceduralSparkle() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
  notes.forEach((f, i) => bell({ freq: f, duration: 0.55, volume: 0.11, delay: i * 0.06 }));
  tone({
    freq: 220,
    endFreq: 660,
    duration: 0.7,
    type: "sawtooth",
    volume: 0.05,
    attack: 0.15,
    ramp: "lin",
  });
  bell({ freq: 2093, duration: 0.5, volume: 0.13, delay: 0.6 });
  bell({ freq: 2637, duration: 0.5, volume: 0.11, delay: 0.68 });
  noiseBurst(0.35, 0.04, 6000, 0.62, "bandpass", 6);
}

function proceduralLevelUp() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
  notes.forEach((f, i) => bell({ freq: f, duration: 0.5, volume: 0.15, delay: i * 0.08 }));
  tone({ freq: 261.63, duration: 0.9, type: "triangle", volume: 0.06, attack: 0.05, delay: 0.05 });
  tone({ freq: 392, duration: 0.9, type: "triangle", volume: 0.05, attack: 0.05, delay: 0.05 });
  bell({ freq: 1975.53, duration: 0.6, volume: 0.14, delay: 0.55 });
  bell({ freq: 2637, duration: 0.6, volume: 0.11, delay: 0.63 });
  noiseBurst(0.4, 0.045, 7000, 0.55, "bandpass", 6);
}

// ---------- Public API ----------

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

  pop: () => play(proceduralPop),
  ding: () => play(proceduralDing),
  wrong: () => play(proceduralWrong),
  crunch: () => play(proceduralCrunch),
  xp: () => play(proceduralXp),
  chirp: () => play(proceduralChirp),

  // Hero moments — try ElevenLabs sample first, fall back to procedural.
  sparkle: () =>
    play(() => {
      ensureHero("sparkle");
      if (!playHero("sparkle", 0.85)) proceduralSparkle();
    }),
  levelUp: () =>
    play(() => {
      ensureHero("levelUp");
      if (!playHero("levelUp", 0.85)) proceduralLevelUp();
    }),

  // Penny's voice — wordless vocalizations, tied to mood.
  penny: {
    happy: () => play(() => pennyVoice(pick(PENNY_VARIANTS.happy))),
    sleepy: () => play(() => pennyVoice(pick(PENNY_VARIANTS.sleepy))),
    hungry: () => play(() => pennyVoice(pick(PENNY_VARIANTS.hungry))),
    proud: () => play(() => pennyVoice(pick(PENNY_VARIANTS.proud))),
    excited: () => play(() => pennyVoice(pick(PENNY_VARIANTS.excited))),
    confused: () => play(() => pennyVoice(pick(PENNY_VARIANTS.confused))),
  },
};
