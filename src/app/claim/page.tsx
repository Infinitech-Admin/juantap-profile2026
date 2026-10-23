// FILE: app/claim/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function ClaimForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const code = params.get("code") || "";

  const [username, setUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!token || !code) {
    return <p className="p-8 text-white">This claim link is invalid.</p>;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirm) {
      setErrors({ password: "Passwords do not match." });
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/claim/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            code,
            token,
            password,
            password_confirmation: confirm,
            username: username || undefined,
            new_email: newEmail || undefined,
          }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const flat: Record<string, string> = {};
          Object.entries(data.errors).forEach(([k, v]) => {
            flat[k] = Array.isArray(v) ? String(v[0]) : String(v);
          });
          setErrors(flat);
          if (flat.token) toast.error(flat.token);
        } else {
          toast.error(
            data.message || "Something went wrong, please try again.",
          );
        }
        return;
      }

      // Auto-login (same storage format as your login page)
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Your card has been claimed!");
      router.push("/dashboard/edit-profile");
    } catch {
      toast.error("Connection error.");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900";
  const err = (k: string) =>
    errors[k] ? <p className="mt-1 text-sm text-red-500">{errors[k]}</p> : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-gray-900">Claim your card</h1>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Username (for your profile link)
          </label>
          <input
            className={inputClass}
            value={username}
            maxLength={15}
            placeholder="juandelacruz"
            onChange={(e) =>
              setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
            }
          />
          {err("username")}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            New email (optional)
          </label>
          <input
            type="email"
            className={inputClass}
            value={newEmail}
            placeholder="Leave blank to keep your current email"
            onChange={(e) => setNewEmail(e.target.value)}
          />
          {err("new_email")}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            New password
          </label>
          <input
            type="password"
            className={inputClass}
            value={password}
            minLength={6}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {err("password")}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <input
            type="password"
            className={inputClass}
            value={confirm}
            minLength={6}
            required
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {err("token")}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white disabled:opacity-60"
        >
          {busy ? "Saving..." : "Activate card"}
        </button>
      </form>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={null}>
      <ClaimForm />
    </Suspense>
  );
}
