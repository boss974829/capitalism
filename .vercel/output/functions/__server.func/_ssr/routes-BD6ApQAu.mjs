import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowDownWideNarrow, i as Briefcase, n as Timer, r as Building2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BD6ApQAu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function hashSeed(id) {
	let h = 2166136261;
	for (let i = 0; i < id.length; i++) {
		h ^= id.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) / 4294967296 * Math.PI * 2;
}
var seeds = /* @__PURE__ */ new Map();
function seedOf(id) {
	let s = seeds.get(id);
	if (s === void 0) {
		s = hashSeed(id);
		seeds.set(id, s);
	}
	return s;
}
/** Drift around a public anchor. Zero at t = 0. Not an exchange feed. */
function liveWorth(base, vol, t, seed) {
	if (vol <= 0 || base <= 0) return base;
	const amp = base * vol * .015;
	const wave = (period, phase, weight) => weight * (Math.sin(t / period + phase) - Math.sin(phase));
	const wobble = wave(90, seed, .55) + wave(240, seed * 1.7, .3) + wave(28, seed * .6, .15);
	return Math.max(base * .5, base + wobble * amp);
}
function worthNow(rung, elapsed) {
	return liveWorth(rung.netWorth, rung.volatility, elapsed, seedOf(rung.id));
}
function velocity(rung, elapsed) {
	const a = worthNow(rung, Math.max(0, elapsed - .5));
	return worthNow(rung, elapsed + .5) - a;
}
function formatUSD(n) {
	const sign = n < 0 ? "−" : "";
	const v = Math.abs(n);
	if (v >= 0xe8d4a51000) return `${sign}$${(v / 0xe8d4a51000).toFixed(2)}T`;
	if (v >= 1e9) return `${sign}$${(v / 1e9).toFixed(1)}B`;
	if (v >= 1e6) return `${sign}$${(v / 1e6).toFixed(1)}M`;
	if (v >= 1e3) return `${sign}$${Math.round(v).toLocaleString("en-US")}`;
	return `${sign}$${v.toFixed(2)}`;
}
function formatFullUSD(n) {
	const sign = n < 0 ? "−" : "";
	const v = Math.abs(n);
	if (v >= 1e3) return `${sign}$${Math.round(v).toLocaleString("en-US")}`;
	return `${sign}$${v.toFixed(2)}`;
}
function formatDelta(n) {
	if (Math.abs(n) < 1) return "$0";
	const body = formatUSD(Math.abs(n));
	return n > 0 ? `+${body}` : `−${body}`;
}
function formatRate(perSec) {
	const sign = perSec < 0 ? "−" : "";
	const v = Math.abs(perSec);
	if (v >= 1e6) return `${sign}$${(v / 1e6).toFixed(2)}M/s`;
	if (v >= 1e3) return `${sign}$${(v / 1e3).toFixed(1)}k/s`;
	if (v >= 1) return `${sign}$${v.toFixed(2)}/s`;
	if (v >= .01) return `${sign}$${v.toFixed(3)}/s`;
	return `${sign}$${v.toFixed(4)}/s`;
}
function formatAccrual(n) {
	const sign = n < 0 ? "−" : "";
	const v = Math.abs(n);
	if (v >= 1e3) return formatUSD(n);
	if (v >= 1) return `${sign}$${v.toFixed(2)}`;
	return `${sign}$${v.toFixed(4)}`;
}
function formatHourly(annual) {
	const h = annual / 2080;
	if (h >= 100) return `$${Math.round(h).toLocaleString("en-US")}/hr`;
	return `$${h.toFixed(2)}/hr`;
}
function formatYears(years) {
	if (!Number.isFinite(years)) return "—";
	if (years < 1 / 12) return "under a month";
	if (years < 1) {
		const months = Math.max(1, Math.round(years * 12));
		return months === 1 ? "1 month" : `${months} months`;
	}
	if (years < 10) return `${years.toFixed(1)} years`;
	if (years < 1e4) return `${Math.round(years).toLocaleString("en-US")} years`;
	if (years < 1e6) return `${(years / 1e3).toFixed(1)} thousand years`;
	if (years < 1e9) return `${(years / 1e6).toFixed(1)} million years`;
	return `${(years / 1e9).toFixed(2)} billion years`;
}
function formatCount(n) {
	if (!Number.isFinite(n)) return "—";
	const v = Math.abs(n);
	if (v < 10) return v.toFixed(1);
	if (v < 1e3) return Math.round(v).toLocaleString("en-US");
	if (v < 1e6) return `${(v / 1e3).toFixed(1)} thousand`;
	if (v < 1e9) return `${(v / 1e6).toFixed(1)} million`;
	return `${(v / 1e9).toFixed(2)} billion`;
}
function formatTimes(n) {
	if (!Number.isFinite(n) || n <= 0) return "—";
	if (n < 10) return `${n.toFixed(1)}×`;
	if (n < 1e6) return `${Math.round(n).toLocaleString("en-US")}×`;
	if (n < 1e9) return `${(n / 1e6).toFixed(1)} million×`;
	if (n < 0xe8d4a51000) return `${Math.round(n / 1e9)} billion×`;
	return `${(n / 0xe8d4a51000).toFixed(2)} trillion×`;
}
function perSecondPay(annual) {
	return annual / 31557600;
}
function yearsOfPay(target, annual) {
	if (annual <= 0) return Infinity;
	return target / annual;
}
function barPercent(value, top, scale) {
	if (value <= 0 || top <= 0) return 0;
	if (scale === "linear") return Math.min(100, value / top * 100);
	const lo = Math.log10(8);
	const hi = Math.log10(Math.max(top, 9));
	const v = Math.log10(Math.max(8, value));
	if (hi <= lo) return 0;
	return Math.min(100, Math.max(0, (v - lo) / (hi - lo) * 100));
}
function formatClock(seconds) {
	const s = Math.max(0, Math.floor(seconds));
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function clampMoney(n) {
	if (!Number.isFinite(n) || n < 0) return 0;
	return Math.min(n, 5e12);
}
var RUNGS = [...[
	{
		id: "elon",
		name: "Elon Musk",
		detail: "SpaceX, Tesla",
		place: "Austin",
		netWorth: 904e9,
		volatility: .021,
		kind: "founder",
		named: true
	},
	{
		id: "bezos",
		name: "Jeff Bezos",
		detail: "Amazon",
		place: "Miami",
		netWorth: 361e9,
		volatility: .009,
		kind: "founder",
		named: true
	},
	{
		id: "page",
		name: "Larry Page",
		detail: "Google",
		place: "Palo Alto",
		netWorth: 292e9,
		volatility: .01,
		kind: "founder",
		named: true
	},
	{
		id: "brin",
		name: "Sergey Brin",
		detail: "Google",
		place: "Los Altos",
		netWorth: 271e9,
		volatility: .01,
		kind: "founder",
		named: true
	},
	{
		id: "zuck",
		name: "Mark Zuckerberg",
		detail: "Meta",
		place: "Palo Alto",
		netWorth: 251e9,
		volatility: .015,
		kind: "founder",
		named: true
	},
	{
		id: "dell",
		name: "Michael Dell",
		detail: "Dell Technologies",
		place: "Austin",
		netWorth: 224e9,
		volatility: .012,
		kind: "founder",
		named: true
	},
	{
		id: "ballmer",
		name: "Steve Ballmer",
		detail: "Microsoft",
		place: "Washington",
		netWorth: 185e9,
		volatility: .007,
		kind: "operator",
		named: true
	},
	{
		id: "ellison",
		name: "Larry Ellison",
		detail: "Oracle",
		place: "Lanai",
		netWorth: 178e9,
		volatility: .011,
		kind: "founder",
		named: true
	},
	{
		id: "jensen",
		name: "Jensen Huang",
		detail: "Nvidia",
		place: "Los Altos",
		netWorth: 177e9,
		volatility: .02,
		kind: "founder",
		named: true
	},
	{
		id: "buffett",
		name: "Warren Buffett",
		detail: "Berkshire Hathaway",
		place: "Omaha",
		netWorth: 151e9,
		volatility: .004,
		kind: "investor",
		named: true
	},
	{
		id: "jim",
		name: "Jim Walton",
		detail: "Walmart",
		place: "Bentonville",
		netWorth: 147e9,
		volatility: .004,
		kind: "heir",
		named: true
	},
	{
		id: "rob",
		name: "Rob Walton",
		detail: "Walmart",
		place: "Bentonville",
		netWorth: 144e9,
		volatility: .004,
		kind: "heir",
		named: true
	},
	{
		id: "alice",
		name: "Alice Walton",
		detail: "Walmart",
		place: "Fort Worth",
		netWorth: 143e9,
		volatility: .004,
		kind: "heir",
		named: true
	},
	{
		id: "arnault",
		name: "Bernard Arnault",
		detail: "LVMH",
		place: "Paris",
		netWorth: 136e9,
		volatility: .007,
		kind: "founder",
		named: true
	},
	{
		id: "ortega",
		name: "Amancio Ortega",
		detail: "Zara, Inditex",
		place: "A Coruña",
		netWorth: 131e9,
		volatility: .006,
		kind: "founder",
		named: true
	},
	{
		id: "slim",
		name: "Carlos Slim",
		detail: "América Móvil",
		place: "Mexico City",
		netWorth: 124e9,
		volatility: .008,
		kind: "founder",
		named: true
	},
	{
		id: "gates",
		name: "Bill Gates",
		detail: "Microsoft",
		place: "Medina",
		netWorth: 119e9,
		volatility: .006,
		kind: "founder",
		named: true
	},
	{
		id: "adani",
		name: "Gautam Adani",
		detail: "Adani Group",
		place: "Ahmedabad",
		netWorth: 11e10,
		volatility: .016,
		kind: "founder",
		named: true
	},
	{
		id: "yiming",
		name: "Zhang Yiming",
		detail: "ByteDance",
		place: "Singapore",
		netWorth: 105e9,
		volatility: .012,
		kind: "founder",
		named: true
	},
	{
		id: "francoise",
		name: "Francoise Bettencourt Meyers",
		detail: "L'Oréal",
		place: "Paris",
		netWorth: 992e8,
		volatility: .004,
		kind: "heir",
		named: true
	},
	{
		id: "ambani",
		name: "Mukesh Ambani",
		detail: "Reliance",
		place: "Mumbai",
		netWorth: 804e8,
		volatility: .01,
		kind: "heir",
		named: true
	},
	{
		id: "cz",
		name: "Changpeng Zhao",
		detail: "Binance",
		place: "United Arab Emirates",
		netWorth: 683e8,
		volatility: .024,
		kind: "founder",
		named: true
	},
	{
		id: "griffin",
		name: "Ken Griffin",
		detail: "Citadel",
		place: "Miami",
		netWorth: 575e8,
		volatility: .01,
		kind: "founder",
		named: true
	},
	{
		id: "billion-line",
		name: "The billion line",
		detail: "A few thousand people on earth clear this. The card is the line, not one person.",
		place: "Composite",
		netWorth: 1e9,
		volatility: 0,
		kind: "composite",
		named: false
	},
	{
		id: "owner-group",
		name: "Regional chain owner",
		detail: "Dozens of sites, or a company already sold. Typical, not a named fortune.",
		place: "Composite",
		netWorth: 85e6,
		volatility: 0,
		kind: "composite",
		named: false
	},
	{
		id: "owner-shops",
		name: "Three-store owner",
		detail: "Locations, a building, equipment, and debt. Still a business owner.",
		place: "Composite",
		netWorth: 95e5,
		volatility: 0,
		kind: "composite",
		named: false
	},
	{
		id: "practice",
		name: "Practice owner",
		detail: "A physician or dentist who owns the office the staff works in.",
		place: "Composite",
		netWorth: 26e5,
		volatility: 0,
		kind: "composite",
		named: false
	},
	{
		id: "top10",
		name: "U.S. top 10% household",
		detail: "Roughly where the wealthiest tenth of American households starts.",
		place: "United States",
		netWorth: 19e5,
		volatility: 0,
		kind: "household",
		named: false
	},
	{
		id: "cafe",
		name: "Cafe owner",
		detail: "One good shop, a lease, equipment, and a thin margin.",
		place: "Composite",
		netWorth: 42e4,
		volatility: 0,
		kind: "composite",
		named: false
	},
	{
		id: "median",
		name: "Median U.S. household",
		detail: "Home equity, a retirement account, a car. Half of households are below this.",
		place: "United States",
		netWorth: 192e3,
		volatility: 0,
		kind: "household",
		named: false
	},
	{
		id: "renter",
		name: "Median renter household",
		detail: "No house to borrow against. Savings, a car, maybe a little debt.",
		place: "United States",
		netWorth: 10400,
		volatility: 0,
		kind: "household",
		named: false
	},
	{
		id: "crew-cash",
		name: "Fast-food savings",
		detail: "A few paychecks ahead. No assets that compound.",
		place: "Composite",
		netWorth: 2200,
		volatility: 0,
		kind: "household",
		named: false
	},
	{
		id: "between",
		name: "Between jobs",
		detail: "Cash on hand. No paycheck this week.",
		place: "Composite",
		netWorth: 640,
		volatility: 0,
		kind: "household",
		named: false
	},
	{
		id: "street",
		name: "Beggar",
		detail: "Unsheltered adult asking for change. Cash in hand, no account. A person, not a punchline.",
		place: "Any city",
		netWorth: 8,
		volatility: 0,
		kind: "street",
		named: false
	}
]].sort((a, b) => b.netWorth - a.netWorth);
var DROP_BEATS = [
	"elon",
	"bezos",
	"zuck",
	"jensen",
	"buffett",
	"arnault",
	"billion-line",
	"owner-group",
	"practice",
	"median",
	"crew-cash",
	"street"
];
var JOBS = [
	{
		id: "street",
		title: "Asking for change",
		field: "Street",
		annual: 9e3,
		netWorth: 8,
		owner: false,
		pair: "street",
		note: "About twenty-five dollars on a decent day. Some days, nothing."
	},
	{
		id: "crew",
		title: "Fast-food crew",
		field: "Food",
		annual: 29e3,
		netWorth: 2200,
		owner: false,
		pair: "cafe",
		note: "The person on the line. The shop's owner is a different rung."
	},
	{
		id: "barista",
		title: "Barista",
		field: "Food",
		annual: 31e3,
		netWorth: 4200,
		owner: false,
		pair: "cafe",
		note: "Same counter as the owner. Not the same capital."
	},
	{
		id: "zara",
		title: "Zara sales associate",
		field: "Fashion",
		annual: 32e3,
		netWorth: 6500,
		owner: false,
		pair: "ortega",
		note: "The clothes on the rack made Ortega one of the richest people alive."
	},
	{
		id: "walmart",
		title: "Walmart associate",
		field: "Retail",
		annual: 35e3,
		netWorth: 8e3,
		owner: false,
		pair: "alice",
		note: "The wage is hourly. The Walton stake is the store itself."
	},
	{
		id: "warehouse",
		title: "Warehouse associate",
		field: "Logistics",
		annual: 38e3,
		netWorth: 9e3,
		owner: false,
		pair: "bezos",
		note: "The building moves boxes. The founder's wealth is the company."
	},
	{
		id: "cook",
		title: "Line cook",
		field: "Food",
		annual: 38e3,
		netWorth: 7500,
		owner: false,
		pair: "cafe",
		note: "A shift pays for the week. The lease is someone else's asset."
	},
	{
		id: "boutique",
		title: "Boutique associate",
		field: "Fashion",
		annual: 42e3,
		netWorth: 12e3,
		owner: false,
		pair: "arnault",
		note: "LVMH's shops sell the bags. Arnault owns the houses."
	},
	{
		id: "rideshare",
		title: "Rideshare driver",
		field: "Logistics",
		annual: 42e3,
		netWorth: 14e3,
		owner: false,
		pair: "owner-shops",
		note: "After fuel and the car, the take-home is thinner than the gross."
	},
	{
		id: "truck",
		title: "Truck driver",
		field: "Logistics",
		annual: 57e3,
		netWorth: 48e3,
		owner: false,
		pair: "owner-group",
		note: "The cab is often financed. The fleet owner holds the equity."
	},
	{
		id: "teacher",
		title: "Public school teacher",
		field: "Education",
		annual: 66e3,
		netWorth: 95e3,
		owner: false,
		pair: "median",
		note: "A salary near the middle, a pension that is not a stock certificate."
	},
	{
		id: "plumber",
		title: "Plumber, employee",
		field: "Trades",
		annual: 65e3,
		netWorth: 14e4,
		owner: false,
		pair: "owner-shops",
		note: "The van and the license can belong to the boss."
	},
	{
		id: "accountant",
		title: "Accountant",
		field: "Finance",
		annual: 82e3,
		netWorth: 19e4,
		owner: false,
		pair: "buffett",
		note: "Keeps the books. Does not own Berkshire."
	},
	{
		id: "nurse",
		title: "Registered nurse",
		field: "Medicine",
		annual: 94e3,
		netWorth: 175e3,
		owner: false,
		pair: "practice",
		note: "The shift is skilled. The practice, if owned, sits a few rungs up — and still nowhere near the top."
	},
	{
		id: "advisor",
		title: "Financial advisor",
		field: "Finance",
		annual: 99e3,
		netWorth: 36e4,
		owner: false,
		pair: "buffett",
		note: "Median pay is ordinary. A book of clients is not Buffett's book."
	},
	{
		id: "oracle",
		title: "Oracle database admin",
		field: "Tech",
		annual: 12e4,
		netWorth: 26e4,
		owner: false,
		pair: "ellison",
		note: "Keeps the databases up. Ellison kept the shares."
	},
	{
		id: "swe",
		title: "Software engineer",
		field: "Tech",
		annual: 133e3,
		netWorth: 29e4,
		owner: false,
		pair: "elon",
		note: "A strong paycheck. Options vest. They do not make you the cap table."
	},
	{
		id: "lawyer",
		title: "Lawyer",
		field: "Law",
		annual: 151e3,
		netWorth: 42e4,
		owner: false,
		pair: "griffin",
		note: "Median, not partner at the fund's firm. The fund is Griffin's."
	},
	{
		id: "tesla",
		title: "Tesla engineer",
		field: "Autos",
		annual: 165e3,
		netWorth: 41e4,
		owner: false,
		pair: "elon",
		note: "Same company as the top of the ladder. Not the same stake."
	},
	{
		id: "dentist",
		title: "Dentist, associate",
		field: "Medicine",
		annual: 17e4,
		netWorth: 64e4,
		owner: false,
		pair: "practice",
		note: "Works in the chairs. Does not own the chairs yet."
	},
	{
		id: "google",
		title: "Google engineer",
		field: "Tech",
		annual: 19e4,
		netWorth: 68e4,
		owner: false,
		pair: "page",
		note: "Alphabet stock helps. Page and Brin kept the supervoting shares."
	},
	{
		id: "nvidia",
		title: "Nvidia engineer",
		field: "Chips",
		annual: 2e5,
		netWorth: 72e4,
		owner: false,
		pair: "jensen",
		note: "The options rose with the stock. Huang's stake is the company."
	},
	{
		id: "meta",
		title: "Meta product manager",
		field: "Tech",
		annual: 21e4,
		netWorth: 76e4,
		owner: false,
		pair: "zuck",
		note: "A big package. Zuckerberg still controls the vote."
	},
	{
		id: "surgeon",
		title: "Surgeon",
		field: "Medicine",
		annual: 43e4,
		netWorth: 28e5,
		owner: false,
		pair: "practice",
		note: "Among the best-paid jobs in the country. Still a wage next to a founder."
	},
	{
		id: "cafe-owner",
		title: "Cafe owner",
		field: "Food",
		annual: 76e3,
		netWorth: 42e4,
		owner: true,
		pair: "elon",
		note: "Owns the shop. Often earns less than a nurse, with more risk."
	},
	{
		id: "plumbing-owner",
		title: "Plumbing company owner",
		field: "Trades",
		annual: 11e4,
		netWorth: 48e4,
		owner: true,
		pair: "owner-shops",
		note: "A real business. Trucks, payroll, and a number that fits in one house."
	},
	{
		id: "agency",
		title: "Agency founder",
		field: "Services",
		annual: 23e4,
		netWorth: 18e5,
		owner: true,
		pair: "elon",
		note: "Clients pay the invoices. There is no public ticker."
	},
	{
		id: "practice-owner",
		title: "Practice owner",
		field: "Medicine",
		annual: 39e4,
		netWorth: 26e5,
		owner: true,
		pair: "elon",
		note: "Owns the office a nurse or associate works in."
	},
	{
		id: "franchisee",
		title: "Franchisee, three stores",
		field: "Retail",
		annual: 185e3,
		netWorth: 95e5,
		owner: true,
		pair: "alice",
		note: "A local owner with equity. The brand's founding family is still above."
	},
	{
		id: "chain",
		title: "Regional chain owner",
		field: "Retail",
		annual: 65e4,
		netWorth: 85e6,
		owner: true,
		pair: "alice",
		note: "Rich in any room that is not a billionaire list."
	}
];
var rungMap = new Map(RUNGS.map((r) => [r.id, r]));
var jobMap = new Map(JOBS.map((j) => [j.id, j]));
function rungById(id) {
	return rungMap.get(id);
}
function jobById(id) {
	return jobMap.get(id);
}
function ownerRungs(namedOnly) {
	return RUNGS.filter((r) => {
		if (!(r.kind === "founder" || r.kind === "heir" || r.kind === "operator" || r.kind === "investor" || r.kind === "composite" && r.netWorth >= 1e5)) return false;
		if (namedOnly) return r.named;
		return true;
	});
}
var KIND_LABEL = {
	founder: "Founder",
	heir: "Heir",
	operator: "Operator",
	investor: "Investor",
	composite: "Composite",
	household: "Household",
	street: "Street"
};
function KindTag({ kind }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "font-mono text-xs uppercase tracking-widest text-faint",
		children: KIND_LABEL[kind]
	});
}
function FinePrint() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-8 text-xs leading-relaxed text-faint",
		children: "Anchors follow public billionaire estimates around 18 Oct 2026 (Forbes and Bloomberg ranges). They are not a brokerage feed. Named fortunes drift around those anchors while this screen is open. Composite rungs are typical situations, not real people. Pay figures are rounded U.S. medians. Saving “every dollar” ignores tax, rent, and food — the gap is so large those costs are not what creates it."
	});
}
function MoneyInput({ label, value, onChange, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-1 flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-muted",
					children: "$"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "w-full bg-transparent font-mono text-fg tabular-nums outline-none",
					inputMode: "decimal",
					"aria-label": label,
					value: Number.isFinite(value) ? String(Math.round(value)) : "0",
					onChange: (e) => {
						const cleaned = e.target.value.replace(/[^0-9.]/g, "");
						if (cleaned === "") {
							onChange(0);
							return;
						}
						const n = Number(cleaned);
						if (Number.isFinite(n)) onChange(n);
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-xs text-faint",
				children: hint
			})
		]
	});
}
var FlopContext = (0, import_react.createContext)(null);
var STORAGE = "flop-you-v1";
function FlopProvider({ children }) {
	const fallback = jobById("nurse") ?? JOBS[0];
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const [tab, setTab] = (0, import_react.useState)("drop");
	const [jobId, setJobId] = (0, import_react.useState)(fallback.id);
	const [pay, setPayState] = (0, import_react.useState)(fallback.annual);
	const [worth, setWorthState] = (0, import_react.useState)(fallback.netWorth);
	const [scale, setScale] = (0, import_react.useState)("linear");
	const [pinned, setPinned] = (0, import_react.useState)("elon");
	const [ownerFilter, setOwnerFilter] = (0, import_react.useState)("all");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const started = Date.now();
		const id = window.setInterval(() => {
			setElapsed((Date.now() - started) / 1e3);
		}, 200);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE);
			if (raw) {
				const parsed = JSON.parse(raw);
				const saved = parsed.jobId ? jobById(parsed.jobId) : void 0;
				if (saved) {
					setJobId(saved.id);
					setPayState(clampMoney(typeof parsed.pay === "number" ? parsed.pay : saved.annual));
					setWorthState(clampMoney(typeof parsed.worth === "number" ? parsed.worth : saved.netWorth));
				}
			}
		} catch {}
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		localStorage.setItem(STORAGE, JSON.stringify({
			jobId,
			pay,
			worth
		}));
	}, [
		ready,
		jobId,
		pay,
		worth
	]);
	const job = jobById(jobId) ?? fallback;
	const value = (0, import_react.useMemo)(() => ({
		elapsed,
		tab,
		setTab,
		job,
		selectJob: (id) => {
			const next = jobById(id);
			if (!next) return;
			setJobId(next.id);
			setPayState(next.annual);
			setWorthState(next.netWorth);
		},
		pay,
		worth,
		setPay: (n) => setPayState(clampMoney(n)),
		setWorth: (n) => setWorthState(clampMoney(n)),
		scale,
		setScale,
		pinned,
		setPinned,
		ownerFilter,
		setOwnerFilter
	}), [
		elapsed,
		tab,
		job,
		pay,
		worth,
		scale,
		pinned,
		ownerFilter
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlopContext.Provider, {
		value,
		children
	});
}
function useFlop() {
	const ctx = (0, import_react.useContext)(FlopContext);
	if (!ctx) throw new Error("useFlop outside provider");
	return ctx;
}
function useReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const apply = () => setReduced(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);
	return reduced;
}
function youRung(title, worth) {
	return {
		id: "you",
		name: "You",
		detail: title,
		place: "Your numbers",
		netWorth: worth,
		volatility: 0,
		kind: worth <= 20 ? "street" : "household",
		named: false
	};
}
function DropView() {
	const flop = useFlop();
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const elon = rungById("elon");
	const street = rungById("street");
	if (!elon || !street) return null;
	const elonNow = worthNow(elon, flop.elapsed);
	const pinnedRung = flop.pinned === "you" ? youRung(flop.job.title, flop.worth) : rungById(flop.pinned) ?? elon;
	const pinnedNow = pinnedRung.id === "you" ? flop.worth : worthNow(pinnedRung, flop.elapsed);
	const delta = pinnedRung.volatility > 0 ? pinnedNow - pinnedRung.netWorth : 0;
	const rate = pinnedRung.volatility > 0 ? velocity(pinnedRung, flop.elapsed) : 0;
	const years = yearsOfPay(pinnedNow, flop.pay);
	const ladder = [...RUNGS, youRung(flop.job.title, flop.worth)].sort((a, b) => {
		const aw = a.id === "you" ? flop.worth : a.netWorth;
		return (b.id === "you" ? flop.worth : b.netWorth) - aw;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:sticky lg:top-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-widest text-gold",
						children: "The drop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl",
						children: "From Elon to a beggar. One ladder."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
						children: [
							"Business owners, heirs, paychecks, and empty pockets. Width is ",
							flop.scale === "log" ? "logarithmic, so the bottom still exists" : "linear — true scale. Almost everyone disappears",
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 w-full rounded-lg border border-line bg-surface p-4 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindTag, { kind: pinnedRung.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-faint",
									children: pinnedRung.place
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-serif text-2xl text-fg",
								children: pinnedRung.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: pinnedRung.detail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-mono text-3xl leading-none tracking-tight text-gold tabular-nums sm:text-4xl",
								children: formatFullUSD(pinnedNow)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-2 font-mono text-sm tabular-nums ${delta < 0 ? "text-ember" : delta > 0 ? "text-gold-soft" : "text-faint"}`,
								children: pinnedRung.volatility > 0 ? `${formatDelta(delta)} this session · ${formatRate(rate)}` : "Anchor, not a ticking stock"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Vs a beggar",
								value: formatTimes(pinnedNow / street.netWorth)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Your years",
								value: shortYears(years)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Session",
								value: formatClock(flop.elapsed)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => flop.setScale(flop.scale === "log" ? "linear" : "log"),
							className: "h-11 flex-1 rounded-md border border-line bg-surface px-3 text-sm text-fg",
							children: flop.scale === "log" ? "Show true scale" : "Show log scale"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPlaying(true),
							className: "h-11 flex-1 rounded-md bg-ember px-3 text-sm font-medium text-bg",
							children: "Run the drop"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: [
							flop.job.title,
							" pay, every dollar kept, takes ",
							formatYears(years),
							" to equal ",
							pinnedRung.name,
							"."
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 lg:mt-0",
				children: ladder.map((rung, index) => {
					const value = rung.id === "you" ? flop.worth : worthNow(rung, flop.elapsed);
					const pct = barPercent(value, elonNow, flop.scale);
					const active = flop.pinned === rung.id;
					const heat = rung.id === "you" || rung.kind === "street";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => flop.setPinned(rung.id),
						className: `flex w-full gap-3 border-b border-line py-3 text-left ${active ? "bg-surface" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-7 shrink-0 pt-1 font-mono text-xs text-faint tabular-nums",
							children: index + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-baseline justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `truncate font-serif text-lg ${heat ? "text-gold-soft" : "text-fg"}`,
										children: [rung.name, rung.id === "you" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 font-mono text-xs uppercase tracking-widest text-ember",
											children: "you"
										}) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 font-mono text-sm tabular-nums text-gold",
										children: formatUSD(value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-2 block h-1.5 overflow-hidden rounded-full bg-surface-2",
									"aria-hidden": true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `block h-full rounded-full ${heat ? "bg-ember" : "bg-gold"}`,
										style: { width: `${pct}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-xs text-muted",
										children: rung.detail
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindTag, { kind: rung.kind })]
								})
							]
						})]
					}) }, rung.id);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinePrint, {}),
		playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropPlayer, { onClose: () => setPlaying(false) }) : null
	] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface px-2 py-3 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-mono text-xs text-fg tabular-nums sm:text-sm",
			children: value
		})]
	});
}
function shortYears(years) {
	if (!Number.isFinite(years)) return "—";
	if (years < 100) return `${years.toFixed(years < 10 ? 1 : 0)} yrs`;
	if (years < 1e4) return `${Math.round(years).toLocaleString("en-US")} yrs`;
	if (years < 1e6) return `${(years / 1e3).toFixed(1)}k yrs`;
	return `${(years / 1e6).toFixed(1)}M yrs`;
}
var DROP_MS = 16e3;
function DropPlayer({ onClose }) {
	const reduced = useReducedMotion();
	const beats = DROP_BEATS.map((id) => rungById(id)).filter((r) => Boolean(r));
	const progressRef = (0, import_react.useRef)(0);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [playing, setPlaying] = (0, import_react.useState)(!reduced);
	(0, import_react.useEffect)(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
		};
	}, [onClose]);
	(0, import_react.useEffect)(() => {
		if (!playing || beats.length < 2) return;
		let raf = 0;
		const span = beats.length - 1;
		const start = performance.now() - progressRef.current / span * DROP_MS;
		const tick = (now) => {
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
	const value = 10 ** (Math.log10(Math.max(from.netWorth, 1)) + (Math.log10(Math.max(to.netWorth, 1)) - Math.log10(Math.max(from.netWorth, 1))) * (safe >= span ? 1 : frac));
	const shown = frac < .55 && safe < span ? from : to;
	const done = safe >= span - .001 && !playing;
	const heat = shown.kind === "street" || shown.netWorth < 1e3;
	const between = RUNGS.filter((r) => r.netWorth < from.netWorth && r.netWorth > to.netWorth).slice(0, 3);
	function jump(next) {
		const clamped = Math.max(0, Math.min(span, next));
		progressRef.current = clamped;
		setProgress(clamped);
		setPlaying(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-30 flex flex-col bg-bg px-5 py-6",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Run the drop",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-lg flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-widest text-gold",
						children: "Capital flop"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "h-11 px-3 text-sm text-muted",
						children: "Close"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-1 overflow-hidden rounded-full bg-surface-2",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-gold",
						style: { width: `${safe / span * 100}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-widest text-faint",
							children: done ? "Bottom of the ladder" : `${from.name} down to ${to.name}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-6 font-mono text-3xl leading-none tracking-tight tabular-nums sm:text-5xl ${heat || done ? "text-ember" : "text-gold"}`,
							children: formatFullUSD(value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-serif text-4xl text-fg sm:text-5xl",
							children: done ? shown.name : to.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-md text-sm text-muted",
							children: done ? shown.detail : `Next stop is ${formatUSD(to.netWorth)}. The number in between is the fall, not a new net worth.`
						}),
						between.length > 0 && !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm text-faint",
							children: [
								"Also falling past ",
								between.map((r) => r.name).join(", "),
								"."
							]
						}) : null,
						done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 max-w-md font-serif text-2xl leading-snug text-fg",
							children: [
								"Eight dollars in a hand. Elon Musk’s anchor is ",
								formatTimes((rungById("elon")?.netWorth ?? 0) / 8),
								" that."
							]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md border border-line text-sm text-fg",
							onClick: () => jump(Math.max(0, Math.floor(safe) - (frac < .05 ? 1 : 0))),
							children: "Back"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md border border-line text-sm text-fg",
							onClick: () => {
								if (done || safe >= span) {
									progressRef.current = 0;
									setProgress(0);
									setPlaying(!reduced);
									return;
								}
								setPlaying((p) => !p);
							},
							children: done || safe >= span ? "Replay" : playing ? "Pause" : "Play"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md bg-ember text-sm font-medium text-bg",
							onClick: () => jump(Math.floor(safe) + 1),
							children: "Next"
						})
					]
				})
			]
		})
	});
}
function JobsView() {
	const flop = useFlop();
	const [mode, setMode] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const elon = rungById("elon");
	const elonNow = elon ? worthNow(elon, flop.elapsed) : 0;
	const list = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return JOBS.filter((job) => {
			if (mode === "job" && job.owner) return false;
			if (mode === "owner" && !job.owner) return false;
			if (!q) return true;
			return job.title.toLowerCase().includes(q) || job.field.toLowerCase().includes(q) || job.note.toLowerCase().includes(q);
		});
	}, [mode, query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-xs uppercase tracking-widest text-gold",
			children: "Profession vs money"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl",
			children: "The work, and who owns it."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
			children: "Put a paycheck on the ladder. Owners are in the same list — a cafe, a practice, a regional chain — then the fortunes those jobs never reach."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyInput, {
				label: "Annual pay",
				value: flop.pay,
				onChange: flop.setPay,
				hint: `${formatHourly(flop.pay)} · ${formatRate(perSecondPay(flop.pay))}`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyInput, {
				label: "Net worth to place on the ladder",
				value: flop.worth,
				onChange: flop.setWorth,
				hint: "This drops a You marker on the Drop tab."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
					label: "All",
					active: mode === "all",
					onClick: () => setMode("all")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
					label: "Jobs",
					active: mode === "job",
					onClick: () => setMode("job")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
					label: "Owners",
					active: mode === "owner",
					onClick: () => setMode("owner")
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-3 block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Search professions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Search nurse, owner, Walmart…",
				className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-fg placeholder:text-faint"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 flex flex-col gap-3",
			children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "rounded-lg border border-line px-4 py-8 text-center text-sm text-muted",
				children: "Nothing matches. Try nurse, founder, or cafe."
			}) : list.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobCard, {
				job,
				elonNow,
				selected: flop.job.id === job.id
			}, job.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinePrint, {})
	] });
}
function Filter({ label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `h-11 rounded-md px-4 text-sm ${active ? "bg-gold text-bg" : "border border-line bg-surface text-fg"}`,
		children: label
	});
}
function JobCard({ job, elonNow, selected }) {
	const flop = useFlop();
	const pair = job.pair ? rungById(job.pair) : void 0;
	const pairNow = pair ? worthNow(pair, flop.elapsed) : 0;
	const payPct = Math.min(100, job.annual / 43e4 * 100);
	const worthPct = barPercent(job.netWorth, elonNow, "log");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => flop.selectJob(job.id),
		className: `w-full rounded-lg border p-4 text-left ${selected ? "border-gold bg-surface" : "border-line bg-bg"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-serif text-xl text-fg",
					children: job.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-1 block text-xs text-muted",
					children: [job.field, job.owner ? " · business owner" : " · employee"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block font-mono text-sm text-gold tabular-nums",
						children: [formatUSD(job.annual), "/yr"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-mono text-xs text-faint",
						children: formatHourly(job.annual)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-3 block text-xs text-muted",
				children: "Pay against a surgeon’s median"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block h-1.5 overflow-hidden rounded-full bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block h-full rounded-full bg-gold-soft",
					style: { width: `${payPct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-3 flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Typical net worth, log scale vs Elon"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-fg tabular-nums",
					children: formatUSD(job.netWorth)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block h-1.5 overflow-hidden rounded-full bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block h-full rounded-full bg-ember",
					style: { width: `${worthPct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-3 block text-sm leading-relaxed text-muted",
				children: job.note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-2 block text-sm text-fg",
				children: [
					"Every dollar of this pay, kept, takes ",
					formatYears(yearsOfPay(elonNow, job.annual)),
					" to equal Elon.",
					pair ? ` ${formatYears(yearsOfPay(pairNow, job.annual))} to equal ${pair.name}.` : ""
				]
			})
		]
	}) });
}
var FILTERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "founder",
		label: "Founders"
	},
	{
		id: "heir",
		label: "Heirs"
	},
	{
		id: "operator",
		label: "Operators"
	},
	{
		id: "investor",
		label: "Investors"
	}
];
function OwnersView() {
	const flop = useFlop();
	const [query, setQuery] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)("elon");
	const named = (0, import_react.useMemo)(() => filterRungs(ownerRungs(true), flop.ownerFilter, query), [flop.ownerFilter, query]);
	const ground = (0, import_react.useMemo)(() => ownerRungs(false).filter((r) => !r.named && matches(r, query)), [query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-xs uppercase tracking-widest text-gold",
			children: "Business owners"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl",
			children: "Who actually holds the capital."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
			children: "Named fortunes tick around their October 2026 anchors. Under them: owners you could meet — a chain, a practice, a cafe — marked composite so they are not fake biographies."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex gap-2 overflow-x-auto pb-1",
			children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => flop.setOwnerFilter(f.id),
				className: `h-11 shrink-0 rounded-md px-4 text-sm ${flop.ownerFilter === f.id ? "bg-gold text-bg" : "border border-line bg-surface text-fg"}`,
				children: f.label
			}, f.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-3 block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Search owners"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Search Musk, Walmart, heir…",
				className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-fg placeholder:text-faint"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-6 font-mono text-xs uppercase tracking-widest text-faint",
			children: "Named fortunes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2",
			children: named.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "py-6 text-sm text-muted",
				children: "No named owner matches."
			}) : named.map((rung) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerRow, {
				rung,
				open: open === rung.id,
				onToggle: () => setOpen((id) => id === rung.id ? null : rung.id)
			}, rung.id))
		}),
		flop.ownerFilter === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-8 font-mono text-xs uppercase tracking-widest text-faint",
			children: "Closer to the ground"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2",
			children: ground.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "py-6 text-sm text-muted",
				children: "No composite owner matches."
			}) : ground.map((rung) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerRow, {
				rung,
				open: open === rung.id,
				onToggle: () => setOpen((id) => id === rung.id ? null : rung.id)
			}, rung.id))
		})] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinePrint, {})
	] });
}
function matches(rung, query) {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return rung.name.toLowerCase().includes(q) || rung.detail.toLowerCase().includes(q) || rung.place.toLowerCase().includes(q) || rung.kind.includes(q);
}
function filterRungs(rungs, filter, query) {
	return rungs.filter((r) => {
		if (filter !== "all" && r.kind !== filter) return false;
		return matches(r, query);
	});
}
function OwnerRow({ rung, open, onToggle }) {
	const flop = useFlop();
	const now = worthNow(rung, flop.elapsed);
	const delta = rung.volatility > 0 ? now - rung.netWorth : 0;
	const years = yearsOfPay(now, flop.pay);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "border-b border-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex w-full items-center gap-3 py-3 text-left",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-serif text-lg text-fg",
						children: rung.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 font-mono text-sm tabular-nums text-gold",
						children: formatUSD(now)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-1 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate text-xs text-muted",
						children: [
							rung.detail,
							" · ",
							rung.place
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindTag, { kind: rung.kind })]
				})]
			})
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `font-mono text-sm tabular-nums ${delta < 0 ? "text-ember" : delta > 0 ? "text-gold-soft" : "text-faint"}`,
					children: rung.volatility > 0 ? `${formatDelta(delta)} since you opened this app` : "Fixed composite. It does not pretend to tick."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: [
						flop.job.title,
						" would need ",
						formatYears(years),
						" of pay, every dollar kept, to match ",
						rung.name,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-3 h-11 rounded-md border border-line px-4 text-sm text-fg",
					onClick: () => {
						flop.setPinned(rung.id);
						flop.setTab("drop");
					},
					children: "See on the ladder"
				})
			]
		}) : null]
	});
}
function RaceView() {
	const flop = useFlop();
	const elon = rungById("elon");
	const elonNow = elon ? worthNow(elon, flop.elapsed) : 0;
	const samples = useSpark(elonNow, flop.elapsed);
	const pair = flop.job.pair ? rungById(flop.job.pair) : void 0;
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
		if (delta < 0) verdict = `Elon’s book fell ${formatUSD(Math.abs(delta))} while this paycheck added ${formatAccrual(accrued)}.`;
		else if (accrued > 0 && delta > 0) verdict = `The book gained ${formatCount(delta / accrued)} times what the paycheck added.`;
		else verdict = `Paycheck so far ${formatAccrual(accrued)}. The book is ${formatDelta(delta)}.`;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-xs uppercase tracking-widest text-gold",
			children: "Paycheck vs book"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl",
			children: "Capital does not clock in."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
			children: "A salary accrues every second of the year. A founder’s stake moves whether anyone is on shift."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-5 block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: "Your side of the race"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-fg",
				value: flop.job.id,
				onChange: (e) => flop.selectJob(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
					label: "Employees",
					children: JOBS.filter((j) => !j.owner).map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: j.id,
						children: j.title
					}, j.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
					label: "Business owners",
					children: JOBS.filter((j) => j.owner).map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: j.id,
						children: j.title
					}, j.id))
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-widest text-gold",
						children: "The book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2 font-serif text-2xl text-fg",
						children: "Elon Musk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "SpaceX, Tesla · live around the anchor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-mono text-3xl leading-none tracking-tight text-gold tabular-nums sm:text-4xl",
						children: formatFullUSD(elonNow)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: `mt-2 font-mono text-sm tabular-nums ${delta < 0 ? "text-ember" : "text-gold-soft"}`,
						children: [
							formatDelta(delta),
							" session · ",
							formatRate(rate)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spark, { samples })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg border border-line bg-bg p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-widest text-ember",
						children: "The paycheck"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2 font-serif text-2xl text-fg",
						children: flop.job.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							formatUSD(flop.pay),
							" / year · ",
							formatHourly(flop.pay),
							" on a 2,080-hour clock"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-mono text-3xl leading-none tracking-tight text-fg tabular-nums sm:text-4xl",
						children: formatAccrual(accrued)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-sm text-muted tabular-nums",
						children: [formatRate(payRate), " every second of the year"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: flop.job.note
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 font-serif text-2xl leading-snug text-fg",
			children: verdict
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-4 grid gap-2 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
					label: "Years of this pay to match Elon",
					value: formatYears(years)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
					label: "40-year careers, nothing spent",
					value: formatCount(careers)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
					label: pair ? `Years to match ${pair.name}` : "No paired owner",
					value: pair ? formatYears(pairYears) : "—"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinePrint, {})
	] });
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-mono text-sm text-gold tabular-nums",
			children: value
		})]
	});
}
function useSpark(value, elapsed) {
	const bucket = (0, import_react.useRef)(-1);
	const [samples, setSamples] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const b = Math.floor(elapsed);
		if (b === bucket.current) return;
		bucket.current = b;
		setSamples((prev) => [...prev, value].slice(-48));
	}, [elapsed, value]);
	return samples;
}
function Spark({ samples }) {
	if (samples.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-16 rounded-md bg-bg" });
	const min = Math.min(...samples);
	const span = Math.max(...samples) - min || 1;
	const w = 320;
	const h = 64;
	const d = samples.map((v, i) => {
		const x = i / (samples.length - 1) * w;
		const y = h - (v - min) / span * 56 - 4;
		return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: "mt-4 h-16 w-full",
		role: "img",
		"aria-label": "Elon Musk session move",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: "var(--color-gold)",
			strokeWidth: "2",
			vectorEffect: "non-scaling-stroke"
		})
	});
}
var TABS = [
	{
		id: "drop",
		label: "Drop",
		icon: ArrowDownWideNarrow
	},
	{
		id: "race",
		label: "Race",
		icon: Timer
	},
	{
		id: "jobs",
		label: "Jobs",
		icon: Briefcase
	},
	{
		id: "owners",
		label: "Owners",
		icon: Building2
	}
];
function FlopApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlopProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {}) });
}
function Shell() {
	const flop = useFlop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 pt-4 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-2xl italic text-gold",
							children: "Flop"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-widest text-muted",
							children: "CAPITAL"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-faint",
						children: "Live around 18 Oct 2026 anchors"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-mono text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-2 rounded-full bg-ember motion-safe:animate-pulse",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["LIVE ", formatClock(flop.elapsed)] })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 pb-28",
				children: [
					flop.tab === "drop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropView, {}) : null,
					flop.tab === "race" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RaceView, {}) : null,
					flop.tab === "jobs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobsView, {}) : null,
					flop.tab === "owners" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnersView, {}) : null
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg",
			"aria-label": "Sections",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-5xl grid-cols-4",
				children: TABS.map((tab) => {
					const Icon = tab.icon;
					const active = flop.tab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-current": active ? "page" : void 0,
						onClick: () => flop.setTab(tab.id),
						className: `flex h-16 flex-col items-center justify-center gap-1 text-xs ${active ? "text-gold" : "text-faint"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							strokeWidth: 1.75,
							"aria-hidden": true
						}), tab.label]
					}, tab.id);
				})
			})
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlopApp, {});
}
//#endregion
export { Home as component };
