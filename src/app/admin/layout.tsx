import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import "./admin.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="a-shell">
      <Sidebar />
      <main className="a-main">{children}</main>
    </div>
  );
}
