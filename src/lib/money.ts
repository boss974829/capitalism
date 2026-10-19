import type { Rung } from "@/data/capital";

export function hashSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) / 4294967296) * Math.PI * 2;
}

const seeds = new Map<string, number>();

export function seedOf(id: string): number {
  let s = seeds.get(id);
  if (s === undefined) {
    s = hashSeed(id);
    seeds.set(id, s);
  }
  return s;
}

/** Drift around a public anchor. Zero at t = 0. Not an exchange feed. */
export function liveWorth(base: number, vol: number, t: number, seed: number): number {
  if (vol <= 0 || base <= 0) return base;
  const amp = base * vol * 0.015;
  const wave = (period: number, phase: number, weight: number) =>
    weight * (Math.sin(t / period + phase) - Math.sin(phase));
  const wobble = wave(90, seed, 0.55) + wave(240, seed * 1.7, 0.3) + wave(28, seed * 0.6, 0.15);
  return Math.max(base * 0.5, base + wobble * amp);
}

export function worthNow(rung: Pick<Rung, "id" | "netWorth" | "volatility">, elapsed: number): number {
  return liveWorth(rung.netWorth, rung.volatility, elapsed, seedOf(rung.id));
}

export function velocity(rung: Pick<Rung, "id" | "netWorth" | "volatility">, elapsed: number): number {
  const a = worthNow(rung, Math.max(0, elapsed - 0.5));
  const b = worthNow(rung, elapsed + 0.5);
  return b - a;
}

export function formatUSD(n: number): string {
  const sign = n < 0 ? "−" : "";
  const v = Math.abs(n);
  if (v >= 1e12) return `${sign}$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${sign}$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${sign}$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1000) return `${sign}$${Math.round(v).toLocaleString("en-US")}`;
  return `${sign}$${v.toFixed(2)}`;
}

export function formatFullUSD(n: number): string {
  const sign = n < 0 ? "−" : "";
  const v = Math.abs(n);
  if (v >= 1000) return `${sign}$${Math.round(v).toLocaleString("en-US")}`;
  return `${sign}$${v.toFixed(2)}`;
}

export function formatDelta(n: number): string {
  if (Math.abs(n) < 1) return "$0";
  const body = formatUSD(Math.abs(n));
  return n > 0 ? `+${body}` : `−${body}`;
}

export function formatRate(perSec: number): string {
  const sign = perSec < 0 ? "−" : "";
  const v = Math.abs(perSec);
  if (v >= 1e6) return `${sign}$${(v / 1e6).toFixed(2)}M/s`;
  if (v >= 1000) return `${sign}$${(v / 1000).toFixed(1)}k/s`;
  if (v >= 1) return `${sign}$${v.toFixed(2)}/s`;
  if (v >= 0.01) return `${sign}$${v.toFixed(3)}/s`;
  return `${sign}$${v.toFixed(4)}/s`;
}

export function formatAccrual(n: number): string {
  const sign = n < 0 ? "−" : "";
  const v = Math.abs(n);
  if (v >= 1000) return formatUSD(n);
  if (v >= 1) return `${sign}$${v.toFixed(2)}`;
  return `${sign}$${v.toFixed(4)}`;
}

export function formatHourly(annual: number): string {
  const h = annual / 2080;
  if (h >= 100) return `$${Math.round(h).toLocaleString("en-US")}/hr`;
  return `$${h.toFixed(2)}/hr`;
}

export function formatYears(years: number): string {
  if (!Number.isFinite(years)) return "—";
  if (years < 1 / 12) return "under a month";
  if (years < 1) {
    const months = Math.max(1, Math.round(years * 12));
    return months === 1 ? "1 month" : `${months} months`;
  }
  if (years < 10) return `${years.toFixed(1)} years`;
  if (years < 10_000) return `${Math.round(years).toLocaleString("en-US")} years`;
  if (years < 1_000_000) return `${(years / 1000).toFixed(1)} thousand years`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} million years`;
  return `${(years / 1_000_000_000).toFixed(2)} billion years`;
}

export function formatCount(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const v = Math.abs(n);
  if (v < 10) return v.toFixed(1);
  if (v < 1000) return Math.round(v).toLocaleString("en-US");
  if (v < 1_000_000) return `${(v / 1000).toFixed(1)} thousand`;
  if (v < 1_000_000_000) return `${(v / 1_000_000).toFixed(1)} million`;
  return `${(v / 1_000_000_000).toFixed(2)} billion`;
}

export function formatTimes(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n < 10) return `${n.toFixed(1)}×`;
  if (n < 1_000_000) return `${Math.round(n).toLocaleString("en-US")}×`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(1)} million×`;
  if (n < 1_000_000_000_000) return `${Math.round(n / 1_000_000_000)} billion×`;
  return `${(n / 1_000_000_000_000).toFixed(2)} trillion×`;
}

export function perSecondPay(annual: number): number {
  return annual / (365.25 * 24 * 3600);
}

export function yearsOfPay(target: number, annual: number): number {
  if (annual <= 0) return Infinity;
  return target / annual;
}

export function barPercent(value: number, top: number, scale: "log" | "linear"): number {
  if (value <= 0 || top <= 0) return 0;
  if (scale === "linear") return Math.min(100, (value / top) * 100);
  const lo = Math.log10(8);
  const hi = Math.log10(Math.max(top, 9));
  const v = Math.log10(Math.max(8, value));
  if (hi <= lo) return 0;
  return Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100));
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function clampMoney(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, 5e12);
}
