import { useGame } from "./store";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: GainNode | null = null;
let ambTimer = 0;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
  }
  return ctx;
}

function out(): GainNode | null {
  const c = ac();
  if (!c || !master) return null;
  master.gain.value = useGame.getState().muted ? 0 : 0.7;
  return master;
}

function beep(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain = 0.08,
  when = 0,
  filterHz?: number,
) {
  const c = ac();
  const dest = out();
  if (!c || !dest) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  if (filterHz) {
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = filterHz;
    osc.connect(f);
    f.connect(g);
  } else {
    osc.connect(g);
  }
  g.connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  async unlock() {
    const c = ac();
    if (c && c.state === "suspended") await c.resume();
  },
  door() {
    beep(140, 0.28, "square", 0.05, 0, 600);
    beep(90, 0.4, "sawtooth", 0.04, 0.02, 400);
  },
  sit() {
    beep(180, 0.18, "sine", 0.06, 0, 700);
    beep(110, 0.22, "triangle", 0.04, 0.04, 500);
  },
  stand() {
    beep(220, 0.12, "sine", 0.05, 0, 900);
  },
  lamp() {
    beep(520, 0.08, "sine", 0.04);
  },
  type() {
    beep(640 + Math.random() * 80, 0.04, "square", 0.025, 0, 1800);
  },
  foot(step: number) {
    const f = step % 2 === 0 ? 90 : 110;
    beep(f, 0.09, "triangle", 0.05, 0, 280);
  },
  tickAmbient(dt: number) {
    ambTimer += dt;
    if (ambTimer < 4.5) return;
    ambTimer = 0;
    if (useGame.getState().phase === "title") return;
    beep(48 + Math.random() * 8, 1.6, "sine", 0.02, 0, 120);
  },
  startPad() {
    const c = ac();
    const dest = out();
    if (!c || !dest || ambient) return;
    ambient = c.createGain();
    ambient.gain.value = 0.03;
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 55;
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 180;
    osc.connect(f);
    f.connect(ambient);
    ambient.connect(dest);
    osc.start();
  },
};
