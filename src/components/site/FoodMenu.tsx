"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MENU, MENU_CATEGORIES, type MenuCategory } from "@/lib/data";

export const CATEGORY_ICON: Record<MenuCategory, string> = {
  Pizza: "🍕", Chinese: "🍜", Starters: "🍟", "Burgers & Wraps": "🍔", Drinks: "🥤", Shakes: "🥛", "Ice Cream": "🍨",
};

export default function FoodMenu({ unavailable = [] }: { unavailable?: string[] }) {
  const [cat, setCat] = useState<MenuCategory>("Pizza");
  const [vegOnly, setVegOnly] = useState(false);
  const items = MENU.filter((m) => m.category === cat && (!vegOnly || m.veg)).map((m) => ({ ...m, available: !unavailable.includes(m.id) }));

  return (
    <div className="grid gap-5 md:grid-cols-[230px_1fr]">
      <div className="flex gap-1.5 overflow-x-auto pb-1 md:grid md:content-start md:overflow-visible" role="tablist">
        {MENU_CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`relative flex-none cursor-pointer border px-3.5 py-3 text-left font-semibold transition-colors ${cat === c ? "border-pink text-white" : "border-line bg-panel hover:border-cyan"}`}
          >
            {cat === c && <motion.span layoutId="menu-cat" className="absolute inset-0 bg-pink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative whitespace-nowrap">
              <span aria-hidden="true">{CATEGORY_ICON[c]}</span> {c}
            </span>
          </button>
        ))}
      </div>

      <div className="min-h-[380px] border border-line bg-panel px-5 py-5 sm:px-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <AnimatePresence mode="wait">
            <motion.h3 key={cat} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="text-2xl">
              <motion.span className="inline-block" initial={{ rotate: -30, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 12 }}>
                {CATEGORY_ICON[cat]}
              </motion.span>{" "}
              {cat}
            </motion.h3>
          </AnimatePresence>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="size-4 accent-veg" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
            <span className="veg-mark" /> Veg only
          </label>
        </div>

        <ul>
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((m, i) => (
              <motion.li
                key={m.id}
                layout
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: m.available ? 1 : 0.5, x: 0, transition: { delay: i * 0.04 } }}
                exit={{ opacity: 0, x: -30, transition: { duration: 0.15 } }}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3.5 border-b border-dashed border-line py-3.5 last:border-b-0"
              >
                <span className={`veg-mark${m.veg ? "" : " non"}`} title={m.veg ? "Veg" : "Non-veg"} />
                <div>
                  <b className="font-semibold">
                    {m.name}
                    {m.bestseller && <em className="ml-2 text-[0.68rem] font-bold whitespace-nowrap text-yellow not-italic">★ Bestseller</em>}
                  </b>
                  {m.desc && <small className="block text-[0.82rem] text-muted">{m.desc}</small>}
                  {!m.available && <small className="block text-[0.82rem] text-red">Abhi available nahi</small>}
                </div>
                <span className="font-display text-lg text-lime">₹{m.price}</span>
              </motion.li>
            ))}
          </AnimatePresence>
          {!items.length && <li className="py-4 text-muted">Is category mein veg item nahi hai</li>}
        </ul>
      </div>
    </div>
  );
}
