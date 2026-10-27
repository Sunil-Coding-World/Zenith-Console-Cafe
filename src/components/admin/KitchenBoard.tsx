"use client";

import { MENU } from "@/lib/data";
import { ago, inr } from "@/lib/format";
import { ORDER_STATUSES, type OrderStatus, type Snapshot } from "@/lib/store";
import { useCafe } from "./useCafe";

const NEXT: Record<OrderStatus, OrderStatus | null> = { New: "Preparing", Preparing: "Ready", Ready: "Served", Served: null };
const NEXT_LABEL: Record<OrderStatus, string> = { New: "Start cooking", Preparing: "Mark ready", Ready: "Served ✓", Served: "" };

export default function KitchenBoard({ initial }: { initial: Snapshot }) {
  const { data, now, act } = useCafe(initial, 3000);

  return (
    <div className="kanban">
      {ORDER_STATUSES.map((col) => {
        const orders = data.orders.filter((o) => o.status === col);
        return (
          <section key={col} className={`col col-${col.toLowerCase()}`}>
            <header>
              <h2>{col}</h2>
              <span>{orders.length}</span>
            </header>
            {orders.map((o) => {
              const total = o.items.reduce((s, i) => s + (MENU.find((m) => m.id === i.menuId)?.price ?? 0) * i.qty, 0);
              const late = col !== "Served" && now - o.createdAt > 15 * 60000;
              return (
                <article key={o.id} className={`ticket${late ? " late" : ""}`}>
                  <div className="ticket-top">
                    <b>#{o.id}</b>
                    <span className="pixel">{o.source}</span>
                  </div>
                  <ul>
                    {o.items.map((i) => {
                      const m = MENU.find((x) => x.id === i.menuId);
                      return (
                        <li key={i.menuId}>
                          <span className={`veg-mark${m?.veg === false ? " non" : ""}`} />
                          <b>{i.qty}×</b> {m?.name}
                        </li>
                      );
                    })}
                  </ul>
                  {o.note && <p className="ticket-note">📝 {o.note}</p>}
                  <div className="ticket-foot">
                    <small className={late ? "t-bad" : "muted"}>
                      {late ? "⚠ " : ""}
                      {ago(o.createdAt, now)} · {inr(total)}
                    </small>
                    {NEXT[col] && (
                      <button className="btn btn-sm btn-cyan" onClick={() => act("orderStatus", { id: o.id, status: NEXT[col] })}>
                        {NEXT_LABEL[col]}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
            {!orders.length && <p className="muted empty">No orders</p>}
          </section>
        );
      })}
    </div>
  );
}
