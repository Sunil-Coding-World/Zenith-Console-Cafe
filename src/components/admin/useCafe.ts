"use client";

import { useCallback, useEffect, useState } from "react";
import type { Snapshot } from "@/lib/store";

// Shared live state for admin screens: polls the server and exposes an action helper.
export function useCafe(initial: Snapshot, pollMs = 5000) {
  const [data, setData] = useState(initial);
  const [error, setError] = useState("");
  // Offset between server and browser clocks, so timers match the server's bill.
  const [skew] = useState(() => initial.now - Date.now());
  const [now, setNow] = useState(() => Date.now() + skew);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now() + skew), 1000);
    const poll = setInterval(async () => {
      const res = await fetch("/api/cafe", { cache: "no-store" }).catch(() => null);
      if (res?.ok) setData(await res.json());
    }, pollMs);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [pollMs, skew]);

  const act = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
    setError("");
    const res = await fetch("/api/cafe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (!res?.ok) {
      setError(json?.error ?? "Network error");
      return null;
    }
    if (json?.sessions) setData(json);
    return json;
  }, []);

  return { data, now, act, error };
}
