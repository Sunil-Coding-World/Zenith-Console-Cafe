import { connection } from "next/server";
import { Suspense } from "react";
import OrderApp from "@/components/site/OrderApp";
import { STATIONS } from "@/lib/data";
import { snapshot } from "@/lib/store";

export const metadata = { title: "Order Food" };

// Table QR codes point here: /order?station=PS5-1
export default function OrderPage({ searchParams }: PageProps<"/order">) {
  return (
    <Suspense fallback={<div className="pixel grid min-h-screen place-items-center text-xs text-cyan">LOADING…</div>}>
      <OrderLoader searchParams={searchParams} />
    </Suspense>
  );
}

async function OrderLoader({ searchParams }: { searchParams: PageProps<"/order">["searchParams"] }) {
  await connection();
  const q = (await searchParams).station;
  const station = typeof q === "string" && STATIONS.some((s) => s.id === q) ? q : "";
  return <OrderApp initialStation={station} unavailable={snapshot().unavailable} />;
}
