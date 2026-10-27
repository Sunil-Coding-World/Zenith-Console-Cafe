"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { PARTY_ADDONS, PARTY_PACKAGES, PARTY_TYPES, partyQuote, type PartyType } from "@/lib/data";

const noopSubscribe = () => () => {};
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const input = "w-full border-[1.5px] border-line bg-bg2 px-3.5 py-3 outline-none [color-scheme:dark] transition-colors focus:border-yellow";
const label = "grid gap-1.5 text-[0.8rem] font-semibold uppercase tracking-wider text-muted";

function Money({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(value, { stiffness: 160, damping: 22 });
  const text = useTransform(spring, (v) => "₹" + Math.round(v).toLocaleString("en-IN"));
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return <motion.b className={className}>{text}</motion.b>;
}

export default function PartyPlanner() {
  const [type, setType] = useState<PartyType>("birthday");
  const [pkgId, setPkg] = useState("levelup");
  const [guests, setGuests] = useState(10);
  const [addons, setAddons] = useState<string[]>(["cake"]);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const minDate = useSyncExternalStore(noopSubscribe, today, () => "");
  const [picked, setDate] = useState("");
  const date = picked || minDate;

  const pkg = PARTY_PACKAGES.find((p) => p.id === pkgId)!;
  const g = Math.min(pkg.maxGuests, Math.max(pkg.minGuests, guests));
  const q = partyQuote(pkg.id, g, addons);

  function pickType(t: PartyType) {
    setType(t);
    if (t === "kitty") setPkg("kitty");
    else if (t === "private" || t === "corporate") setPkg("takeover");
    else if (pkgId === "kitty") setPkg("levelup");
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/cafe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addParty", ...data, type, pkg: pkg.id, guests: g, addons }),
    }).catch(() => null);
    if (res?.ok) return setState("done");
    setState("idle");
    setError((await res?.json().catch(() => null))?.error ?? "Network error, dobara try karo.");
  }

  return (
    <div className="grid gap-6">
      {/* party type chips */}
      <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Party type">
        {PARTY_TYPES.map((t) => (
          <motion.button
            key={t.id}
            role="tab"
            aria-selected={type === t.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => pickType(t.id)}
            className={`relative cursor-pointer border-[1.5px] px-4 py-2.5 font-semibold transition-colors ${type === t.id ? "border-yellow text-[#1a1400]" : "border-line bg-panel hover:border-yellow/60"}`}
          >
            {type === t.id && <motion.span layoutId="party-type" className="absolute inset-0 bg-yellow" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
            <span className="relative">
              {t.icon} {t.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* packages */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PARTY_PACKAGES.map((p, i) => {
          const on = p.id === pkgId;
          return (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => setPkg(p.id)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={on}
              className={`relative flex cursor-pointer flex-col overflow-hidden border-[1.5px] bg-panel p-5 text-left transition-[border-color,box-shadow] ${on ? "border-yellow shadow-[0_0_40px_-10px_rgba(255,210,63,.6)]" : "border-line"}`}
            >
              {p.featured && <span className="pixel absolute top-3 -right-10 rotate-[35deg] bg-pink px-10 py-1 text-[0.45rem] text-white">POPULAR</span>}
              <span className="pixel text-[0.55rem] text-yellow">
                {p.minGuests}–{p.maxGuests} GUESTS · {p.hours} HRS
              </span>
              <h3 className="mt-2 text-xl">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <b className="font-display text-3xl text-yellow">₹{p.price.toLocaleString("en-IN")}</b>
                <small className="text-muted">{p.perPerson ? "/ person" : "/ party"}</small>
              </div>
              <small className="mt-1 text-cyan">{p.stations}</small>
              <ul className="mt-3 grid gap-1.5 text-sm">
                {p.includes.map((x) => (
                  <li key={x}>
                    <span className="text-lime">✓</span> {x}
                  </li>
                ))}
              </ul>
              <AnimatePresence>
                {on && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 bottom-3 grid size-7 place-items-center rounded-full bg-yellow font-bold text-[#1a1400]">
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* enquiry form */}
      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative grid justify-items-center gap-3 overflow-hidden border-[1.5px] border-yellow bg-panel px-6 py-12 text-center"
          >
            {["🎉", "🎈", "🎂", "🎮", "✨", "🎊"].map((c, i) => (
              <motion.span
                key={i}
                className="absolute text-3xl"
                style={{ left: `${10 + i * 15}%`, top: "60%" }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -160, opacity: [0, 1, 0], rotate: 180 }}
                transition={{ duration: 1.8, delay: i * 0.12, repeat: Infinity, repeatDelay: 1 }}
                aria-hidden="true"
              >
                {c}
              </motion.span>
            ))}
            <div className="pixel text-3xl text-yellow [text-shadow:3px_3px_0_var(--color-pink)]">PARTY ON!</div>
            <h3 className="text-xl">Party enquiry mil gayi 🎉</h3>
            <p className="max-w-md text-muted">
              Hum 2 ghante mein call/WhatsApp karenge. Date lock karne ke liye ₹{q.advance.toLocaleString("en-IN")} advance (30%) lagega.
            </p>
            <button className="btn btn-ghost mt-2" onClick={() => setState("idle")}>
              Ek aur enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="grid gap-5 border-[1.5px] border-line bg-panel p-6 sm:p-7 lg:grid-cols-[1.3fr_1fr]"
          >
            <div className="grid content-start gap-3.5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={label}>
                  Naam
                  <input name="name" required placeholder="Host ka naam" className={input} />
                </label>
                <label className={label}>
                  Mobile
                  <input name="phone" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} placeholder="98XXXXXXXX" className={input} />
                </label>
                <label className={label}>
                  Date
                  <input type="date" name="date" required min={minDate || undefined} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
                </label>
                <label className={label}>
                  Start time
                  <input type="time" name="time" required min="11:00" max="21:00" defaultValue="16:00" className={input} />
                </label>
              </div>

              <div className="grid gap-1.5">
                <span className={label}>
                  Guests ({pkg.minGuests}–{pkg.maxGuests})
                </span>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={pkg.minGuests}
                    max={pkg.maxGuests}
                    value={g}
                    onChange={(e) => setGuests(+e.target.value)}
                    className="flex-1 accent-yellow"
                    aria-label="Number of guests"
                  />
                  <b className="font-display w-12 text-center text-2xl text-yellow">{g}</b>
                </div>
              </div>

              <div className="grid gap-1.5">
                <span className={label}>Add-ons</span>
                <div className="flex flex-wrap gap-2">
                  {PARTY_ADDONS.map((a) => {
                    const on = addons.includes(a.id);
                    return (
                      <motion.button
                        type="button"
                        key={a.id}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setAddons((s) => (on ? s.filter((x) => x !== a.id) : [...s, a.id]))}
                        aria-pressed={on}
                        className={`cursor-pointer border px-3 py-1.5 text-sm font-semibold transition-colors ${on ? "border-lime bg-lime/15 text-lime" : "border-line text-muted hover:text-text"}`}
                      >
                        {on ? "✓ " : "+ "}
                        {a.label} · ₹{a.price}
                        {"perGuest" in a && a.perGuest ? "/guest" : ""}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <label className={label}>
                Kuch special? (theme, cake flavour, GST bill…)
                <textarea name="notes" rows={2} maxLength={300} className={input} placeholder="e.g. Football theme, eggless cake" />
              </label>
            </div>

            {/* live quote */}
            <div className="grid content-start gap-3 border-[1.5px] border-dashed border-yellow/50 bg-bg2 p-5">
              <span className="pixel text-[0.6rem] text-yellow">YOUR PARTY QUOTE</span>
              <div className="flex justify-between text-sm">
                <span className="text-muted">
                  {pkg.name}
                  {pkg.perPerson ? ` × ${g}` : ""}
                </span>
                <Money value={q.base} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Add-ons</span>
                <Money value={q.extras} />
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <span>Total</span>
                <Money value={q.total} className="font-display text-3xl text-yellow" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Advance to lock date (30%)</span>
                <Money value={q.advance} className="text-lime" />
              </div>
              <small className="text-muted">≈ ₹{Math.round(q.total / g)} per guest · Final quote call pe confirm hoga.</small>
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, x: [0, -8, 8, -4, 4, 0] }} exit={{ opacity: 0 }} className="text-sm text-red" role="alert">
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn mt-1 bg-yellow text-[#1a1400]" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "🎉 Send Party Enquiry"}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
