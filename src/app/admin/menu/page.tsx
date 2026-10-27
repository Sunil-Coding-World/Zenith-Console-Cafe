import { connection } from "next/server";
import { Suspense } from "react";
import MenuManager from "@/components/admin/MenuManager";
import { PageHead } from "@/components/admin/ui";
import { snapshot } from "@/lib/store";

export const metadata = { title: "Menu & Stock" };

export default function Page() {
  return (
    <>
      <PageHead title="Menu & Stock" sub="Item khatam ho gaya? Switch off karo, website aur QR menu pe turant 'Out of stock' dikhega." />
      <Suspense fallback={<div className="a-loading pixel">LOADING…</div>}>
        <Data />
      </Suspense>
    </>
  );
}

async function Data() {
  await connection();
  return <MenuManager initial={snapshot()} />;
}
