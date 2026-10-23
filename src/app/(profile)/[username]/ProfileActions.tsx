"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL, getCurrentUser } from "@/lib/template-data";

type Mode = "loading" | "claim" | "owner" | "none";

export default function ProfileActions({ username }: { username: string }) {
  const [mode, setMode] = useState<Mode>("loading");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const me = await getCurrentUser();
      if (me?.username === username) return setMode("owner");

      const res = await fetch(`${API_URL}/claim/${username}`, {
        cache: "no-store",
      });
      if (!res.ok) return setMode("none");
      const data = await res.json();
      setMode(data.claimed ? "none" : "claim");
    })();
  }, [username]);

  const requestClaim = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/claim/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "May error, subukan ulit.");
      setSentTo(data.email);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (mode === "loading" || mode === "none") return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 w-[92%] max-w-sm">
      {mode === "owner" && (
        <Link
          href="/dashboard/profile"
          className="block rounded-full bg-yellow-500 py-3 text-center font-bold text-black shadow-lg"
        >
          Edit my card
        </Link>
      )}

      {mode === "claim" && !sentTo && (
        <button
          onClick={requestClaim}
          disabled={busy}
          className="w-full rounded-full bg-yellow-500 py-3 font-bold text-black shadow-lg disabled:opacity-60"
        >
          {busy ? "Sending..." : "Ako ito, i-claim ang card ko"}
        </button>
      )}

      {mode === "claim" && sentTo && (
        <p className="rounded-xl bg-black/90 p-3 text-center text-sm text-white">
          Check mo ang email mo: <b>{sentTo}</b>
        </p>
      )}

      {error && (
        <p className="mt-2 text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
