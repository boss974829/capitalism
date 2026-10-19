import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_JOB, JOBS, jobById, type Job } from "@/data/capital";
import { clampMoney } from "@/lib/money";

export type Tab = "drop" | "race" | "jobs" | "owners";
export type Scale = "log" | "linear";
export type OwnerFilter = "all" | "founder" | "heir" | "operator" | "investor";

type FlopContextValue = {
  elapsed: number;
  tab: Tab;
  setTab: (tab: Tab) => void;
  job: Job;
  selectJob: (id: string) => void;
  pay: number;
  worth: number;
  setPay: (n: number) => void;
  setWorth: (n: number) => void;
  scale: Scale;
  setScale: (scale: Scale) => void;
  pinned: string;
  setPinned: (id: string) => void;
  ownerFilter: OwnerFilter;
  setOwnerFilter: (f: OwnerFilter) => void;
};

const FlopContext = createContext<FlopContextValue | null>(null);
const STORAGE = "flop-you-v1";

export function FlopProvider({ children }: { children: ReactNode }) {
  const fallback = jobById(DEFAULT_JOB) ?? JOBS[0];
  const [elapsed, setElapsed] = useState(0);
  const [tab, setTab] = useState<Tab>("drop");
  const [jobId, setJobId] = useState(fallback.id);
  const [pay, setPayState] = useState(fallback.annual);
  const [worth, setWorthState] = useState(fallback.netWorth);
  const [scale, setScale] = useState<Scale>("linear");
  const [pinned, setPinned] = useState("elon");
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const started = Date.now();
    const id = window.setInterval(() => {
      setElapsed((Date.now() - started) / 1000);
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw) as { jobId?: string; pay?: number; worth?: number };
        const saved = parsed.jobId ? jobById(parsed.jobId) : undefined;
        if (saved) {
          setJobId(saved.id);
          setPayState(clampMoney(typeof parsed.pay === "number" ? parsed.pay : saved.annual));
          setWorthState(clampMoney(typeof parsed.worth === "number" ? parsed.worth : saved.netWorth));
        }
      }
    } catch {
      /* ignore broken local storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE, JSON.stringify({ jobId, pay, worth }));
  }, [ready, jobId, pay, worth]);

  const job = jobById(jobId) ?? fallback;

  const value = useMemo<FlopContextValue>(
    () => ({
      elapsed,
      tab,
      setTab,
      job,
      selectJob: (id: string) => {
        const next = jobById(id);
        if (!next) return;
        setJobId(next.id);
        setPayState(next.annual);
        setWorthState(next.netWorth);
      },
      pay,
      worth,
      setPay: (n: number) => setPayState(clampMoney(n)),
      setWorth: (n: number) => setWorthState(clampMoney(n)),
      scale,
      setScale,
      pinned,
      setPinned,
      ownerFilter,
      setOwnerFilter,
    }),
    [elapsed, tab, job, pay, worth, scale, pinned, ownerFilter],
  );

  return <FlopContext.Provider value={value}>{children}</FlopContext.Provider>;
}

export function useFlop(): FlopContextValue {
  const ctx = useContext(FlopContext);
  if (!ctx) throw new Error("useFlop outside provider");
  return ctx;
}
