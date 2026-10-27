"use client";

import { motion, MotionConfig, type HTMLMotionProps, type Variants } from "motion/react";
import type { ReactNode } from "react";

// Respect the visitor's reduced-motion setting everywhere.
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

// Fades its content up as it scrolls into view.
export function Reveal({ children, delay = 0, className, ...rest }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Staggers children that use `variants={fadeUp | pop}`.
export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

// A staggered child card that pops in and lifts on hover.
export function Item({ children, className, lift = true, ...rest }: HTMLMotionProps<"div"> & { lift?: boolean }) {
  return (
    <motion.div
      className={className}
      variants={pop}
      whileHover={lift ? { y: -6, transition: { type: "spring", stiffness: 400, damping: 20 } } : undefined}
      whileTap={lift ? { scale: 0.98 } : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Progress bar that fills when scrolled into view.
export function FillBar({ pct, className }: { pct: number; className?: string }) {
  return (
    <div className="h-2.5 border border-line bg-bg2">
      <motion.i
        className={`block h-full ${className ?? ""}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
      />
    </div>
  );
}

export function MotionLink({ className, children, ...rest }: HTMLMotionProps<"a">) {
  return (
    <motion.a className={className} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} {...rest}>
      {children}
    </motion.a>
  );
}

export function SectionHead({ tag, title, sub }: { tag: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <Reveal className="mb-10 max-w-2xl">
      <span className="pixel text-[0.62rem] uppercase text-cyan">▸ {tag}</span>
      <h2 className="mt-3 text-[clamp(2rem,4.6vw,3.3rem)]">{title}</h2>
      {sub && <p className="mt-3 text-muted">{sub}</p>}
    </Reveal>
  );
}
