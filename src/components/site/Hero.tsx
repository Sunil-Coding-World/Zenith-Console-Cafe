"use client";

import { AnimatePresence, motion, useScroll, useTransform, type TargetAndTransition } from "motion/react";
import { useEffect, useState } from "react";
import Pixel, { type SpriteName } from "@/components/Pixel";
import { CAFE, RATES } from "@/lib/data";

const PLAYERS: { sprite: SpriteName; name: string; cls: string; fav: string; fx: string; glow: string; stats: [string, number][] }[] = [
  { sprite: "fighter", name: "BLAZE", cls: "Street Fighter", fav: "Tekken 8", fx: "POW!", glow: "rgba(255,59,92,.45)", stats: [["Power", 86], ["Speed", 92], ["Combo", 95]] },
  { sprite: "wrestler", name: "TITAN", cls: "Ring Champion", fav: "WWE 2K24", fx: "SLAM!", glow: "rgba(164,59,255,.5)", stats: [["Power", 99], ["Speed", 54], ["Stamina", 90]] },
  { sprite: "striker", name: "KICKER", cls: "Goal Machine", fav: "EA FC 25", fx: "GOAL!", glow: "rgba(182,255,46,.4)", stats: [["Shot", 97], ["Pace", 91], ["Skill", 88]] },
  { sprite: "gamer", name: "PIXEL", cls: "Cafe Legend", fav: "Sab kuch!", fx: "+1 XP", glow: "rgba(25,230,255,.45)", stats: [["Hunger", 100], ["Focus", 80], ["Luck", 77]] },
];

// Per-character idle loop.
const IDLE: Record<SpriteName, TargetAndTransition> = {
  fighter: { x: [0, 0, 16, -2, 0], skewX: [0, 0, -6, 0, 0], transition: { duration: 1.3, repeat: Infinity, times: [0, 0.6, 0.7, 0.8, 1] } },
  wrestler: { scaleX: [1, 1.07, 0.98, 1], scaleY: [1, 0.95, 1.05, 1], transition: { duration: 1.6, repeat: Infinity } },
  striker: { y: [0, -6, 0], transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" } },
  gamer: { y: [0, -8, 0], rotate: [0, -2, 2, 0], transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } },
};

const SHAPES = [
  { ch: "▲", c: "text-lime", pos: "top-[18%] left-[6%]", depth: -120, size: "text-4xl" },
  { ch: "●", c: "text-pink", pos: "top-[30%] right-[4%]", depth: 160, size: "text-2xl" },
  { ch: "✚", c: "text-cyan", pos: "top-[72%] left-[44%]", depth: -80, size: "text-4xl" },
  { ch: "■", c: "text-yellow", pos: "top-[12%] left-[48%]", depth: 100, size: "text-xl" },
  { ch: "★", c: "text-pink", pos: "top-[60%] left-[3%]", depth: 140, size: "text-xl" },
];

const TITLE = ["GAME", "ON."];

export default function Hero() {
  const { scrollY } = useScroll();
  const floorY = useTransform(scrollY, [0, 600], [0, 120]);
  const copyY = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(ellipse_at_75%_30%,rgba(255,46,136,.22),transparent_55%),radial-gradient(ellipse_at_15%_70%,rgba(25,230,255,.16),transparent_55%)] pt-[100px]">
      {/* background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.div style={{ y: floorY }} className="grid-floor absolute -inset-x-1/2 -bottom-[10%] h-[60%] animate-floor" />
        {SHAPES.map((s) => (
          <ParallaxShape key={s.pos} {...s} />
        ))}
      </div>

      <div className="relative mx-auto grid w-[min(1200px,100%-32px)] flex-1 items-center gap-10 pb-10 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div style={{ y: copyY }}>
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="pixel inline-flex items-center gap-2 text-[0.62rem] uppercase text-cyan">
            <span className="size-2 animate-pulse rounded-full bg-lime shadow-[0_0_10px_var(--color-lime)]" /> Now Open · {CAFE.hours}
          </motion.span>

          <h1 className="my-5 grid text-[clamp(3rem,8vw,6.4rem)]">
            <span className="glitch text-white [text-shadow:0_0_24px_rgba(255,46,136,.6)]" data-text="GAME ON.">
              {TITLE.map((w, wi) => (
                <span key={w} className="inline-block whitespace-nowrap">
                  {[...w].map((ch, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ y: 80, opacity: 0, rotate: 12 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.15 + (wi * 4 + i) * 0.05, type: "spring", stiffness: 300, damping: 18 }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                  {wi === 0 && " "}
                </span>
              ))}
            </span>
            <motion.span className="text-outline" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
              FOOD ON.
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="max-w-xl text-[1.08rem] text-muted">
            2× PS5 aur 2× PS2 stations, bade screens, extra controllers. FC 25, Tekken 8, WWE 2K24 khelo, aur saath mein garam pizza, Chinese,
            shakes aur ice cream. <b className="text-text">{CAFE.name}</b>: dosto ke saath best adda.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="mt-7 flex flex-wrap gap-3">
            <motion.a href="#book" className="btn btn-pink" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
              ▶ Book a Station
            </motion.a>
            <motion.a href="#menu" className="btn btn-ghost" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
              🍕 See Menu
            </motion.a>
            <motion.a href="#parties" className="btn btn-ghost" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
              🎉 Plan a Party
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 1 } } }}
          >
            {[
              [`₹${RATES.PS5[1]}`, "PS5 / hr"],
              [`₹${RATES.PS2[1]}`, "PS2 / hr"],
              ["30+", "Food items"],
            ].map(([v, l]) => (
              <motion.div
                key={l}
                variants={{ hidden: { opacity: 0, y: 20, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1 } }}
                className="clip-corner border border-line bg-panel/70 px-4 py-2.5"
              >
                <b className="font-display block text-[1.6rem] text-yellow">{v}</b>
                <span className="text-[0.78rem] uppercase tracking-wider text-muted">{l}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9, rotateY: -20 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
          <CharacterSelect />
        </motion.div>
      </div>

      <div className="relative -rotate-1 scale-[1.02] overflow-hidden whitespace-nowrap bg-pink py-2.5 text-[0.66rem] text-white" aria-hidden="true">
        <div className="pixel inline-flex animate-marquee">
          {[0, 1].map((k) => (
            <span key={k} className="pr-10">
              ★ BIRTHDAY &amp; KITTY PARTY PACKAGES FROM ₹2999 ★ HAPPY HOURS 11AM–3PM: 20% OFF GAMING ★ TEKKEN 8 TOURNAMENT THIS SATURDAY ★ SQUAD NIGHT COMBO ₹1299 ★ NEW: OREO SHAKE ★ BOOK ONLINE, SKIP THE WAIT
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParallaxShape({ ch, c, pos, depth, size }: (typeof SHAPES)[number]) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, depth]);
  return (
    <motion.span style={{ y }} className={`absolute hidden sm:block ${pos} ${c} ${size} opacity-40 [text-shadow:0_0_20px_currentColor]`}>
      <motion.span className="inline-block" animate={{ rotate: [0, 25, 0], y: [0, -24, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
        {ch}
      </motion.span>
    </motion.span>
  );
}

function CharacterSelect() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % PLAYERS.length), 2800);
    return () => clearInterval(t);
  }, [paused]);

  const p = PLAYERS[active];

  return (
    <div
      className="relative border-2 border-line bg-gradient-to-b from-panel2/90 to-bg2/90 p-4 shadow-[0_0_0_1px_rgba(25,230,255,.15),0_30px_80px_-20px_rgba(255,46,136,.35)] [clip-path:polygon(18px_0,100%_0,100%_calc(100%-18px),calc(100%-18px)_100%,0_100%,0_18px)]"
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pixel mb-3 animate-blink text-center text-[0.72rem] text-yellow">SELECT YOUR PLAYER</div>

      <motion.div
        className="relative grid h-[300px] grid-cols-2 items-end overflow-hidden sm:h-[330px]"
        animate={{ background: `radial-gradient(circle at 30% 70%, ${p.glow}, transparent 60%)` }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-x-0 bottom-0 h-10 border-t-2 border-line bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.06)_0_20px,transparent_20px_40px)]" />
        <div className="absolute bottom-[30px] left-[8%] h-[18px] w-[40%] rounded-[50%] bg-black/60 blur-sm" />

        <AnimatePresence mode="wait">
          <motion.div
            key={p.sprite}
            className="relative mb-[34px] ml-[8%] w-[82%] max-w-[200px]"
            initial={{ x: -80, opacity: 0, scale: 0.6 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 80, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
          >
            <motion.div animate={IDLE[p.sprite]}>
              <Pixel name={p.sprite} className="w-full drop-shadow-[0_0_14px_rgba(255,255,255,.25)] [image-rendering:pixelated]" title={`${p.name}, ${p.cls}`} />
            </motion.div>
            <motion.span
              className="pixel absolute -top-6 left-0 text-[1.05rem] text-yellow [text-shadow:3px_3px_0_var(--color-pink)]"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.3, 1, 1, 0], rotate: -8 }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.3, times: [0, 0.15, 0.3, 0.8, 1] }}
            >
              {p.fx}
            </motion.span>
            {p.sprite === "striker" && (
              <motion.span
                className="absolute bottom-0 right-0 text-3xl"
                aria-hidden="true"
                animate={{ x: [0, 150], y: [0, -170], rotate: [0, 540], opacity: [1, 1, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.4, ease: [0.2, 0.7, 0.3, 1], times: [0, 0.9, 1] }}
              >
                ⚽
              </motion.span>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={p.name}
            className="relative pr-1.5 pb-[54px]"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <b className="font-display block text-[1.5rem] text-white [text-shadow:0_0_18px_rgba(25,230,255,.6)] sm:text-[2rem]">{p.name}</b>
            <small className="mb-3.5 block text-muted">
              {p.cls} · Fav: {p.fav}
            </small>
            <ul className="grid gap-2">
              {p.stats.map(([k, v], i) => (
                <li key={k} className="grid grid-cols-[64px_1fr] items-center gap-2 text-[0.72rem] uppercase tracking-wider text-muted">
                  <span>{k}</span>
                  <span className="h-2 bg-bg2">
                    <motion.i
                      className="block h-full bg-gradient-to-r from-lime to-yellow"
                      initial={{ width: 0 }}
                      animate={{ width: `${v}%` }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="mt-3 grid grid-cols-4 gap-2" role="tablist" aria-label="Characters">
        {PLAYERS.map((pl, i) => (
          <motion.button
            key={pl.sprite}
            role="tab"
            aria-selected={i === active}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.92 }}
            onMouseEnter={() => {
              setPaused(true);
              setActive(i);
            }}
            onClick={() => setActive(i)}
            className={`relative grid cursor-pointer justify-items-center gap-1 border-2 bg-bg2 px-1 pt-2 pb-1.5 transition-colors ${i === active ? "border-pink" : "border-line"}`}
          >
            {i === active && <motion.span layoutId="roster-glow" className="absolute inset-0 shadow-[inset_0_0_16px_rgba(255,46,136,.55)]" />}
            <Pixel name={pl.sprite} className="w-11" />
            <span className={`pixel text-[0.5rem] ${i === active ? "text-pink" : "text-muted"}`}>{pl.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
