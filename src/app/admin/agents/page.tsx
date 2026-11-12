"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Dices, Plus, Trash2, Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface TemplateOption {
  slug: string;
  name: string;
}
interface Row {
  key: number;
  firstname: string;
  lastname: string;
  template_slug: string; // "" = use default
}
interface Created {
  id: number;
  name: string;
  card_code: string;
  nfc_url: string;
  template: string;
}

const FIRST_NAMES = [
  "Juan",
  "Maria",
  "Jose",
  "Ana",
  "Miguel",
  "Carla",
  "Paolo",
  "Bianca",
  "Gabriel",
  "Isabel",
  "Rafael",
  "Angela",
  "Lorenzo",
  "Patricia",
  "Marco",
  "Katrina",
  "Nathan",
  "Jasmine",
  "Carlo",
  "Andrea",
  "Joshua",
  "Nicole",
  "Daniel",
  "Camille",
  "Mark",
  "Diane",
  "Kevin",
  "Trisha",
  "Ryan",
  "Selene",
];
const LAST_NAMES = [
  "Santos",
  "Reyes",
  "Cruz",
  "Bautista",
  "Ocampo",
  "Garcia",
  "Mendoza",
  "Torres",
  "Flores",
  "Villanueva",
  "Ramos",
  "Aquino",
  "Castillo",
  "Rivera",
  "Dela Cruz",
  "Navarro",
  "Domingo",
  "Salvador",
  "Pascual",
  "Manalo",
  "Aguilar",
  "Soriano",
  "Valdez",
  "Lim",
  "Tan",
  "Gonzales",
  "Lopez",
  "Perez",
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
let keyCounter = 0;
const randomRow = (template_slug = ""): Row => ({
  key: ++keyCounter,
  firstname: pick(FIRST_NAMES),
  lastname: pick(LAST_NAMES),
  template_slug,
});

export default function AdminAgentsPage() {
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [defaultSlug, setDefaultSlug] = useState("");
  const [count, setCount] = useState(5);
  const [rows, setRows] = useState<Row[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Created[]>([]);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/templates`,
          {
            headers: authHeaders(),
          },
        );
        if (!res.ok) throw new Error("Failed to load templates");
        const data = await res.json();
        const list: TemplateOption[] = data.map((t: TemplateOption) => ({
          slug: t.slug,
          name: t.name,
        }));
        setTemplates(list);
        setDefaultSlug(
          list.find((t) => t.slug === "mint-fresh")?.slug ??
            list[0]?.slug ??
            "",
        );
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error loading templates");
      }
    })();
  }, []);

  const generate = () => {
    const n = Math.min(Math.max(count, 1), 200);
    setRows(Array.from({ length: n }, () => randomRow()));
    setCreated([]);
  };

  const rerollRow = (key: number) =>
    setRows((prev) =>
      prev.map((r) =>
        r.key === key
          ? { ...r, firstname: pick(FIRST_NAMES), lastname: pick(LAST_NAMES) }
          : r,
      ),
    );

  const updateRow = (key: number, patch: Partial<Row>) =>
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );

  const removeRow = (key: number) =>
    setRows((prev) => prev.filter((r) => r.key !== key));

  // Apply one template to every row
  const applyTemplateToAll = (slug: string) =>
    setRows((prev) => prev.map((r) => ({ ...r, template_slug: slug })));

  const register = async () => {
    if (!defaultSlug) return toast.error("Choose a default template.");
    if (rows.length === 0) return toast.error("Generate names first.");
    if (rows.some((r) => !r.firstname.trim()))
      return toast.error("Every row needs a first name.");
    if (!window.confirm(`Register ${rows.length} agent(s)?`)) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/agents/register`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            default_template_slug: defaultSlug,
            agents: rows.map(({ firstname, lastname, template_slug }) => ({
              firstname,
              lastname,
              template_slug: template_slug || null,
            })),
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok && !data.created?.length)
        throw new Error(data.message || "Registration failed");

      setCreated(data.created ?? []);
      if (data.failed?.length) {
        toast.warning(
          `${data.failed.length} failed: ${data.failed
            .map(
              (f: { name: string; reason: string }) =>
                `${f.name} (${f.reason})`,
            )
            .join(", ")}`,
        );
      } else {
        toast.success(data.message);
      }
      setRows([]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Could not copy.");
    }
  };

  const downloadCsv = () => {
    const lines = [
      ["name", "card_code", "nfc_url", "template"],
      ...created.map((c) => [c.name, c.card_code, c.nfc_url, c.template]),
    ].map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agents-nfc.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-6 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Register Agents
      </h1>

      {/* Controls */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                How many agents?
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 block mb-1">
                Default template
              </label>
              <div className="flex gap-2">
                <select
                  value={defaultSlug}
                  onChange={(e) => setDefaultSlug(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {templates.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  disabled={rows.length === 0}
                  onClick={() => applyTemplateToAll(defaultSlug)}
                >
                  Apply to all
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={generate}>
              <Dices className="w-4 h-4 mr-2" />
              Generate random names
            </Button>
            <Button
              variant="outline"
              onClick={() => setRows((p) => [...p, randomRow()])}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add row
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated rows */}
      {rows.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-3">
            {rows.map((r, idx) => (
              <div
                key={r.key}
                className="grid gap-2 sm:grid-cols-[2rem_1fr_1fr_1fr_auto] items-center"
              >
                <span className="text-sm text-gray-500">{idx + 1}</span>
                <input
                  value={r.firstname}
                  onChange={(e) =>
                    updateRow(r.key, { firstname: e.target.value })
                  }
                  placeholder="First name"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  value={r.lastname}
                  onChange={(e) =>
                    updateRow(r.key, { lastname: e.target.value })
                  }
                  placeholder="Last name"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <select
                  value={r.template_slug}
                  onChange={(e) =>
                    updateRow(r.key, { template_slug: e.target.value })
                  }
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Default template</option>
                  {templates.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rerollRow(r.key)}
                    aria-label="Reroll name"
                  >
                    <Dices size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeRow(r.key)}
                    aria-label="Remove row"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              onClick={register}
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Register {rows.length} agent(s)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {created.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Created ({created.length})
              </h2>
              <Button size="sm" variant="outline" onClick={downloadCsv}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>
            {created.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-md bg-gray-50 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {c.name}{" "}
                    <span className="text-xs text-gray-500">
                      [{c.template}]
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 break-all">{c.nfc_url}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copy(c.nfc_url)}
                  aria-label="Copy NFC link"
                >
                  <Copy size={14} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
