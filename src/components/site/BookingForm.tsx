"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState, useSyncExternalStore, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { RATES, type Console } from "@/lib/data";

const noopSubscribe = () => () => {};

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const input = "w-full border-[1.5px] border-line bg-bg2 px-3.5 py-3 outline-none [color-scheme:dark] transition-colors focus:border-cyan";
const label = "grid gap-1.5 text-[0.8rem] font-semibold uppercase tracking-wider text-muted";

function Price({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 160, damping: 20 });
  const text = useTransform(spring, (v) => `₹${Math.round(v)}`);
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return <motion.b className="font-display text-3xl text-lime">{text}</motion.b>;
}

function Stepper({ value, onChange, min, max, label: l }: { value: number; onChange: (n: number) => void; min: number; max: number; label: string }) {
  return (
    <div className="flex w-fit items-center border-[1.5px] border-line">
      <motion.button whileTap={{ scale: 0.85 }} type="button" className="size-11 cursor-pointer bg-bg2 text-xl hover:text-cyan" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`Fewer ${l}`}>
        −
      </motion.button>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b key={value} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }} className="w-12 text-center text-lg">
          {value}
        </motion.b>
      </AnimatePresence>
      <motion.button whileTap={{ scale: 0.85 }} type="button" className="size-11 cursor-pointer bg-bg2 text-xl hover:text-cyan" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`More ${l}`}>
        +
      </motion.button>
    </div>
  );
}

function Card({ children, ...rest }: { children: ReactNode } & ComponentProps<typeof motion.form>) {
  return (
    <motion.form className="grid gap-3.5 border-[1.5px] border-line bg-panel p-6 sm:p-7 [clip-path:polygon(18px_0,100%_0,100%_calc(100%-18px),calc(100%-18px)_100%,0_100%,0_18px)]" {...rest}>
      {children}
    </motion.form>
  );
}

export default function BookingForm() {
  const [consoleType, setConsole] = useState<Console>("PS5");
  const [players, setPlayers] = useState(2);
  const [hours, setHours] = useState(1);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  // "today" must come from the visitor's clock, not the build (empty on the server).
  const minDate = useSyncExternalStore(noopSubscribe, today, () => "");
  const [picked, setDate] = useState("");
  const date = picked || minDate;

  const maxPlayers = consoleType === "PS5" ? 4 : 2;
  const p = Math.min(players, maxPlayers);
  const estimate = RATES[consoleType][p] * hours;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/cafe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addBooking", ...data, console: consoleType, players: p, hours }),
    }).catch(() => null);
    if (res?.ok) return setState("done");
    setState("idle");
    setError((await res?.json().catch(() => null))?.error ?? "Network error, dobara try karo.");
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="grid justify-items-center gap-3 border-[1.5px] border-lime bg-panel px-6 py-12 text-center"
        >
          <motion.div
            className="pixel text-5xl text-lime [text-shadow:4px_4px_0_var(--color-pink)]"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: [0, 1.4, 1], rotate: 0 }}
            transition={{ duration: 0.6 }}
          >
            GG!
          </motion.div>
          <h3 className="text-xl">Booking request mil gayi 🎮</h3>
          <p className="text-muted">Hum WhatsApp/call pe confirm karenge. Time pe aa jaana, station ready milega!</p>
          <button className="btn btn-ghost mt-2" onClick={() => setState("idle")}>
            Ek aur booking
          </button>
        </motion.div>
      ) : (
        <Card key="form" onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={label}>
              Naam
              <input name="name" required placeholder="Gamer tag ya naam" className={input} />
            </label>
            <label className={label}>
              Mobile
              <input name="phone" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} placeholder="98XXXXXXXX" className={input} />
            </label>
          </div>

          <div className={label}>Console</div>
          <div className="grid grid-cols-2 gap-2.5">
            {(["PS5", "PS2"] as const).map((c) => (
              <motion.button
                type="button"
                key={c}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setConsole(c)}
                className={`relative cursor-pointer border-[1.5px] bg-bg2 p-3 text-left font-display text-xl transition-colors ${consoleType === c ? "border-pink" : "border-line"}`}
              >
                {consoleType === c && <motion.span layoutId="console-pick" className="absolute inset-0 bg-pink/15" />}
                <span className="relative">
                  {c}
                  <small className="block font-body text-xs text-muted">{c === "PS5" ? "4K · up to 4 players" : "Retro · up to 2 players"}</small>
                </span>
              </motion.button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className={label}>
              Date
              <input type="date" name="date" required min={minDate || undefined} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
            </label>
            <label className={label}>
              Time
              <input type="time" name="time" required min="11:00" max="22:00" defaultValue="18:00" className={input} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <span className={label}>Players</span>
              <Stepper value={p} onChange={setPlayers} min={1} max={maxPlayers} label="players" />
            </div>
            <div className="grid gap-1.5">
              <span className={label}>Hours</span>
              <Stepper value={hours} onChange={setHours} min={1} max={6} label="hours" />
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-2.5 border-l-[3px] border-lime bg-bg2 px-3.5 py-3">
            <span className="text-sm text-muted">Gaming estimate</span>
            <Price value={estimate} />
            <small className="w-full text-muted">Food alag se. Pay at cafe.</small>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: [0, -8, 8, -4, 4, 0] }} exit={{ opacity: 0 }} className="text-sm text-red" role="alert">
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn btn-pink" disabled={state === "sending"}>
            {state === "sending" ? "Booking…" : "Book Station ▶"}
          </motion.button>
        </Card>
      )}
    </AnimatePresence>
  );
}
