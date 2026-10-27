import type { ReactNode } from "react";

// Original pixel-art characters (no licensed IP). Each sprite is a 16-wide grid; '.' is transparent.

const PALETTE: Record<string, string> = {
  K: "#0d0b1a", S: "#f2b98a", s: "#c98b5e", H: "#2b1a10", W: "#f5f5f5", R: "#ff2e55", r: "#b3123a",
  B: "#2a6bff", b: "#1d3f9e", Y: "#ffd23f", G: "#2ee87a", P: "#a43bff", p: "#6a1fb3", C: "#19e6ff", D: "#3a3a4a", O: "#ff8a1f",
};

export const SPRITES = {
  fighter: [
    "......KKKK......",
    ".....KHHHHK.....",
    "....KHHHHHHK....",
    "....KRRRRRRK.R..",
    "....KSSSSSSKRR..",
    "....KSKSSKSK....",
    "....KSSSSSSK....",
    ".....KSssSK.....",
    "...KKKWWWWKKK...",
    "..KSSKWWWWKSSK..",
    ".KSSSKWWWWKSSSK.",
    ".KSSKKWWWWKKSSK.",
    "..KK.KKKKKK.KK..",
    ".....KWWWWWK....",
    "....KWWK.KWWK...",
    "....KWWK.KWWK...",
    "...KWWK...KWWK..",
    "...KSSK...KSSK..",
    "..KKKKK...KKKKK.",
  ],
  wrestler: [
    ".KK..........KK.",
    "KSSK..KKKK..KSSK",
    "KSSK.KSSSSK.KSSK",
    ".KSSKSKSSKSKSSK.",
    ".KSSKSSSSSSKSSK.",
    "..KSSKSHHSKSSK..",
    "...KSSSSSSSSK...",
    "...KSSSSSSSSK...",
    "..KSSSsSSsSSSK..",
    "..KSSSSSSSSSSK..",
    "..KYYYYYYYYYYK..",
    "..KYYDYYYYDYYK..",
    "..KPPPPPPPPPPK..",
    "..KPPPPKKPPPPK..",
    "...KSSK..KSSK...",
    "...KSSK..KSSK...",
    "...KRRK..KRRK...",
    "..KRRRK..KRRRK..",
    "..KKKKK..KKKKK..",
  ],
  striker: [
    "......KKKK......",
    ".....KHHHHK.....",
    "....KHHHHHHK....",
    "....KSSSSSSK....",
    "....KSKSSKSK....",
    "....KSSSSSSK....",
    ".....KSssSK.....",
    "...KKKRRRRKKK...",
    "..KSKRRWWRRKSK..",
    "..KSKRRRWRRKSK..",
    "..KSKRRWRRRKSK..",
    "...K.KRRRRK.K...",
    ".....KWWWWK.....",
    ".....KWWKWWK....",
    "....KSSK.KSSK...",
    "....KSSK..KSSK..",
    "....KRRK...KSSK.",
    "...KKKKK....KKKK",
    "................",
  ],
  gamer: [
    ".....KKKKKK.....",
    "....KCCCCCCK....",
    "...KCKKKKKKCK...",
    "..KDKSSSSSSKDK..",
    "..KDKSKSSKSKDK..",
    "..KDKSSSSSSKDK..",
    "...KCKSSSSKCK...",
    "...KCCKKKKCCK...",
    "..KCCCCCCCCCCK..",
    ".KCCKCCCCCCKCCK.",
    ".KSSKKKKKKKKSSK.",
    "..KKKDDDDDDKKK..",
    "....KDKYYKDK....",
    "....KKKKKKKK....",
    ".....KbbbbK.....",
    ".....KbKKbK.....",
    "....KbbK.KbbK...",
    "....KbK...KbK...",
    "...KKKK...KKKK..",
  ],
};

export type SpriteName = keyof typeof SPRITES;

export default function Pixel({ name, className, title }: { name: SpriteName; className?: string; title?: string }) {
  const rows = SPRITES[name];
  const rects: ReactNode[] = [];
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const fill = PALETTE[ch];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={fill} />);
    }),
  );
  return (
    <svg className={className} viewBox={`0 0 16 ${rows.length}`} shapeRendering="crispEdges" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {rects}
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 font-display text-[1.15rem] leading-none">
      <svg viewBox="0 0 40 40" aria-hidden="true" className="size-[38px] flex-none drop-shadow-[0_0_8px_rgba(25,230,255,.6)]">
        <rect x="3" y="11" width="34" height="20" rx="10" fill="#14112a" stroke="#19e6ff" strokeWidth="2" />
        <path d="M11 17v8M7 21h8" stroke="#ff2e88" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="27" cy="18" r="2.2" fill="#b6ff2e" />
        <circle cx="31" cy="22" r="2.2" fill="#ffd23f" />
        <circle cx="23" cy="22" r="2.2" fill="#19e6ff" />
        <circle cx="27" cy="26" r="2.2" fill="#ff2e88" />
      </svg>
      <span>
        ZENITH
        <small className="pixel mt-1.5 block text-[0.5rem] tracking-widest text-pink">CONSOLE CAFE</small>
      </span>
    </span>
  );
}
