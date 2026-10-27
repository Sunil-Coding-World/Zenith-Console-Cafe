import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import Pixel from "@/components/Pixel";
import BookingForm from "@/components/site/BookingForm";
import FoodMenu from "@/components/site/FoodMenu";
import GameLibrary from "@/components/site/GameLibrary";
import Hero from "@/components/site/Hero";
import { FillBar, Item, MotionLink, MotionRoot, Reveal, SectionHead, Stagger } from "@/components/site/motion";
import Nav from "@/components/site/Nav";
import PartyPlanner from "@/components/site/PartyPlanner";
import { BILLING_RULES, CAFE, COMBOS, MEMBERSHIPS, MENU, RATES, STATIONS, TOURNAMENTS } from "@/lib/data";
import { snapshot } from "@/lib/store";

const WHY = [
  ["⏱", "Auto timer billing", "Har station ka live timer. Bill khud banta hai, koi bahas nahi."],
  ["📅", "Advance slot booking", "Weekend pe wait mat karo, online station book karo."],
  ["📱", "QR se food order", "Seat se scan karo, order kitchen tak, bill station pe add."],
  ["🎟", "Prepaid passes", "Hours pehle lo, sasta khelo, har visit pe balance check."],
  ["🎉", "Party packages", "Birthday, kitty, team outing: fixed price, koi hidden charge nahi."],
];

const staticUnavailable = MENU.filter((m) => !m.available).map((m) => m.id);
const wa = (text: string) => `https://wa.me/${CAFE.whatsapp}?text=${encodeURIComponent(text)}`;
const wrap = "mx-auto w-[min(1200px,100%-32px)]";
const card = "border-[1.5px] border-line bg-panel";

export default function Home() {
  return (
    <MotionRoot>
      <Nav />
      <Hero />

      {/* STATIONS */}
      <section id="stations" className="relative py-20 sm:py-24">
        <div className={wrap}>
          <SectionHead
            tag="Stations & Pricing"
            title="Choose your arena."
            sub={`Per hour rate, players ke hisaab se. Minimum ${BILLING_RULES.minMinutes} min, uske baad har ${BILLING_RULES.blockMinutes} min ka hisaab.`}
          />
          <Suspense fallback={<StationCards busy={[]} />}>
            <LiveStations />
          </Suspense>
          <Reveal className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse bg-panel">
              <thead>
                <tr className="text-left text-xs tracking-widest text-muted uppercase">
                  {["Players", "1P", "2P", "3P", "4P"].map((h) => (
                    <th key={h} className="border-b border-line px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(["PS5", "PS2"] as const).map((c) => (
                  <tr key={c} className="transition-colors hover:bg-panel2">
                    <td className="border-b border-line px-4 py-3">
                      <b className={c === "PS5" ? "text-cyan" : "text-yellow"}>{c}</b> / hour
                    </td>
                    {[1, 2, 3, 4].map((n) => (
                      <td key={n} className="border-b border-line px-4 py-3 font-semibold tabular-nums">
                        {RATES[c][n] ? `₹${RATES[c][n]}` : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-muted">⚡ Happy Hours: weekdays 11 AM – 3 PM pe gaming 20% off.</p>
          </Reveal>
        </div>
      </section>

      {/* GAMES */}
      <section id="games" className="bg-bg2 py-20 sm:py-24">
        <div className={wrap}>
          <SectionHead tag="Game Library" title="Fighting. Football. Wrestling. Sab hai." />
          <Reveal>
            <GameLibrary />
          </Reveal>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-20 sm:py-24">
        <div className={wrap}>
          <SectionHead tag="Food Menu" title="Respawn with snacks." sub="Khelte khelte order karo. Seat pe QR scan karo ya counter pe bolo, food seedha aapke station pe." />
          <Reveal>
            <Suspense fallback={<FoodMenu unavailable={staticUnavailable} />}>
              <LiveMenu />
            </Suspense>
          </Reveal>

          <Stagger className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {COMBOS.map((c) => (
              <Item key={c.name} className="border border-pink/35 bg-[linear-gradient(160deg,rgba(255,46,136,.16),var(--color-panel)_60%)] p-5">
                <span className="pixel text-[0.55rem] text-cyan">GAMER COMBO</span>
                <h3 className="mt-2 mb-1.5 text-xl">{c.name}</h3>
                <p className="min-h-[3em] text-sm text-muted">{c.includes}</p>
                <div className="mt-3 flex flex-wrap items-baseline gap-2.5">
                  <b className="font-display text-3xl">₹{c.price}</b>
                  <s className="text-muted">₹{c.was}</s>
                  <em className="text-xs font-bold text-lime not-italic">Save ₹{c.was - c.price}</em>
                </div>
              </Item>
            ))}
          </Stagger>

          <Reveal className="mt-6 flex flex-wrap items-center justify-between gap-4 border-[1.5px] border-dashed border-lime bg-lime/5 px-6 py-5">
            <div>
              <b className="block text-lg">Cafe mein baithe ho?</b>
              <span className="text-sm text-muted">Table ka QR scan karo ya yahan se order karo, station pe deliver hoga.</span>
            </div>
            <Link href="/order" className="btn btn-lime">
              📱 Order from your seat
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TOURNAMENTS */}
      <section id="tournaments" className="bg-bg2 py-20 sm:py-24">
        <div className={wrap}>
          <SectionHead tag="Tournaments" title="Prove you're the boss." />
          <Stagger className="grid gap-4 md:grid-cols-3" gap={0.12}>
            {TOURNAMENTS.map((t) => (
              <Item key={t.game} className={`${card} relative overflow-hidden p-5`}>
                <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-pink to-cyan" />
                <div className="flex justify-between text-sm text-muted">
                  <span className="pixel text-[0.6rem] text-yellow">{t.date}</span>
                  <span>{t.time}</span>
                </div>
                <h3 className="mt-3 mb-1.5 text-2xl">{t.game}</h3>
                <p className="font-semibold text-lime">🏆 {t.prize}</p>
                <div className="my-4 grid gap-1">
                  <FillBar pct={Math.round((t.filled / t.slots) * 100)} className="bg-[repeating-linear-gradient(90deg,var(--color-pink)_0_8px,#ff5aa2_8px_10px)]" />
                  <small className="text-muted">
                    {t.filled}/{t.slots} players · {t.slots - t.filled} slots left
                  </small>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Entry ₹{t.entry}</span>
                  <MotionLink className="btn btn-cyan btn-sm" href={wa(`Register me for ${t.game} tournament (${t.date})`)} target="_blank" rel="noopener">
                    Register
                  </MotionLink>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* PASSES */}
      <section id="passes" className="py-20 sm:py-24">
        <div className={wrap}>
          <SectionHead tag="Prepaid Passes" title="Level up. Pay less." sub="Hours pehle se le lo. Har visit pe balance kat-ta hai, aur food pe discount alag se." />
          <Stagger className="grid items-stretch gap-5 md:grid-cols-3" gap={0.12}>
            {MEMBERSHIPS.map((m) => (
              <Item
                key={m.name}
                className={`relative flex flex-col overflow-hidden border-[1.5px] bg-panel p-7 ${m.featured ? "border-pink shadow-[0_0_40px_-10px_rgba(255,46,136,.6)] md:-translate-y-2" : "border-line"}`}
              >
                {m.featured && <span className="pixel absolute top-3.5 -right-9 rotate-[35deg] bg-yellow px-10 py-1.5 text-[0.5rem] text-[#111]">BEST VALUE</span>}
                <h3 className="text-2xl">{m.name}</h3>
                <div className="mt-3 mb-4 flex items-baseline gap-2.5">
                  <b className="font-display text-[2.4rem] text-yellow">₹{m.price}</b>
                  <small className="text-muted">₹{Math.round(m.price / m.hours)}/hr</small>
                </div>
                <ul className="mb-6 grid flex-1 gap-2">
                  {m.perks.map((p) => (
                    <li key={p}>
                      <span className="text-cyan">▸</span> {p}
                    </li>
                  ))}
                </ul>
                <MotionLink className={`btn ${m.featured ? "btn-pink" : "btn-ghost"}`} href={wa(`I want ${m.name}`)} target="_blank" rel="noopener">
                  Get {m.name}
                </MotionLink>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* PARTIES */}
      <section id="parties" className="relative overflow-hidden bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,210,63,.14),transparent_55%)] py-20 sm:py-24">
        <div className={wrap}>
          <SectionHead
            tag="Parties & Events"
            title={
              <>
                Birthday? Kitty party? <span className="text-yellow">Poora cafe aapka.</span>
              </>
            }
            sub="Birthday, kitty party, office team outing ya college gang: games, khana, decor aur host, sab hum sambhalenge. Package chuno, quote turant dekho."
          />
          <PartyPlanner />
        </div>
      </section>

      {/* WHY */}
      <section className="bg-bg2 py-20 sm:py-24">
        <div className={wrap}>
          <SectionHead tag="Why Zenith" title="No waiting. No jhagda. Just games." />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {WHY.map(([ic, t, d]) => (
              <Item key={t} className={`${card} group p-6`}>
                <span className="mb-2.5 block text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12">{ic}</span>
                <h3 className="mb-1.5 text-lg">{t}</h3>
                <p className="text-[0.92rem] text-muted">{d}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* BOOK */}
      <section id="book" className="bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,46,136,.18),transparent_60%)] py-20 sm:py-24">
        <div className={`${wrap} grid items-center gap-12 lg:grid-cols-2`}>
          <Reveal>
            <span className="pixel text-[0.62rem] text-cyan">▸ BOOK A STATION</span>
            <h2 className="mt-3 text-[clamp(2rem,4.6vw,3.3rem)]">Reserve your slot.</h2>
            <p className="mt-3.5 max-w-lg text-muted">Weekend aur shaam ko rush hota hai. Pehle se book karo, aate hi controller haath mein.</p>
            <div className="mt-9 flex items-end gap-5" aria-hidden="true">
              <Pixel name="gamer" className="w-[90px] animate-idle [image-rendering:pixelated]" />
              <Pixel name="fighter" className="w-[100px] animate-idle [animation-delay:.3s] [image-rendering:pixelated]" />
              <Pixel name="striker" className="w-[90px] animate-idle [animation-delay:.6s] [image-rendering:pixelated]" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <BookingForm />
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line bg-bg2 pt-12 pb-6 text-[0.92rem] text-muted">
        <div className={`${wrap} grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]`}>
          <div>
            <Pixel name="gamer" className="mb-2 w-14 animate-idle" />
            <p>
              {CAFE.name} · {CAFE.tagline}
            </p>
          </div>
          <div className="grid content-start gap-1.5">
            <h4 className="font-display text-text">Visit</h4>
            <p>📍 {CAFE.address}</p>
            <p>🕚 {CAFE.hours}</p>
            <p>📞 {CAFE.phone}</p>
          </div>
          <div className="grid content-start gap-1.5">
            <h4 className="font-display text-text">Quick</h4>
            <a href="#book" className="hover:text-cyan">Book a station</a>
            <Link href="/order" className="hover:text-cyan">Order food</Link>
            <a href="#tournaments" className="hover:text-cyan">Tournaments</a>
          </div>
        </div>
        <p className={`${wrap} pixel mt-8 text-center text-[0.55rem]`}>GAME OVER? NEVER. · © Zenith Console Cafe</p>
      </footer>

      <MotionLink
        className="fixed right-4 bottom-4 z-60 grid size-14 place-items-center rounded-full bg-[#25d366] text-2xl shadow-[0_0_24px_rgba(37,211,102,.6)]"
        href={wa("Hi Zenith! Station available hai abhi?")}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      >
        💬
      </MotionLink>
    </MotionRoot>
  );
}

async function LiveStations() {
  await connection();
  return <StationCards busy={snapshot().sessions.map((s) => s.stationId)} live />;
}

async function LiveMenu() {
  await connection();
  return <FoodMenu unavailable={snapshot().unavailable} />;
}

function StationCards({ busy, live = false }: { busy: string[]; live?: boolean }) {
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATIONS.map((s) => {
        const isBusy = busy.includes(s.id);
        const ps5 = s.console === "PS5";
        return (
          <Item key={s.id} className={`${card} clip-corner group p-5 transition-colors ${ps5 ? "hover:border-cyan" : "hover:border-yellow"}`}>
            <div className="flex items-center justify-between">
              <span className={`pixel text-[0.7rem] ${ps5 ? "text-cyan" : "text-yellow"}`}>{s.console}</span>
              {live && (
                <span className={`flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold ${isBusy ? "bg-red/10 text-red" : "bg-lime/10 text-lime"}`}>
                  <span className={`size-1.5 rounded-full ${isBusy ? "bg-red" : "animate-ping bg-lime"}`} />
                  {isBusy ? "In use" : "Free now"}
                </span>
              )}
            </div>
            <div className="relative my-3.5 grid h-[120px] place-items-center" aria-hidden="true">
              <div className={`aspect-[16/10] w-[78%] border-4 border-[#2c2850] bg-black transition-shadow duration-300 ${ps5 ? "group-hover:shadow-[0_0_40px_rgba(25,230,255,.5)]" : "group-hover:shadow-[0_0_40px_rgba(255,210,63,.45)]"}`}>
                <div className="scanlines relative grid size-full place-items-center overflow-hidden bg-gradient-to-br from-[#1a0f3d] to-[#0c2a46]">
                  <span className={`pixel animate-blink text-[0.7rem] ${ps5 ? "text-cyan [text-shadow:0_0_8px_var(--color-cyan)]" : "text-yellow [text-shadow:0_0_8px_var(--color-yellow)]"}`}>
                    {ps5 ? "4K" : "RETRO"}
                  </span>
                </div>
              </div>
              {ps5 ? (
                <span className="absolute right-[6%] -bottom-0.5 h-10 w-[22px] rounded bg-[linear-gradient(90deg,#fff_30%,#111_30%_70%,#fff_70%)] shadow-[0_0_12px_rgba(255,255,255,.4)]" />
              ) : (
                <span className="absolute right-[6%] -bottom-0.5 h-3 w-11 rounded-sm border border-[#44445a] bg-[#1b1b22]" />
              )}
            </div>
            <h3 className="text-[1.05rem]">{s.name}</h3>
            <p className="text-sm text-muted">
              {s.screen} · up to {s.maxPlayers} players
            </p>
            <div className="mt-3 flex items-baseline gap-1.5">
              <b className="font-display text-2xl text-yellow">₹{RATES[s.console][1]}</b>
              <span className="text-sm text-muted">/ hr onwards</span>
            </div>
          </Item>
        );
      })}
    </Stagger>
  );
}
