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

const fieldClass =
  "w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm";

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
    const n = Math.min(Math.max(count || 1, 1), 200);
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

  const rerollAll = () =>
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        firstname: pick(FIRST_NAMES),
        lastname: pick(LAST_NAMES),
      })),
    );

  const updateRow = (key: number, patch: Partial<Row>) =>
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );

  const removeRow = (key: number) =>
    setRows((prev) => prev.filter((r) => r.key !== key));

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

  const copyAll = () => copy(created.map((c) => c.nfc_url).join("\n"));

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
    <div className="min-w-0 w-full max-w-7xl space-y-4 px-3 py-4 sm:px-6 sm:py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Register Agents
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate names, pick a template, then register. Each agent gets an NFC
          link.
        </p>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
        {/* Controls: top bar on small screens, sticky side panel on xl */}
        <Card className="min-w-0 xl:sticky xl:top-4">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end xl:flex-col xl:items-stretch">
              <div className="sm:w-24 xl:w-full">
                <label className="mb-1 block text-xs text-gray-500">
                  Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className={fieldClass}
                />
              </div>
              <div className="min-w-0 sm:w-56 xl:w-full">
                <label className="mb-1 block text-xs text-gray-500">
                  Default template
                </label>
                <select
                  value={defaultSlug}
                  onChange={(e) => setDefaultSlug(e.target.value)}
                  className={fieldClass}
                >
                  {templates.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2 sm:ml-auto xl:ml-0">
                <Button onClick={generate}>
                  <Dices className="mr-2 h-4 w-4" />
                  Generate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRows((p) => [...p, randomRow()])}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add row
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-4">
          {/* Empty state */}
          {rows.length === 0 && created.length === 0 && (
            <Card className="min-w-0">
              <CardContent className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
                <Dices className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  No agents yet
                </p>
                <p className="max-w-xs text-xs text-gray-500">
                  Set a count and click Generate to create random names. You can
                  edit them before registering.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Rows */}
          {rows.length > 0 && (
            <Card className="min-w-0">
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">
                    {rows.length} agent{rows.length > 1 ? "s" : ""} to register
                  </h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={rerollAll}>
                      <Dices className="mr-1.5 h-3.5 w-3.5" />
                      Reroll all
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applyTemplateToAll(defaultSlug)}
                    >
                      Apply default to all
                    </Button>
                  </div>
                </div>

                {/* Column headings (desktop only) */}
                <div className="hidden grid-cols-[1.5rem_1fr_1fr_11rem_4.5rem] gap-2 px-1 text-xs text-gray-500 md:grid">
                  <span>#</span>
                  <span>First name</span>
                  <span>Last name</span>
                  <span>Template</span>
                  <span />
                </div>

                {/* Scrollable list so 200 rows never makes the page huge */}
                <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1 xl:max-h-[calc(100vh-18rem)]">
                  {rows.map((r, idx) => (
                    <div
                      key={r.key}
                      className="grid grid-cols-2 items-center gap-2 rounded-lg border border-gray-200 p-2.5 md:grid-cols-[1.5rem_1fr_1fr_11rem_4.5rem] md:rounded-md md:border-0 md:bg-gray-50 md:p-1.5"
                    >
                      <span className="order-1 pl-1 text-xs text-gray-500">
                        {idx + 1}
                      </span>

                      <div className="order-2 flex justify-end gap-1 md:order-5">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => rerollRow(r.key)}
                          aria-label="Reroll name"
                        >
                          <Dices size={14} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => removeRow(r.key)}
                          aria-label="Remove row"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>

                      <div className="order-3 col-span-2 grid grid-cols-2 gap-2 md:contents">
                        <input
                          value={r.firstname}
                          onChange={(e) =>
                            updateRow(r.key, { firstname: e.target.value })
                          }
                          placeholder="First name"
                          className={`${fieldClass} md:order-2`}
                        />
                        <input
                          value={r.lastname}
                          onChange={(e) =>
                            updateRow(r.key, { lastname: e.target.value })
                          }
                          placeholder="Last name"
                          className={`${fieldClass} md:order-3`}
                        />
                      </div>

                      <select
                        value={r.template_slug}
                        onChange={(e) =>
                          updateRow(r.key, { template_slug: e.target.value })
                        }
                        className={`${fieldClass} order-4 col-span-2 md:order-4 md:col-span-1`}
                      >
                        <option value="">Default</option>
                        {templates.map((t) => (
                          <option key={t.slug} value={t.slug}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={register}
                  disabled={submitting}
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register {rows.length} agent{rows.length > 1 ? "s" : ""}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {created.length > 0 && (
            <Card className="min-w-0">
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">
                    Created ({created.length})
                  </h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyAll}>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copy all links
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadCsv}>
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      CSV
                    </Button>
                  </div>
                </div>

                <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1 xl:max-h-[calc(100vh-18rem)]">
                  {created.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-2 rounded-md bg-gray-50 p-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-medium">
                          {c.name}{" "}
                          <span className="text-xs font-normal text-gray-500">
                            {c.template}
                          </span>
                        </p>
                        <p className="break-all text-xs text-gray-600">
                          {c.nfc_url}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 shrink-0"
                        onClick={() => copy(c.nfc_url)}
                        aria-label="Copy NFC link"
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
