"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Pixel";

const NAV = [
  { href: "/admin", label: "Dashboard", ic: "📊" },
  { href: "/admin/live", label: "Live Stations", ic: "🎮" },
  { href: "/admin/kitchen", label: "Kitchen Orders", ic: "🍳" },
  { href: "/admin/bookings", label: "Bookings", ic: "📅" },
  { href: "/admin/parties", label: "Parties & Events", ic: "🎉" },
  { href: "/admin/menu", label: "Menu & Stock", ic: "🍕" },
  { href: "/admin/members", label: "Members & Passes", ic: "🎟" },
];

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="a-mobile">
        <Logo />
        <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          ☰
        </button>
      </div>
      <aside className={`a-side${open ? " open" : ""}`}>
        <Link href="/" className="a-logo">
          <Logo />
        </Link>
        <nav>
          {NAV.map((n) => {
            const on = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={on ? "on" : ""} onClick={() => setOpen(false)}>
                <span aria-hidden="true">{n.ic}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/order" className="a-qr" target="_blank">
          📱 Open QR order page
        </Link>
        <div className="a-user">
          <span className="pixel">P1</span>
          <div>
            <b>Owner</b>
            <small>Demo data</small>
          </div>
        </div>
      </aside>
    </>
  );
}
