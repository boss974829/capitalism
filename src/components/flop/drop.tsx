import { useEffect, useRef, useState } from "react";
import { DROP_BEATS, RUNGS, rungById, type Rung } from "@/data/capital";
import {
  barPercent,
  formatClock,
  formatDelta,
  formatFullUSD,
  formatRate,
  formatTimes,
  formatUSD,
  formatYears,
  velocity,
  worthNow,
  yearsOfPay,
} from "@/lib/money";
import { FinePrint, KindTag } from "./bits";
import { useFlop } from "./context";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function youRung(title: string, worth: number): Rung {
  return {
    id: "you",
    name: "You",
    detail: title,
    place: "Your numbers",
    netWorth: worth,
    volatility: 0,
    kind: worth <= 20 ? "street" : "household",
    named: false,
  };
}

export function DropView() {
  const flop = useFlop();
  const [playing, setPlaying] = useState(false);
  const elon = rungById("elon");
  const street = rungById("street");
  if (!elon || !street) return null;

  const elonNow = worthNow(elon, flop.elapsed);
  const pinnedRung =
    flop.pinned === "you" ? youRung(flop.job.title, flop.worth) : (rungById(flop.pinned) ?? elon);
  const pinnedNow = pinnedRung.id === "you" ? flop.worth : worthNow(pinnedRung, flop.elapsed);
  const delta = pinnedRung.volatility > 0 ? pinnedNow - pinnedRung.netWorth : 0;
  const rate = pinnedRung.volatility > 0 ? velocity(pinnedRung, flop.elapsed) : 0;
  const years = yearsOfPay(pinnedNow, flop.pay);

  const ladder = [...RUNGS, youRung(flop.job.title, flop.worth)].sort((a, b) => {
    const aw = a.id === "you" ? flop.worth : a.netWorth;
    const bw = b.id === "you" ? flop.worth : b.netWorth;
    return bw - aw;
  });

  return (
    <div>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
        <div className="lg:sticky lg:top-4">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">The drop</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl">
            From Elon to a beggar. One ladder.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Business owners, heirs, paychecks, and empty pockets. Width is {flop.scale === "log" ? "logarithmic, so the bottom still exists" : "linear — true scale. Almost everyone disappears"}.
          </p>

          <div className="mt-5 w-full rounded-lg border border-line bg-surface p-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <KindTag kind={pinnedRung.kind} />
              <span className="font-mono text-xs text-faint">{pinnedRung.place}</span>
            </div>
            <p className="mt-2 font-serif text-2xl text-fg">{pinnedRung.name}</p>
            <p className="text-sm text-muted">{pinnedRung.detail}</p>
            <p className="mt-3 font-mono text-3xl leading-none tracking-tight text-gold tabular-nums sm:text-4xl">
              {formatFullUSD(pinnedNow)}
            </p>
            <p className={`mt-2 font-mono text-sm tabular-nums ${delta < 0 ? "text-ember" : delta > 0 ? "text-gold-soft" : "text-faint"}`}>
              {pinnedRung.volatility > 0 ? `${formatDelta(delta)} this session · ${formatRate(rate)}` : "Anchor, not a ticking stock"}
            </p>
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2">
            <Stat label="Vs a beggar" value={formatTimes(pinnedNow / street.netWorth)} />
            <Stat label="Your years" value={shortYears(years)} />
            <Stat label="Session" value={formatClock(flop.elapsed)} />
          </dl>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => flop.setScale(flop.scale === "log" ? "linear" : "log")}
              className="h-11 flex-1 rounded-md border border-line bg-surface px-3 text-sm text-fg"
            >
              {flop.scale === "log" ? "Show true scale" : "Show log scale"}
            </button>
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="h-11 flex-1 rounded-md bg-ember px-3 text-sm font-medium text-bg"
            >
              Run the drop
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {flop.job.title} pay, every dollar kept, takes {formatYears(years)} to equal {pinnedRung.name}.
          </p>
        </div>

        <ol className="mt-6 lg:mt-0">
          {ladder.map((rung, index) => {
            const value = rung.id === "you" ? flop.worth : worthNow(rung, flop.elapsed);
            const pct = barPercent(value, elonNow, flop.scale);
            const active = flop.pinned === rung.id;
            const heat = rung.id === "you" || rung.kind === "street";
            return (
              <li key={rung.id}>
                <button
                  type="button"
                  onClick={() => flop.setPinned(rung.id)}
                  className={`flex w-full gap-3 border-b border-line py-3 text-left ${active ? "bg-surface" : ""}`}
                >
                  <span className="w-7 shrink-0 pt-1 font-mono text-xs text-faint tabular-nums">{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className={`truncate font-serif text-lg ${heat ? "text-gold-soft" : "text-fg"}`}>
                        {rung.name}
                        {rung.id === "you" ? <span className="ml-2 font-mono text-xs uppercase tracking-widest text-ember">you</span> : null}
                      </span>
                      <span className="shrink-0 font-mono text-sm tabular-nums text-gold">{formatUSD(value)}</span>
                    </span>
                    <span
                      className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface-2"
                      aria-hidden
                    >
                      <span
                        className={`block h-full rounded-full ${heat ? "bg-ember" : "bg-gold"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-3">
                      <span className="truncate text-xs text-muted">{rung.detail}</span>
                      <KindTag kind={rung.kind} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <FinePrint />
      {playing ? <DropPlayer onClose={() => setPlaying(false)} /> : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface px-2 py-3 text-center">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 font-mono text-xs text-fg tabular-nums sm:text-sm">{value}</dd>
    </div>
  );
}

function shortYears(years: number): string {
  if (!Number.isFinite(years)) return "—";
  if (years < 100) return `${years.toFixed(years < 10 ? 1 : 0)} yrs`;
  if (years < 10_000) return `${Math.round(years).toLocaleString("en-US")} yrs`;
  if (years < 1_000_000) return `${(years / 1000).toFixed(1)}k yrs`;
  return `${(years / 1_000_000).toFixed(1)}M yrs`;
}

const DROP_MS = 16000;

function DropPlayer({ onClose }: { onClose: () => void }) {
  const reduced = useReducedMotion();
  const beats = DROP_BEATS.map((id) => rungById(id)).filter((r): r is Rung => Boolean(r));
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(!reduced);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (!playing || beats.length < 2) return;
    let raf = 0;
    const span = beats.length - 1;
    const start = performance.now() - (progressRef.current / span) * DROP_MS;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / DROP_MS));
      progressRef.current = p * span;
      setProgress(progressRef.current);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, beats.length]);

  const span = Math.max(1, beats.length - 1);
  const safe = Math.max(0, Math.min(span, Number.isFinite(progress) ? progress : 0));
  const index = Math.min(span - 1, Math.max(0, Math.floor(safe)));
  const frac = safe >= span ? 1 : safe - index;
  const from = beats[index];
  const to = beats[Math.min(index + 1, beats.length - 1)];
  if (!from || !to) return null;
  const logValue =
    Math.log10(Math.max(from.netWorth, 1)) +
    (Math.log10(Math.max(to.netWorth, 1)) - Math.log10(Math.max(from.netWorth, 1))) * (safe >= span ? 1 : frac);
  const value = 10 ** logValue;
  const shown = frac < 0.55 && safe < span ? from : to;
  const done = safe >= span - 0.001 && !playing;
  const heat = shown.kind === "street" || shown.netWorth < 1000;
  const between = RUNGS.filter((r) => r.netWorth < from.netWorth && r.netWorth > to.netWorth).slice(0, 3);

  function jump(next: number) {
    const clamped = Math.max(0, Math.min(span, next));
    progressRef.current = clamped;
    setProgress(clamped);
    setPlaying(false);
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-bg px-5 py-6" role="dialog" aria-modal="true" aria-label="Run the drop">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Capital flop</p>
          <button type="button" onClick={onClose} className="h-11 px-3 text-sm text-muted">
            Close
          </button>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-surface-2" aria-hidden>
          <div className="h-full bg-gold" style={{ width: `${(safe / span) * 100}%` }} />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="font-mono text-xs uppercase tracking-widest text-faint">
            {done ? "Bottom of the ladder" : `${from.name} down to ${to.name}`}
          </p>
          <p className={`mt-6 font-mono text-3xl leading-none tracking-tight tabular-nums sm:text-5xl ${heat || done ? "text-ember" : "text-gold"}`}>
            {formatFullUSD(value)}
          </p>
          <h2 className="mt-4 font-serif text-4xl text-fg sm:text-5xl">{done ? shown.name : to.name}</h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            {done ? shown.detail : `Next stop is ${formatUSD(to.netWorth)}. The number in between is the fall, not a new net worth.`}
          </p>
          {between.length > 0 && !done ? (
            <p className="mt-4 text-sm text-faint">
              Also falling past {between.map((r) => r.name).join(", ")}.
            </p>
          ) : null}
          {done ? (
            <p className="mt-6 max-w-md font-serif text-2xl leading-snug text-fg">
              Eight dollars in a hand. Elon Musk’s anchor is {formatTimes((rungById("elon")?.netWorth ?? 0) / 8)} that.
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" className="h-11 rounded-md border border-line text-sm text-fg" onClick={() => jump(Math.max(0, Math.floor(safe) - (frac < 0.05 ? 1 : 0)))}>
            Back
          </button>
          <button
            type="button"
            className="h-11 rounded-md border border-line text-sm text-fg"
            onClick={() => {
              if (done || safe >= span) {
                progressRef.current = 0;
                setProgress(0);
                setPlaying(!reduced);
                return;
              }
              setPlaying((p) => !p);
            }}
          >
            {done || safe >= span ? "Replay" : playing ? "Pause" : "Play"}
          </button>
          <button type="button" className="h-11 rounded-md bg-ember text-sm font-medium text-bg" onClick={() => jump(Math.floor(safe) + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
