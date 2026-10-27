"use client";

import { MENU, MENU_CATEGORIES } from "@/lib/data";
import type { Snapshot } from "@/lib/store";
import { useCafe } from "./useCafe";

export default function MenuManager({ initial }: { initial: Snapshot }) {
  const { data, act } = useCafe(initial, 10000);

  return (
    <div className="menu-grid">
      {MENU_CATEGORIES.map((cat) => (
        <section key={cat} className="card">
          <header>
            <h2>{cat}</h2>
            <span className="muted">{MENU.filter((m) => m.category === cat).length} items</span>
          </header>
          <ul className="mm-list">
            {MENU.filter((m) => m.category === cat).map((m) => {
              const on = !data.unavailable.includes(m.id);
              return (
                <li key={m.id} className={on ? "" : "off"}>
                  <span className={`veg-mark${m.veg ? "" : " non"}`} />
                  <span className="mm-name">
                    {m.name}
                    {m.bestseller && <em> ★</em>}
                  </span>
                  <b>₹{m.price}</b>
                  <label className="switch" title={on ? "In stock" : "Out of stock"}>
                    <input type="checkbox" checked={on} onChange={(e) => act("availability", { menuId: m.id, available: e.target.checked })} />
                    <span />
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
