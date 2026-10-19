import { useMemo, useState } from "react";
import { ownerRungs, type Kind, type Rung } from "@/data/capital";
import { formatDelta, formatUSD, formatYears, worthNow, yearsOfPay } from "@/lib/money";
import { FinePrint, KindTag } from "./bits";
import { useFlop, type OwnerFilter } from "./context";

const FILTERS: { id: OwnerFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "founder", label: "Founders" },
  { id: "heir", label: "Heirs" },
  { id: "operator", label: "Operators" },
  { id: "investor", label: "Investors" },
];

export function OwnersView() {
  const flop = useFlop();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>("elon");

  const named = useMemo(() => filterRungs(ownerRungs(true), flop.ownerFilter, query), [flop.ownerFilter, query]);
  const ground = useMemo(
    () => ownerRungs(false).filter((r) => !r.named && matches(r, query)),
    [query],
  );

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-gold">Business owners</p>
      <h2 className="mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl">Who actually holds the capital.</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Named fortunes tick around their October 2026 anchors. Under them: owners you could meet — a chain, a practice, a cafe — marked composite so they are not fake biographies.
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => flop.setOwnerFilter(f.id)}
            className={`h-11 shrink-0 rounded-md px-4 text-sm ${
              flop.ownerFilter === f.id ? "bg-gold text-bg" : "border border-line bg-surface text-fg"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <label className="mt-3 block">
        <span className="sr-only">Search owners</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Musk, Walmart, heir…"
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-fg placeholder:text-faint"
        />
      </label>

      <h3 className="mt-6 font-mono text-xs uppercase tracking-widest text-faint">Named fortunes</h3>
      <ul className="mt-2">
        {named.length === 0 ? (
          <li className="py-6 text-sm text-muted">No named owner matches.</li>
        ) : (
          named.map((rung) => (
            <OwnerRow
              key={rung.id}
              rung={rung}
              open={open === rung.id}
              onToggle={() => setOpen((id) => (id === rung.id ? null : rung.id))}
            />
          ))
        )}
      </ul>

      {flop.ownerFilter === "all" ? (
        <>
          <h3 className="mt-8 font-mono text-xs uppercase tracking-widest text-faint">Closer to the ground</h3>
          <ul className="mt-2">
            {ground.length === 0 ? (
              <li className="py-6 text-sm text-muted">No composite owner matches.</li>
            ) : (
              ground.map((rung) => (
                <OwnerRow
                  key={rung.id}
                  rung={rung}
                  open={open === rung.id}
                  onToggle={() => setOpen((id) => (id === rung.id ? null : rung.id))}
                />
              ))
            )}
          </ul>
        </>
      ) : null}
      <FinePrint />
    </div>
  );
}

function matches(rung: Rung, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    rung.name.toLowerCase().includes(q) ||
    rung.detail.toLowerCase().includes(q) ||
    rung.place.toLowerCase().includes(q) ||
    rung.kind.includes(q)
  );
}

function filterRungs(rungs: Rung[], filter: OwnerFilter, query: string): Rung[] {
  return rungs.filter((r) => {
    if (filter !== "all" && r.kind !== (filter as Kind)) return false;
    return matches(r, query);
  });
}

function OwnerRow({ rung, open, onToggle }: { rung: Rung; open: boolean; onToggle: () => void }) {
  const flop = useFlop();
  const now = worthNow(rung, flop.elapsed);
  const delta = rung.volatility > 0 ? now - rung.netWorth : 0;
  const years = yearsOfPay(now, flop.pay);

  return (
    <li className="border-b border-line">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 py-3 text-left">
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <span className="truncate font-serif text-lg text-fg">{rung.name}</span>
            <span className="shrink-0 font-mono text-sm tabular-nums text-gold">{formatUSD(now)}</span>
          </span>
          <span className="mt-1 flex items-center justify-between gap-3">
            <span className="truncate text-xs text-muted">
              {rung.detail} · {rung.place}
            </span>
            <KindTag kind={rung.kind} />
          </span>
        </span>
      </button>
      {open ? (
        <div className="pb-4">
          <p className={`font-mono text-sm tabular-nums ${delta < 0 ? "text-ember" : delta > 0 ? "text-gold-soft" : "text-faint"}`}>
            {rung.volatility > 0 ? `${formatDelta(delta)} since you opened this app` : "Fixed composite. It does not pretend to tick."}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {flop.job.title} would need {formatYears(years)} of pay, every dollar kept, to match {rung.name}.
          </p>
          <button
            type="button"
            className="mt-3 h-11 rounded-md border border-line px-4 text-sm text-fg"
            onClick={() => {
              flop.setPinned(rung.id);
              flop.setTab("drop");
            }}
          >
            See on the ladder
          </button>
        </div>
      ) : null}
    </li>
  );
}
