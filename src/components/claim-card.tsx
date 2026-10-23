// FILE: components/claim-card.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ClaimCard({
  code,
  name,
}: {
  code: string;
  name: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const post = async (path: string, body: object) => {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  };

  const showErrors = (res: Response, data: any) => {
    if (res.status === 422 && data.errors) {
      const flat: Record<string, string> = {};
      Object.entries(data.errors).forEach(([k, v]) => {
        flat[k] = Array.isArray(v) ? String(v[0]) : String(v);
      });
      setErrors(flat);
    } else if (res.status === 429) {
      toast.error("Too many requests. Please wait a moment.");
    } else {
      toast.error(data.message || "Something went wrong, please try again.");
    }
  };

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setBusy(true);
    try {
      const { res, data } = await post("/claim/send-code", { code, email });
      if (!res.ok) return showErrors(res, data);
      setMaskedEmail(data.email);
      setStep(2);
      toast.success("Verification code sent. Check your email.");
    } catch {
      toast.error("Connection error.");
    } finally {
      setBusy(false);
    }
  };

  const activate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirm) {
      setErrors({ password: "Passwords do not match." });
      return;
    }

    setBusy(true);
    try {
      const { res, data } = await post("/claim/activate", {
        code,
        email_code: emailCode,
        username,
        password,
        password_confirmation: confirm,
      });
      if (!res.ok) return showErrors(res, data);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Your card has been activated!");
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
      <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Hi, {name}!</h1>
          <p className="mt-1 text-sm text-gray-600">
            {step === 1
              ? "Activate your card. Enter your email and we'll send you a verification code."
              : `We sent a 6-character code to ${maskedEmail}.`}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={sendCode} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Your email
              </label>
              <input
                type="email"
                className={inputClass}
                value={email}
                required
                placeholder="you@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              {err("email")}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-yellow-500 py-3 font-bold text-black disabled:opacity-60"
            >
              {busy ? "Sending..." : "Send verification code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={activate} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Verification code
              </label>
              <input
                className={inputClass}
                value={emailCode}
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="one-time-code"
                maxLength={6}
                required
                placeholder="6-character code"
                onChange={(e) =>
                  setEmailCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
                }
              />
              {err("email_code")}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Username (for your profile link)
              </label>
              <input
                className={inputClass}
                value={username}
                maxLength={15}
                required
                placeholder="juandelacruz"
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
                }
              />
              {err("username")}
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

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-yellow-500 py-3 font-bold text-black disabled:opacity-60"
            >
              {busy ? "Activating..." : "Activate my card"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setEmailCode("");
                setErrors({});
              }}
              className="w-full text-sm text-gray-500 underline"
            >
              Wrong email? Go back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
