"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { GAMES, type Console } from "@/lib/data";

const GENRE_ICON: Record<string, string> = {
  Football: "⚽", Fighting: "🥊", Wrestling: "🤼", Action: "🕷️", "Open World": "🚗", Shooter: "🎯", Racing: "🏎️", "Co-op": "🤝",
};

export default function GameLibrary() {
  const [tab, setTab] = useState<Console>("PS5");
  const [genre, setGenre] = useState("All");
  const genres = ["All", ...new Set(GAMES.filter((g) => g.console === tab).map((g) => g.genre))];
  const list = GAMES.filter((g) => g.console === tab && (genre === "All" || g.genre === genre));

  return (
    <>
      <div className="mb-4 inline-flex gap-1 border border-line bg-panel p-1" role="tablist">
        {(["PS5", "PS2"] as const).map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={tab === c}
            onClick={() => {
              setTab(c);
              setGenre("All");
            }}
            className={`relative cursor-pointer px-5 py-2.5 font-bold transition-colors ${tab === c ? "text-[#04121a]" : "text-text"}`}
          >
            {tab === c && <motion.span layoutId="console-tab" className="absolute inset-0 bg-cyan" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
            <span className="relative">
              {c} <small className="font-normal opacity-70">{GAMES.filter((g) => g.console === c).length} games</small>
            </span>
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {genres.map((g) => (
          <motion.button
            key={g}
            whileTap={{ scale: 0.92 }}
            onClick={() => setGenre(g)}
            className={`cursor-pointer border px-3 py-1.5 text-sm font-semibold transition-colors ${genre === g ? "border-pink bg-pink/15 text-pink" : "border-line text-muted hover:text-text"}`}
          >
            {GENRE_ICON[g] ?? "🎮"} {g}
          </motion.button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        <AnimatePresence mode="popLayout">
          {list.map((g, i) => (
            <motion.article
              key={g.console + g.title}
              layout
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.03, type: "spring", stiffness: 300, damping: 24 } }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              whileHover={{ x: 6, borderColor: "var(--color-pink)" }}
              className="group relative flex items-center gap-3.5 border border-line bg-panel px-4 py-3.5"
            >
              <motion.span className="grid size-11 flex-none place-items-center bg-panel2 text-2xl" whileHover={{ rotate: [0, -12, 12, 0], scale: 1.15 }} aria-hidden="true">
                {GENRE_ICON[g.genre] ?? "🎮"}
              </motion.span>
              <div>
                <h3 className="font-body text-base leading-tight font-bold">{g.title}</h3>
                <small className="text-muted">
                  {g.genre} · {g.players} players
                </small>
              </div>
              {g.hot && (
                <motion.span
                  className="pixel absolute top-2 right-2 bg-red px-1.5 py-1 text-[0.5rem] text-white"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  HOT
                </motion.span>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      <p className="mt-4 text-sm text-muted">Aur bhi games hain! Koi specific game chahiye to WhatsApp kar do, available hua to ready rakhenge.</p>
    </>
  );
}
