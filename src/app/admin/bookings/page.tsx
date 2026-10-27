import { connection } from "next/server";
import { Suspense } from "react";
import BookingsBoard from "@/components/admin/BookingsBoard";
import { PageHead } from "@/components/admin/ui";
import { snapshot } from "@/lib/store";

export const metadata = { title: "Bookings" };

export default function Page() {
  return (
    <>
      <PageHead title="Bookings" sub="Website se aayi booking requests. Confirm karo aur WhatsApp pe message bhejo." />
      <Suspense fallback={<div className="a-loading pixel">LOADING…</div>}>
        <Data />
      </Suspense>
    </>
  );
}

async function Data() {
  await connection();
  return <BookingsBoard initial={snapshot()} />;
}
