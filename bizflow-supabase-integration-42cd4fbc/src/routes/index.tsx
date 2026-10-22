import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connect Supabase · Bizflow" },
      {
        name: "description",
        content: "Securely prepare Bizflow's connection to an existing Supabase project.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const validateSettings = () => {
    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== "https:") {
        throw new Error("Use the HTTPS URL for your existing Supabase project.");
      }
    } catch {
      setStatus("error");
      setMessage("Enter a valid HTTPS Supabase project URL or custom Supabase domain.");
      return;
    }

    if (key.trim().length < 20) {
      setStatus("error");
      setMessage("Enter the publishable or anon key from your Supabase API settings.");
      return;
    }

    setStatus("saved");
    setMessage("Settings are ready. Apply the environment variables to this deployment, then restart it.");
  };

  const copyEnvironment = async () => {
    const block = `VITE_SUPABASE_URL=${url.trim()}\nVITE_SUPABASE_PUBLISHABLE_KEY=${key.trim()}`;
    try {
      await navigator.clipboard.writeText(block);
      setStatus("saved");
      setMessage("Environment variables copied. They were not stored in browser storage.");
    } catch {
      setStatus("error");
      setMessage("Clipboard access is unavailable. Copy the values from the environment block manually.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <section className="max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[#12233f] text-lg font-semibold text-white shadow-lg shadow-slate-900/10">B</div>
            <span className="text-lg font-semibold tracking-tight">Bizflow</span>
          </div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#1d6b66]">Workspace setup</p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">Connect the data layer you already own.</h1>
          <p className="mt-6 text-base leading-7 text-slate-600">Point Bizflow at your existing Supabase project without touching its schema, records, or authentication setup.</p>
          <div className="mt-10 space-y-4 border-l border-slate-300 pl-5 text-sm text-slate-600">
            <p><strong className="text-slate-950">01</strong><span className="ml-3">Use the project URL and publishable key from Supabase API settings.</span></p>
            <p><strong className="text-slate-950">02</strong><span className="ml-3">Copy them into your deployment environment, never into source control.</span></p>
            <p><strong className="text-slate-950">03</strong><span className="ml-3">Restart Bizflow to load the connection at build time.</span></p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.35)] sm:p-9">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Existing project</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">Supabase connection</h2>
            </div>
            <span className="rounded-full bg-[#e6f4f1] px-3 py-1 text-xs font-semibold text-[#17625d]">No data changes</span>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="supabase-url" className="mb-2 block text-sm font-medium text-slate-800">Project URL</label>
              <input id="supabase-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://your-project.supabase.co" autoComplete="url" className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus-visible:border-[#1d6b66] focus-visible:ring-4 focus-visible:ring-[#1d6b66]/10" />
              <p className="mt-2 text-xs text-slate-500">Found in Supabase → Project Settings → API.</p>
            </div>
            <div>
              <label htmlFor="supabase-key" className="mb-2 block text-sm font-medium text-slate-800">Publishable key</label>
              <div className="relative">
                <input id="supabase-key" type={showKey ? "text" : "password"} value={key} onChange={(event) => setKey(event.target.value)} placeholder="sb_publishable_… or eyJ…" autoComplete="off" className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-24 font-mono text-xs text-slate-950 outline-none transition focus-visible:border-[#1d6b66] focus-visible:ring-4 focus-visible:ring-[#1d6b66]/10" />
                <button type="button" onClick={() => setShowKey((value) => !value)} className="absolute right-2 top-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d6b66]">{showKey ? "Hide" : "Show"}</button>
              </div>
              <p className="mt-2 text-xs text-slate-500">This is the browser-safe key. Never use a service-role key here.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={validateSettings} className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-[#12233f] px-5 text-sm font-semibold text-white transition hover:bg-[#1b3155] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12233f]">Validate settings</button>
            <button type="button" onClick={copyEnvironment} disabled={!url || !key} className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d6b66] disabled:cursor-not-allowed disabled:opacity-40">Copy env block</button>
          </div>

          <div role="status" aria-live="polite" className={`mt-5 rounded-xl px-4 py-3 text-sm ${status === "error" ? "bg-red-50 text-red-800" : status === "saved" ? "bg-[#e6f4f1] text-[#155e59]" : "bg-slate-50 text-slate-600"}`}>
            {message || "Your values stay in this form until you apply them to the deployment environment."}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Environment variables</p>
            <pre className="mt-3 overflow-x-auto text-xs leading-6"><code>{`VITE_SUPABASE_URL=${url || "https://your-project.supabase.co"}\nVITE_SUPABASE_PUBLISHABLE_KEY=${key ? "••••••••••••••••" : "your-publishable-key"}`}</code></pre>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">The form never writes credentials to localStorage, a database, or the repository. Environment variables must be supplied by your local or hosting environment.</p>
        </section>
      </div>
    </main>
  );
}
