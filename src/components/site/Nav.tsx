"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Pixel";

const LINKS = [
  ["#stations", "Stations"],
  ["#games", "Games"],
  ["#menu", "Menu"],
  ["#parties", "Parties"],
  ["#tournaments", "Tournaments"],
  ["#passes", "Passes"],
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 30));

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid || open ? "bg-bg/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : ""}`}
    >
      <div className="mx-auto flex h-[70px] w-[min(1200px,100%-32px)] items-center justify-between gap-4">
        <a href="#" aria-label="Zenith Console Cafe home">
          <Logo />
        </a>
        <ul className="hidden items-center gap-7 text-[0.92rem] font-semibold lg:flex">
          {LINKS.map(([h, l]) => (
            <li key={h}>
              <a href={h} className="group relative text-muted transition-colors hover:text-cyan">
                {l}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-cyan transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
          <li>
            <Link href="/order" className="text-lime">
              Order Food
            </Link>
          </li>
          <li>
            <Link href="/admin" className="text-muted hover:text-text">
              Staff
            </Link>
          </li>
        </ul>
        <motion.a href="#book" className="btn btn-pink btn-sm hidden lg:inline-flex" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
          Book Now ▶
        </motion.a>
        <button className="text-2xl lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-line bg-bg/95 px-4 lg:hidden"
          >
            {[...LINKS, ["/order", "Order Food"], ["/admin", "Staff"], ["#book", "Book Now ▶"]].map(([h, l], i) => (
              <motion.li key={h} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <a href={h} onClick={() => setOpen(false)} className="block border-b border-line/50 py-3 font-semibold">
                  {l}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* scroll progress, like an XP bar */}
      <motion.div className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-pink via-yellow to-lime" style={{ scaleX: scrollYProgress }} />
    </motion.header>
  );
}
