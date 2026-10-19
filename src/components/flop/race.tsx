import { useEffect, useRef, useState } from "react";
import { JOBS, rungById } from "@/data/capital";
import {
  formatAccrual,
  formatCount,
  formatDelta,
  formatFullUSD,
  formatHourly,
  formatRate,
  formatUSD,
  formatYears,
  perSecondPay,
  velocity,
  worthNow,
  yearsOfPay,
} from "@/lib/money";
import { FinePrint } from "./bits";
import { useFlop } from "./context";

export function RaceView() {
  const flop = useFlop();
  const elon = rungById("elon");
  const elonNow = elon ? worthNow(elon, flop.elapsed) : 0;
  const samples = useSpark(elonNow, flop.elapsed);
  const pair = flop.job.pair ? rungById(flop.job.pair) : undefined;
  if (!elon) return null;
  const delta = elonNow - elon.netWorth;
  const rate = velocity(elon, flop.elapsed);
  const accrued = perSecondPay(flop.pay) * flop.elapsed;
  const payRate = perSecondPay(flop.pay);
  const years = yearsOfPay(elonNow, flop.pay);
  const careers = flop.pay > 0 ? elonNow / (flop.pay * 40) : Infinity;
  const pairNow = pair ? worthNow(pair, flop.elapsed) : 0;
  const pairYears = pair ? yearsOfPay(pairNow, flop.pay) : 0;

  let verdict = "Starting the clocks.";
  if (flop.elapsed >= 1) {
    if (delta < 0) {
      verdict = `Elon’s book fell ${formatUSD(Math.abs(delta))} while this paycheck added ${formatAccrual(accrued)}.`;
    } else if (accrued > 0 && delta > 0) {
      const ratio = delta / accrued;
      verdict = `The book gained ${formatCount(ratio)} times what the paycheck added.`;
    } else {
      verdict = `Paycheck so far ${formatAccrual(accrued)}. The book is ${formatDelta(delta)}.`;
    }
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-gold">Paycheck vs book</p>
      <h2 className="mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl">Capital does not clock in.</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        A salary accrues every second of the year. A founder’s stake moves whether anyone is on shift.
      </p>

      <label className="mt-5 block">
        <span className="text-xs text-muted">Your side of the race</span>
        <select
          className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-fg"
          value={flop.job.id}
          onChange={(e) => flop.selectJob(e.target.value)}
        >
          <optgroup label="Employees">
            {JOBS.filter((j) => !j.owner).map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="Business owners">
            {JOBS.filter((j) => j.owner).map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </optgroup>
        </select>
      </label>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <article className="rounded-lg border border-line bg-surface p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">The book</p>
          <h3 className="mt-2 font-serif text-2xl text-fg">Elon Musk</h3>
          <p className="text-sm text-muted">SpaceX, Tesla · live around the anchor</p>
          <p className="mt-4 font-mono text-3xl leading-none tracking-tight text-gold tabular-nums sm:text-4xl">
            {formatFullUSD(elonNow)}
          </p>
          <p className={`mt-2 font-mono text-sm tabular-nums ${delta < 0 ? "text-ember" : "text-gold-soft"}`}>
            {formatDelta(delta)} session · {formatRate(rate)}
          </p>
          <Spark samples={samples} />
        </article>

        <article className="rounded-lg border border-line bg-bg p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-ember">The paycheck</p>
          <h3 className="mt-2 font-serif text-2xl text-fg">{flop.job.title}</h3>
          <p className="text-sm text-muted">
            {formatUSD(flop.pay)} / year · {formatHourly(flop.pay)} on a 2,080-hour clock
          </p>
          <p className="mt-4 font-mono text-3xl leading-none tracking-tight text-fg tabular-nums sm:text-4xl">
            {formatAccrual(accrued)}
          </p>
          <p className="mt-2 font-mono text-sm text-muted tabular-nums">{formatRate(payRate)} every second of the year</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{flop.job.note}</p>
        </article>
      </div>

      <p className="mt-4 font-serif text-2xl leading-snug text-fg">{verdict}</p>

      <dl className="mt-4 grid gap-2 sm:grid-cols-3">
        <Fact label="Years of this pay to match Elon" value={formatYears(years)} />
        <Fact label="40-year careers, nothing spent" value={formatCount(careers)} />
        <Fact
          label={pair ? `Years to match ${pair.name}` : "No paired owner"}
          value={pair ? formatYears(pairYears) : "—"}
        />
      </dl>
      <FinePrint />
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface px-3 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 font-mono text-sm text-gold tabular-nums">{value}</dd>
    </div>
  );
}

function useSpark(value: number, elapsed: number) {
  const bucket = useRef(-1);
  const [samples, setSamples] = useState<number[]>([]);
  useEffect(() => {
    const b = Math.floor(elapsed);
    if (b === bucket.current) return;
    bucket.current = b;
    setSamples((prev) => [...prev, value].slice(-48));
  }, [elapsed, value]);
  return samples;
}

function Spark({ samples }: { samples: number[] }) {
  if (samples.length < 2) {
    return <div className="mt-4 h-16 rounded-md bg-bg" />;
  }
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const span = max - min || 1;
  const w = 320;
  const h = 64;
  const d = samples
    .map((v, i) => {
      const x = (i / (samples.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 8) - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-16 w-full" role="img" aria-label="Elon Musk session move">
      <path d={d} fill="none" stroke="var(--color-gold)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
