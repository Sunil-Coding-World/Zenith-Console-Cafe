import { connection } from "next/server";
import { Suspense } from "react";
import PartiesBoard from "@/components/admin/PartiesBoard";
import { PageHead } from "@/components/admin/ui";
import { snapshot } from "@/lib/store";

export const metadata = { title: "Parties & Events" };

export default function Page() {
  return (
    <>
      <PageHead title="Parties & Events" sub="Birthday, kitty party, team outing. Enquiry → Confirm → Advance → Done. WhatsApp pe quote aur advance ka message ek click mein." />
      <Suspense fallback={<div className="a-loading pixel">LOADING…</div>}>
        <Data />
      </Suspense>
    </>
  );
}

async function Data() {
  await connection();
  return <PartiesBoard initial={snapshot()} />;
}
