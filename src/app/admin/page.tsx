import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Bars, Card, HBars, Kpi, PageHead, Pill } from "@/components/admin/ui";
import { gamingCharge, HOURLY_TODAY, MENU, PARTY_PACKAGES, PARTY_TYPES, STATIONS, TOP_GAMES_WEEK, WEEK_REVENUE } from "@/lib/data";
import { inr } from "@/lib/format";
import { foodTotal, snapshot } from "@/lib/store";

export default function Dashboard() {
  return (
    <>
      <PageHead title="Player 1 Dashboard" sub="Aaj ka gaming + food business ek nazar mein.">
        <Link href="/admin/live" className="btn btn-pink">
          🎮 Live Stations
        </Link>
      </PageHead>
      <Suspense fallback={<div className="a-loading pixel">LOADING…</div>}>
        <Data />
      </Suspense>
    </>
  );
}

async function Data() {
  await connection();
  const s = snapshot();
  const gamingDone = s.bills.reduce((a, b) => a + b.gaming, 0);
  const foodDone = s.bills.reduce((a, b) => a + b.food, 0);
  const runningGaming = s.sessions.reduce((a, x) => {
    const st = STATIONS.find((y) => y.id === x.stationId)!;
    return a + gamingCharge(st.console, x.players, (s.now - x.startedAt) / 60000);
  }, 0);
  const runningFood = s.sessions.reduce((a, x) => a + foodTotal(x.items), 0);
  // Counter (non-station) orders count as food sales too.
  const counterFood = s.orders.filter((o) => o.source === "Counter").reduce((a, o) => a + foodTotal(o.items), 0);
  const total = gamingDone + foodDone + runningGaming + runningFood + counterFood;
  const pendingOrders = s.orders.filter((o) => o.status !== "Served");
  const d = new Date(s.now);
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const todayBookings = s.bookings.filter((b) => b.date === todayStr && b.status !== "Cancelled").sort((a, b) => a.time.localeCompare(b.time));
  const pendingBookings = s.bookings.filter((b) => b.status === "Pending");
  const upcomingParties = s.parties
    .filter((p) => p.date >= todayStr && p.status !== "Cancelled" && p.status !== "Completed")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  // Station utilisation today: finished minutes + running minutes, over 12 open hours.
  const util = STATIONS.map((st) => {
    const mins =
      s.bills.filter((b) => b.stationId === st.id).reduce((a, b) => a + b.minutes, 0) +
      s.sessions.filter((x) => x.stationId === st.id).reduce((a, x) => a + (s.now - x.startedAt) / 60000, 0);
    return { label: st.id, value: Math.round((mins / (12 * 60)) * 100) };
  });

  const itemCounts: Record<string, number> = {};
  for (const o of s.orders) for (const i of o.items) itemCounts[i.menuId] = (itemCounts[i.menuId] ?? 0) + i.qty;
  const topItems = Object.entries(itemCounts)
    .map(([id, value]) => ({ label: MENU.find((m) => m.id === id)?.name ?? id, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <>
      <div className="kpis">
        <Kpi label="Today's revenue" value={inr(total)} hint="Bills + running sessions" tone="good" />
        <Kpi label="Gaming" value={inr(gamingDone + runningGaming)} hint={`${Math.round(((gamingDone + runningGaming) / Math.max(total, 1)) * 100)}% of total`} />
        <Kpi label="Food" value={inr(foodDone + runningFood + counterFood)} hint={`${Math.round(((foodDone + runningFood + counterFood) / Math.max(total, 1)) * 100)}% of total`} />
        <Kpi label="Stations busy" value={`${s.sessions.length}/${STATIONS.length}`} hint={s.sessions.length === STATIONS.length ? "Full house!" : "Walk-ins le sakte ho"} tone="info" />
        <Kpi label="Upcoming parties" value={String(upcomingParties.length)} hint={inr(upcomingParties.reduce((a, p) => a + p.quote, 0)) + " pipeline"} tone="warn" />
        <Kpi label="Kitchen queue" value={String(pendingOrders.length)} hint="Orders not served" tone={pendingOrders.length > 3 ? "bad" : "warn"} />
      </div>

      <div className="grid-21">
        <Card title="Revenue by hour · today" action={<span className="muted">Gaming + food</span>}>
          <Bars
            label="Revenue by hour today"
            format={inr}
            data={HOURLY_TODAY.map((h) => ({ label: `${h.hour}${h.hour === "11" ? "am" : "pm"}`, value: h.gaming + h.food, tip: `Gaming ${inr(h.gaming)} · Food ${inr(h.food)}` }))}
          />
        </Card>
        <Card title="Station utilisation · today" action={<span className="muted">% of 12 open hrs</span>}>
          <HBars data={util} suffix="%" />
          <p className="muted small">Kam use wale station pe happy-hour offer chalao.</p>
        </Card>
      </div>

      <div className="grid3">
        <Card title="Live now" action={<Link href="/admin/live" className="link">Open →</Link>}>
          <ul className="list">
            {STATIONS.map((st) => {
              const x = s.sessions.find((y) => y.stationId === st.id);
              return (
                <li key={st.id}>
                  <div>
                    <b>{st.id}</b>
                    <small>{x ? `${x.customer} · ${x.game}` : "Ready for players"}</small>
                  </div>
                  {x ? <Pill tone="bad">{Math.round((s.now - x.startedAt) / 60000)} min</Pill> : <Pill tone="good">Free</Pill>}
                </li>
              );
            })}
          </ul>
        </Card>
        <Card title="Aaj ki bookings" action={pendingBookings.length ? <Pill tone="warn">{pendingBookings.length} to confirm</Pill> : null}>
          <ul className="list">
            {todayBookings.map((b) => (
              <li key={b.id}>
                <div>
                  <b>
                    {b.time} · {b.name}
                  </b>
                  <small>
                    {b.console} · {b.players}P · {b.hours}h
                  </small>
                </div>
                <Pill tone={b.status === "Pending" ? "warn" : "good"}>{b.status}</Pill>
              </li>
            ))}
            {!todayBookings.length && <li className="muted">Aaj koi booking nahi</li>}
          </ul>
        </Card>
        <Card title="Kitchen queue" action={<Link href="/admin/kitchen" className="link">Open →</Link>}>
          <ul className="list">
            {pendingOrders.map((o) => (
              <li key={o.id}>
                <div>
                  <b>
                    #{o.id} · {o.source}
                  </b>
                  <small>{o.items.map((i) => `${i.qty}× ${MENU.find((m) => m.id === i.menuId)?.name}`).join(", ")}</small>
                </div>
                <Pill tone={o.status === "New" ? "bad" : o.status === "Preparing" ? "warn" : "good"}>{o.status}</Pill>
              </li>
            ))}
            {!pendingOrders.length && <li className="muted">Sab serve ho gaya 🎉</li>}
          </ul>
        </Card>
      </div>

      <div className="grid4">
        <Card title="Upcoming parties 🎉" action={<Link href="/admin/parties" className="link">Open →</Link>}>
          <ul className="list">
            {upcomingParties.slice(0, 5).map((p) => (
              <li key={p.id}>
                <div>
                  <b>
                    {PARTY_TYPES.find((t) => t.id === p.type)?.icon} {p.name}
                  </b>
                  <small>
                    {new Date(p.date + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {p.time} · {p.guests} guests ·{" "}
                    {PARTY_PACKAGES.find((x) => x.id === p.pkg)?.name}
                  </small>
                </div>
                <Pill tone={p.status === "Advance Paid" ? "good" : p.status === "Confirmed" ? "info" : "warn"}>{p.status}</Pill>
              </li>
            ))}
            {!upcomingParties.length && <li className="muted">Koi upcoming party nahi</li>}
          </ul>
        </Card>
        <Card title="Last 7 days">
          <Bars label="Revenue last 7 days" format={inr} data={WEEK_REVENUE.map((d) => ({ label: d.day, value: d.total }))} />
        </Card>
        <Card title="Top games · this week" action={<span className="muted">sessions</span>}>
          <HBars data={TOP_GAMES_WEEK} />
        </Card>
        <Card title="Top food · today" action={<span className="muted">qty</span>}>
          <HBars data={topItems} />
        </Card>
      </div>

      <Card title="Recent bills">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Bill</th>
                <th>Station</th>
                <th>Customer</th>
                <th className="num">Time</th>
                <th className="num">Gaming</th>
                <th className="num">Food</th>
                <th className="num">Total</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {s.bills.slice(0, 8).map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.stationId}</td>
                  <td>
                    {b.customer} <small>{b.players}P</small>
                  </td>
                  <td className="num">{b.minutes} min</td>
                  <td className="num">{inr(b.gaming)}</td>
                  <td className="num">{inr(b.food)}</td>
                  <td className="num">
                    <b>{inr(b.total)}</b>
                  </td>
                  <td>
                    <Pill tone={b.paidVia === "Pass" ? "info" : "neutral"}>{b.paidVia}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
