import { useMemo, useState } from "react";
import { JOBS, rungById, type Job } from "@/data/capital";
import {
  barPercent,
  formatHourly,
  formatRate,
  formatUSD,
  formatYears,
  perSecondPay,
  worthNow,
  yearsOfPay,
} from "@/lib/money";
import { FinePrint, MoneyInput } from "./bits";
import { useFlop } from "./context";

type Mode = "all" | "job" | "owner";

export function JobsView() {
  const flop = useFlop();
  const [mode, setMode] = useState<Mode>("all");
  const [query, setQuery] = useState("");
  const elon = rungById("elon");
  const elonNow = elon ? worthNow(elon, flop.elapsed) : 0;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JOBS.filter((job) => {
      if (mode === "job" && job.owner) return false;
      if (mode === "owner" && !job.owner) return false;
      if (!q) return true;
      return (
        job.title.toLowerCase().includes(q) ||
        job.field.toLowerCase().includes(q) ||
        job.note.toLowerCase().includes(q)
      );
    });
  }, [mode, query]);

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-gold">Profession vs money</p>
      <h2 className="mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl">The work, and who owns it.</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Put a paycheck on the ladder. Owners are in the same list — a cafe, a practice, a regional chain — then the fortunes those jobs never reach.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MoneyInput
          label="Annual pay"
          value={flop.pay}
          onChange={flop.setPay}
          hint={`${formatHourly(flop.pay)} · ${formatRate(perSecondPay(flop.pay))}`}
        />
        <MoneyInput
          label="Net worth to place on the ladder"
          value={flop.worth}
          onChange={flop.setWorth}
          hint="This drops a You marker on the Drop tab."
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Filter label="All" active={mode === "all"} onClick={() => setMode("all")} />
        <Filter label="Jobs" active={mode === "job"} onClick={() => setMode("job")} />
        <Filter label="Owners" active={mode === "owner"} onClick={() => setMode("owner")} />
      </div>
      <label className="mt-3 block">
        <span className="sr-only">Search professions</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search nurse, owner, Walmart…"
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-fg placeholder:text-faint"
        />
      </label>

      <ul className="mt-4 flex flex-col gap-3">
        {list.length === 0 ? (
          <li className="rounded-lg border border-line px-4 py-8 text-center text-sm text-muted">
            Nothing matches. Try nurse, founder, or cafe.
          </li>
        ) : (
          list.map((job) => (
            <JobCard key={job.id} job={job} elonNow={elonNow} selected={flop.job.id === job.id} />
          ))
        )}
      </ul>
      <FinePrint />
    </div>
  );
}

function Filter({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-md px-4 text-sm ${active ? "bg-gold text-bg" : "border border-line bg-surface text-fg"}`}
    >
      {label}
    </button>
  );
}

function JobCard({ job, elonNow, selected }: { job: Job; elonNow: number; selected: boolean }) {
  const flop = useFlop();
  const pair = job.pair ? rungById(job.pair) : undefined;
  const pairNow = pair ? worthNow(pair, flop.elapsed) : 0;
  const payPct = Math.min(100, (job.annual / 430_000) * 100);
  const worthPct = barPercent(job.netWorth, elonNow, "log");

  return (
    <li>
      <button
        type="button"
        onClick={() => flop.selectJob(job.id)}
        className={`w-full rounded-lg border p-4 text-left ${selected ? "border-gold bg-surface" : "border-line bg-bg"}`}
      >
        <span className="flex items-start justify-between gap-3">
          <span>
            <span className="block font-serif text-xl text-fg">{job.title}</span>
            <span className="mt-1 block text-xs text-muted">
              {job.field}
              {job.owner ? " · business owner" : " · employee"}
            </span>
          </span>
          <span className="shrink-0 text-right">
            <span className="block font-mono text-sm text-gold tabular-nums">{formatUSD(job.annual)}/yr</span>
            <span className="block font-mono text-xs text-faint">{formatHourly(job.annual)}</span>
          </span>
        </span>

        <span className="mt-3 block text-xs text-muted">Pay against a surgeon’s median</span>
        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-surface-2">
          <span className="block h-full rounded-full bg-gold-soft" style={{ width: `${payPct}%` }} />
        </span>

        <span className="mt-3 flex items-baseline justify-between gap-3">
          <span className="text-xs text-muted">Typical net worth, log scale vs Elon</span>
          <span className="font-mono text-xs text-fg tabular-nums">{formatUSD(job.netWorth)}</span>
        </span>
        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-surface-2">
          <span className="block h-full rounded-full bg-ember" style={{ width: `${worthPct}%` }} />
        </span>

        <span className="mt-3 block text-sm leading-relaxed text-muted">{job.note}</span>
        <span className="mt-2 block text-sm text-fg">
          Every dollar of this pay, kept, takes {formatYears(yearsOfPay(elonNow, job.annual))} to equal Elon.
          {pair ? ` ${formatYears(yearsOfPay(pairNow, job.annual))} to equal ${pair.name}.` : ""}
        </span>
      </button>
    </li>
  );
}
