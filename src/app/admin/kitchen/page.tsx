import { connection } from "next/server";
import { Suspense } from "react";
import KitchenBoard from "@/components/admin/KitchenBoard";
import { PageHead } from "@/components/admin/ui";
import { snapshot } from "@/lib/store";

export const metadata = { title: "Kitchen Orders" };

export default function Page() {
  return (
    <>
      <PageHead title="Kitchen Orders" sub="QR, counter aur station se aaye orders. 15 min se purana order laal ho jaata hai." />
      <Suspense fallback={<div className="a-loading pixel">LOADING…</div>}>
        <Data />
      </Suspense>
    </>
  );
}

async function Data() {
  await connection();
  return <KitchenBoard initial={snapshot()} />;
}
