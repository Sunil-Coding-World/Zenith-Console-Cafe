import { Card, Kpi, PageHead, Pill } from "@/components/admin/ui";
import { MEMBERS, MEMBERSHIPS } from "@/lib/data";
import { inr } from "@/lib/format";

export const metadata = { title: "Members & Passes" };

export default function MembersPage() {
  const active = MEMBERS.filter((m) => m.hoursLeft > 0);
  const lowBalance = MEMBERS.filter((m) => m.hoursTotal > 0 && m.hoursLeft <= 1);
  const regulars = [...MEMBERS].sort((a, b) => b.visits - a.visits);

  return (
    <>
      <PageHead title="Members & Passes" sub="Prepaid hours, balance aur regular customers. Kam balance walon ko recharge ka WhatsApp bhejo." />
      <div className="kpis">
        <Kpi label="Active passes" value={String(active.length)} />
        <Kpi label="Hours outstanding" value={`${active.reduce((s, m) => s + m.hoursLeft, 0)} hr`} hint="Prepaid, abhi khelna baaki" tone="info" />
        <Kpi label="Low balance" value={String(lowBalance.length)} hint="Recharge reminder bhejo" tone="warn" />
        <Kpi label="Lifetime spend" value={inr(MEMBERS.reduce((s, m) => s + m.spent, 0))} tone="good" />
      </div>

      <Card title="Customers">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Pass</th>
                <th>Balance</th>
                <th className="num">Visits</th>
                <th>Last visit</th>
                <th className="num">Spent</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {regulars.map((m) => {
                const pct = m.hoursTotal ? (m.hoursLeft / m.hoursTotal) * 100 : 0;
                const low = m.hoursTotal > 0 && m.hoursLeft <= 1;
                const msg = low
                  ? `Hi ${m.name}! Aapke ${m.pass} mein sirf ${m.hoursLeft} hr bache hain. Recharge karke khelte raho, Zenith Console Cafe 🎮`
                  : `Hi ${m.name}! Is weekend Zenith Console Cafe pe aao, naye games aur combos ready hain 🎮`;
                return (
                  <tr key={m.id}>
                    <td>
                      <b>{m.name}</b>
                      <small>
                        {m.id} · {m.phone}
                      </small>
                    </td>
                    <td>{m.pass === "—" ? <Pill tone="neutral">No pass</Pill> : m.pass}</td>
                    <td>
                      {m.hoursTotal ? (
                        <div className="bal">
                          <span className="bal-t">
                            <i style={{ width: `${pct}%` }} className={low ? "low" : ""} />
                          </span>
                          <small className={low ? "t-bad" : ""}>
                            {m.hoursLeft}/{m.hoursTotal} hr
                          </small>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="num">{m.visits}</td>
                    <td>{new Date(m.lastVisit + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                    <td className="num">{inr(m.spent)}</td>
                    <td>
                      <a className="icon-btn" href={`https://wa.me/91${m.phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener" title="WhatsApp">
                        💬
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid3" style={{ marginTop: 16 }}>
        {MEMBERSHIPS.map((p) => (
          <Card key={p.name} title={p.name} action={<b className="display">₹{p.price}</b>}>
            <p className="muted">{p.perks.join(" · ")}</p>
            <p className="muted">
              Sold: <b>{MEMBERS.filter((m) => m.pass === p.name).length}</b>
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
