/**
 * Sons sintetizados no navegador com Web Audio (sem arquivos de áudio).
 * Só toca depois de um clique/toque do visitante.
 */
let ctx: AudioContext | null = null;

function audio() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Nota de "piano elétrico": triângulo + harmônico suave, com decaimento. */
export function playKey(freq: number) {
  const c = audio();
  const now = c.currentTime;
  const out = c.createGain();
  out.gain.setValueAtTime(0, now);
  out.gain.linearRampToValueAtTime(0.22, now + 0.008);
  out.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
  out.connect(c.destination);

  for (const [mult, type, level] of [
    [1, "triangle", 1],
    [2, "sine", 0.25],
  ] as const) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq * mult;
    g.gain.value = level;
    osc.connect(g).connect(out);
    osc.start(now);
    osc.stop(now + 1.35);
  }
}

/** Corda dedilhada (algoritmo Karplus-Strong). */
export function pluck(freq: number) {
  const c = audio();
  const rate = c.sampleRate;
  const length = Math.floor(rate * 1.8);
  const buffer = c.createBuffer(1, length, rate);
  const data = buffer.getChannelData(0);

  const period = Math.max(2, Math.round(rate / freq));
  const ring = new Float32Array(period);
  for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;

  let idx = 0;
  for (let i = 0; i < length; i++) {
    const next = (idx + 1) % period;
    const value = ring[idx];
    data[i] = value;
    ring[idx] = 0.996 * 0.5 * (value + ring[next]);
    idx = next;
  }

  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  gain.gain.value = 0.3;
  src.connect(gain).connect(c.destination);
  src.start();
}
