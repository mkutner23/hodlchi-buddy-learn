// Procedural sound effects — Web Audio API only, no assets, no network.
// Redesigned to feel Nintendo / Duolingo / Animal Crossing: layered voices
// (wood click + bell + shimmer, coin + chime, downward marimba + puff, etc.)
// so every sound carries *emotion*, not just information. All sounds share a
// master gain + gentle compressor so layered voices stay warm, never harsh.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
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
  return master ?? getCtx()!.destination;
}

interface ToneOptions {
  freq: number;
  endFreq?: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  attack?: number;
  release?: number; // fraction of duration used for tail
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
  const ac = getCtx();
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

// A plucked-bell / marimba-ish voice: sine with a very fast attack and a long
// gentle exponential tail. Layer a fifth above at low volume for shimmer.
function bell({
  freq,
  duration = 0.6,
  volume = 0.14,
  delay = 0,
  shimmer = true,
}: {
  freq: number;
  duration?: number;
  volume?: number;
  delay?: number;
  shimmer?: boolean;
}) {
  const ac = getCtx();
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
    osc2.frequency.value = freq * 3.01; // inharmonic partial → glassy
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
  const ac = getCtx();
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

// Tiny wooden click — very short filtered noise transient. Great as the
// "attack" layer on taps and successes so they feel physical.
function woodClick(delay = 0, volume = 0.09) {
  noiseBurst(0.018, volume, 3200, delay, "bandpass", 4);
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

  // Button tap: Animal-Crossing menu — tiny wooden click + bubble pop.
  pop: () =>
    play(() => {
      woodClick(0, 0.07);
      tone({ freq: 620, endFreq: 880, duration: 0.07, type: "sine", volume: 0.09, delay: 0.005 });
      tone({ freq: 1240, duration: 0.05, type: "sine", volume: 0.04, delay: 0.005 });
    }),

  // Correct answer: wooden click → two rising sparkling bells → shimmer tail.
  // Feels clever, not lucky.
  ding: () =>
    play(() => {
      woodClick(0, 0.08);
      // Two-note bell rise (E5 → B5), a bright perfect-fifth.
      bell({ freq: 659.25, duration: 0.42, volume: 0.15, delay: 0.02 });
      bell({ freq: 987.77, duration: 0.5, volume: 0.13, delay: 0.11 });
      // Magical shimmer tail: filtered noise sweep.
      const ac = getCtx();
      if (ac) {
        const start = ac.currentTime + 0.18;
        const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.25), ac.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = ac.createBufferSource();
        src.buffer = buf;
        const f = ac.createBiquadFilter();
        f.type = "bandpass";
        f.Q.value = 8;
        f.frequency.setValueAtTime(3000, start);
        f.frequency.exponentialRampToValueAtTime(8000, start + 0.25);
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(0.05, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
        src.connect(f).connect(g).connect(dest());
        src.start(start);
        src.stop(start + 0.27);
      }
    }),

  // Wrong answer: gentle downward marimba pluck + tiny muted puff. "...oops."
  wrong: () =>
    play(() => {
      bell({ freq: 349.23, duration: 0.35, volume: 0.11, shimmer: false }); // F4
      bell({ freq: 261.63, duration: 0.42, volume: 0.09, delay: 0.09, shimmer: false }); // C4
      noiseBurst(0.14, 0.035, 500, 0.18, "lowpass", 0.7); // muted puff
    }),

  // Fruit crunch — layered noise for a juicy bite. Slightly softened.
  crunch: () =>
    play(() => {
      noiseBurst(0.07, 0.12, 1600, 0, "lowpass", 1);
      noiseBurst(0.06, 0.09, 800, 0.05, "lowpass", 1);
    }),

  // XP earned: tiny shower of magical coins — glassy harmonics rising fast.
  xp: () =>
    play(() => {
      // Coin ping (classic Mario-ish two-note but tuned bright and short).
      tone({ freq: 1568, duration: 0.08, type: "square", volume: 0.06 }); // G6
      tone({ freq: 2093, duration: 0.14, type: "square", volume: 0.06, delay: 0.06 }); // C7
      // Glass shimmer above.
      bell({ freq: 2637, duration: 0.32, volume: 0.07, delay: 0.02 }); // E7
      bell({ freq: 3136, duration: 0.28, volume: 0.05, delay: 0.09 }); // G7
    }),

  // Pet Penny: baby red-panda chirp — tiny whistle + soft pop.
  chirp: () =>
    play(() => {
      // Quick "brrrp!" whistle sweep.
      tone({
        freq: 1400,
        endFreq: 2100,
        duration: 0.09,
        type: "triangle",
        volume: 0.11,
      });
      tone({
        freq: 1900,
        endFreq: 1500,
        duration: 0.08,
        type: "triangle",
        volume: 0.09,
        delay: 0.08,
      });
      // Soft pop tail.
      tone({ freq: 900, endFreq: 1300, duration: 0.05, type: "sine", volume: 0.06, delay: 0.14 });
    }),

  // Evolution sparkle: shimmering crystal arpeggio + rising swell + burst.
  // Pokémon-evolution feeling compressed into ~1s.
  sparkle: () =>
    play(() => {
      // Shimmering crystal arpeggio (C major, ascending, glassy bells).
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      notes.forEach((f, i) =>
        bell({ freq: f, duration: 0.55, volume: 0.11, delay: i * 0.06 }),
      );
      // Rising orchestral swell underneath.
      tone({
        freq: 220,
        endFreq: 660,
        duration: 0.7,
        type: "sawtooth",
        volume: 0.05,
        attack: 0.15,
        ramp: "lin",
      });
      // Triumphant sparkle burst at the top.
      bell({ freq: 2093, duration: 0.5, volume: 0.13, delay: 0.6 });
      bell({ freq: 2637, duration: 0.5, volume: 0.11, delay: 0.68 });
      noiseBurst(0.35, 0.04, 6000, 0.62, "bandpass", 6);
    }),

  // Level-up / milestone: Mario-Star sized. Bright bells → crescendo → sparkle.
  levelUp: () =>
    play(() => {
      // Bright bell fanfare: C E G C rising major arpeggio, twice.
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((f, i) =>
        bell({ freq: f, duration: 0.5, volume: 0.15, delay: i * 0.08 }),
      );
      // Warm synth harmony pad.
      tone({
        freq: 261.63,
        duration: 0.9,
        type: "triangle",
        volume: 0.06,
        attack: 0.05,
        delay: 0.05,
      });
      tone({
        freq: 392,
        duration: 0.9,
        type: "triangle",
        volume: 0.05,
        attack: 0.05,
        delay: 0.05,
      });
      // Celebratory sparkle tail.
      bell({ freq: 1975.53, duration: 0.6, volume: 0.14, delay: 0.55 });
      bell({ freq: 2637, duration: 0.6, volume: 0.11, delay: 0.63 });
      noiseBurst(0.4, 0.045, 7000, 0.55, "bandpass", 6);
    }),
};
