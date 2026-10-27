import { connection } from "next/server";
import { Suspense } from "react";
import LiveBoard from "@/components/admin/LiveBoard";
import { PageHead } from "@/components/admin/ui";
import { snapshot } from "@/lib/store";

export const metadata = { title: "Live Stations" };

export default function Page() {
  return (
    <>
      <PageHead title="Live Stations" sub="Session start karo, timer chalta hai, food bill mein judta hai, end pe ek click mein bill." />
      <Suspense fallback={<div className="a-loading pixel">LOADING…</div>}>
        <Data />
      </Suspense>
    </>
  );
}

async function Data() {
  await connection();
  return <LiveBoard initial={snapshot()} />;
}
