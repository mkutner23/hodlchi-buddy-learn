import { trackEvents } from "./analytics.functions";

const DEVICE_ID_KEY = "hodlchi.device_id";
const QUEUE_KEY = "hodlchi.analytics.queue";
const FLUSH_MS = 2500;
const MAX_BATCH = 20;

type QueuedEvent = {
  name: string;
  meta?: Record<string, string | number | boolean | null>;
  ts: number;
};

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "d-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getDeviceId(): string {
  if (!isBrowser()) return "server";
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}

function loadQueue(): QueuedEvent[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQueue(q: QueuedEvent[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-200)));
  } catch {
    /* ignore quota */
  }
}

let queue: QueuedEvent[] = [];
let timer: number | null = null;
let flushing = false;
let initialized = false;

function scheduleFlush() {
  if (!isBrowser() || timer !== null) return;
  timer = window.setTimeout(() => {
    timer = null;
    void flush();
  }, FLUSH_MS);
}

async function flush() {
  if (!isBrowser() || flushing || queue.length === 0) return;
  flushing = true;
  const batch = queue.slice(0, MAX_BATCH);
  const locale = window.location.pathname.startsWith("/es") ? "es" : "en";
  try {
    const res = await trackEvents({
      data: {
        device_id: getDeviceId(),
        locale,
        path: window.location.pathname.slice(0, 200),
        events: batch.map((e) => ({ name: e.name, meta: e.meta, ts: e.ts })),
      },
    });
    if ((res as { ok?: boolean }).ok) {
      queue = queue.slice(batch.length);
      saveQueue(queue);
    }
  } catch {
    // Network hiccup — leave the queue and retry on the next event/flush.
  } finally {
    flushing = false;
    if (queue.length > 0) scheduleFlush();
  }
}

export function trackEvent(name: string, meta?: QueuedEvent["meta"]) {
  if (!isBrowser()) return;
  queue.push({ name, meta, ts: Date.now() });
  saveQueue(queue);
  scheduleFlush();
}

export function initAnalyticsSink() {
  if (!isBrowser() || initialized) return;
  initialized = true;
  queue = loadQueue();

  // Best-effort flush on hide/unload so events aren't lost on tab close.
  const finalFlush = () => {
    void flush();
  };
  window.addEventListener("pagehide", finalFlush);
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") finalFlush();
  });

  if (queue.length > 0) scheduleFlush();
}
