"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Pixel";
import { MENU, MENU_CATEGORIES, STATIONS, type MenuCategory } from "@/lib/data";
import { CATEGORY_ICON } from "./FoodMenu";

export default function OrderApp({ initialStation, unavailable }: { initialStation: string; unavailable: string[] }) {
  const [station, setStation] = useState(initialStation);
  const [cat, setCat] = useState<MenuCategory>("Pizza");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const lines = Object.entries(cart).filter(([, q]) => q > 0);
  const count = lines.reduce((s, [, q]) => s + q, 0);
  const total = lines.reduce((s, [id, q]) => s + (MENU.find((m) => m.id === id)?.price ?? 0) * q, 0);
  const change = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));

  async function place() {
    setError("");
    setStatus("sending");
    const res = await fetch("/api/cafe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addOrder", source: station || "Counter", note, items: lines.map(([menuId, qty]) => ({ menuId, qty })) }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (res?.ok) {
      setOrderId(data.order.id);
      setCart({});
      setNote("");
      setStatus("done");
    } else {
      setStatus("idle");
      setError(data?.error ?? "Network error");
    }
  }

  if (status === "done") {
    return (
      <motion.main initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="grid min-h-screen place-content-center justify-items-center gap-3.5 p-5 text-center">
        <motion.div
          className="pixel text-2xl text-lime [text-shadow:3px_3px_0_var(--color-pink)]"
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: [0, 1.3, 1], rotate: 0 }}
          transition={{ duration: 0.6 }}
        >
          ORDER PLACED!
        </motion.div>
        <motion.div className="text-6xl" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
          🍕
        </motion.div>
        <p>
          Order <b>#{orderId}</b> kitchen mein pahunch gaya. {station ? `${station} pe deliver hoga.` : "Counter se collect karein."}
        </p>
        <p className="text-muted">{station ? "Amount aapke station ke bill mein add ho gaya hai." : "Counter pe pay karein."}</p>
        <button className="btn btn-pink" onClick={() => setStatus("idle")}>
          Aur order karo
        </button>
      </motion.main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-[560px] px-4 pb-36">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-bg py-3.5">
        <Link href="/">
          <Logo />
        </Link>
        <select value={station} onChange={(e) => setStation(e.target.value)} aria-label="Your station" className="max-w-[52%] border-[1.5px] border-pink bg-panel px-3 py-2.5">
          <option value="">Counter / Takeaway</option>
          {STATIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </header>

      <div className="flex gap-2 overflow-x-auto py-3.5">
        {MENU_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`relative flex-none cursor-pointer border px-3.5 py-2 font-semibold ${cat === c ? "border-pink text-white" : "border-line bg-panel"}`}>
            {cat === c && <motion.span layoutId="order-cat" className="absolute inset-0 bg-pink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative whitespace-nowrap">
              {CATEGORY_ICON[c]} {c}
            </span>
          </button>
        ))}
      </div>

      <ul>
        <AnimatePresence mode="popLayout" initial={false}>
          {MENU.filter((m) => m.category === cat).map((m, i) => {
            const off = unavailable.includes(m.id);
            const q = cart[m.id] ?? 0;
            return (
              <motion.li
                key={m.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: off ? 0.45 : 1, y: 0, transition: { delay: i * 0.03 } }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-dashed border-line py-3.5"
              >
                <span className={`veg-mark${m.veg ? "" : " non"}`} title={m.veg ? "Veg" : "Non-veg"} />
                <div>
                  <b>{m.name}</b>
                  <small className={`block font-semibold ${off ? "text-red" : "text-lime"}`}>{off ? "Out of stock" : `₹${m.price}`}</small>
                </div>
                {off ? null : q ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center border-[1.5px] border-lime">
                    <motion.button whileTap={{ scale: 0.8 }} className="size-9 cursor-pointer text-lg text-lime" onClick={() => change(m.id, -1)} aria-label={`Remove ${m.name}`}>
                      −
                    </motion.button>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.b key={q} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="w-7 text-center">
                        {q}
                      </motion.b>
                    </AnimatePresence>
                    <motion.button whileTap={{ scale: 0.8 }} className="size-9 cursor-pointer text-lg text-lime" onClick={() => change(m.id, 1)} aria-label={`Add ${m.name}`}>
                      +
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} className="cursor-pointer border-[1.5px] border-lime px-4 py-2 font-bold text-lime" onClick={() => change(m.id, 1)}>
                    ADD
                  </motion.button>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 140 }}
            animate={{ y: 0 }}
            exit={{ y: 140 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-1/2 grid w-[min(560px,100%)] -translate-x-1/2 gap-2.5 border-t-2 border-lime bg-panel px-4 pt-3.5 pb-5"
          >
            <input placeholder="Note (e.g. less spicy)" value={note} onChange={(e) => setNote(e.target.value)} maxLength={120} className="border border-line bg-bg2 px-3 py-2.5" />
            {error && <p className="text-sm text-red">{error}</p>}
            <motion.button whileTap={{ scale: 0.97 }} className="btn btn-lime w-full" onClick={place} disabled={status === "sending"}>
              {status === "sending" ? "Placing…" : `Place order · ${count} items · ₹${total}`}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
