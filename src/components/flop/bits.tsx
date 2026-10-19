import type { Kind } from "@/data/capital";

const KIND_LABEL: Record<Kind, string> = {
  founder: "Founder",
  heir: "Heir",
  operator: "Operator",
  investor: "Investor",
  composite: "Composite",
  household: "Household",
  street: "Street",
};

export function KindTag({ kind }: { kind: Kind }) {
  return (
    <span className="font-mono text-xs uppercase tracking-widest text-faint">{KIND_LABEL[kind]}</span>
  );
}

export function FinePrint() {
  return (
    <p className="mt-8 text-xs leading-relaxed text-faint">
      Anchors follow public billionaire estimates around 18 Oct 2026 (Forbes and Bloomberg ranges). They are
      not a brokerage feed. Named fortunes drift around those anchors while this screen is open. Composite
      rungs are typical situations, not real people. Pay figures are rounded U.S. medians. Saving “every
      dollar” ignores tax, rent, and food — the gap is so large those costs are not what creates it.
    </p>
  );
}

export function MoneyInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <span className="mt-1 flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-3">
        <span className="font-mono text-muted">$</span>
        <input
          className="w-full bg-transparent font-mono text-fg tabular-nums outline-none"
          inputMode="decimal"
          aria-label={label}
          value={Number.isFinite(value) ? String(Math.round(value)) : "0"}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^0-9.]/g, "");
            if (cleaned === "") {
              onChange(0);
              return;
            }
            const n = Number(cleaned);
            if (Number.isFinite(n)) onChange(n);
          }}
        />
      </span>
      <span className="mt-1 block text-xs text-faint">{hint}</span>
    </label>
  );
}
