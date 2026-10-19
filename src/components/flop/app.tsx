import { ArrowDownWideNarrow, Briefcase, Building2, Timer } from "lucide-react";
import { formatClock } from "@/lib/money";
import { DropView } from "./drop";
import { JobsView } from "./jobs";
import { OwnersView } from "./owners";
import { RaceView } from "./race";
import { FlopProvider, useFlop, type Tab } from "./context";

const TABS: { id: Tab; label: string; icon: typeof Timer }[] = [
  { id: "drop", label: "Drop", icon: ArrowDownWideNarrow },
  { id: "race", label: "Race", icon: Timer },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "owners", label: "Owners", icon: Building2 },
];

export function FlopApp() {
  return (
    <FlopProvider>
      <Shell />
    </FlopProvider>
  );
}

function Shell() {
  const flop = useFlop();
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4">
        <header className="flex items-center justify-between gap-3 pt-4 pb-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <p className="font-serif text-2xl italic text-gold">Flop</p>
              <p className="font-mono text-xs tracking-widest text-muted">CAPITAL</p>
            </div>
            <p className="truncate text-xs text-faint">Live around 18 Oct 2026 anchors</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="size-2 rounded-full bg-ember motion-safe:animate-pulse" aria-hidden />
            <span>LIVE {formatClock(flop.elapsed)}</span>
          </div>
        </header>
        <main className="flex-1 pb-28">
          {flop.tab === "drop" ? <DropView /> : null}
          {flop.tab === "race" ? <RaceView /> : null}
          {flop.tab === "jobs" ? <JobsView /> : null}
          {flop.tab === "owners" ? <OwnersView /> : null}
        </main>
      </div>
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg" aria-label="Sections">
        <div className="mx-auto grid max-w-5xl grid-cols-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = flop.tab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => flop.setTab(tab.id)}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-xs ${active ? "text-gold" : "text-faint"}`}
              >
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
