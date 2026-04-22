"use client";

import { useEffect, useState } from "react";

const EAS_PROJECT_ID = "11309220-3a9e-43ba-a74f-a3e18facf2f3";
const EXPO_ACCOUNT = "ayomikun-dev-corp";

interface BuildInfo {
  apkUrl: string;
  version: string;
  createdAt: string;
}

async function getLatestBuild(): Promise<BuildInfo | null> {
  try {
    const r = await fetch(
      `https://api.expo.dev/v2/projects/${EAS_PROJECT_ID}/builds?platform=ANDROID&status=FINISHED&limit=1`,
      { next: { revalidate: 300 } }
    );
    const j = await r.json();
    const build = j.data?.[0];
    if (!build) return null;
    return {
      apkUrl: build.artifacts?.applicationArchiveUrl || "",
      version: build.appVersion || "1.0.0",
      createdAt: new Date(build.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };
  } catch {
    return null;
  }
}

export default function DownloadAppPage() {
  const [build, setBuild] = useState<BuildInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestBuild().then(setBuild).finally(() => setLoading(false));
  }, []);

  const apkUrl = build?.apkUrl || "";
  const version = build?.version || "1.0.0";
  const buildDate = build?.createdAt || "";

  return (
    <main className="max-w-2xl mx-auto px-4 pt-28 pb-20 flex flex-col items-center gap-10 text-center">

      {/* Icon + title */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-3xl bg-ayo-gradient flex items-center justify-center ayo-glow">
          <span className="text-white font-black text-4xl">A</span>
        </div>
        <div>
          <h1 className="text-4xl font-black text-white">AYONIME</h1>
          <p className="text-ayo-muted text-sm mt-1">
            Android App · v{version}
            {buildDate ? <span className="ml-2 text-ayo-border">· {buildDate}</span> : null}
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {[
          { icon: "▶", label: "HD Streaming" },
          { icon: "⬇", label: "Save to Device" },
          { icon: "🎌", label: "JP / EN Audio" },
          { icon: "📱", label: "Native Player" },
          { icon: "⚡", label: "Fast & Smooth" },
          { icon: "🔖", label: "Continue Watching" },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-3 bg-ayo-card border border-ayo-border rounded-xl px-4 py-3">
            <span className="text-xl">{f.icon}</span>
            <span className="text-white font-semibold text-sm">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Download button */}
      <div className="flex flex-col items-center gap-3 w-full">
        {loading ? (
          <div className="flex items-center gap-3 w-full max-w-xs px-8 py-4 rounded-2xl bg-ayo-card border border-ayo-border justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-ayo-border border-t-ayo-accent animate-spin" />
            <span className="text-ayo-muted text-sm">Fetching latest build...</span>
          </div>
        ) : apkUrl ? (
          <a
            href={apkUrl}
            className="flex items-center justify-center gap-3 w-full max-w-xs px-8 py-4 rounded-2xl bg-ayo-gradient text-white font-black text-lg ayo-glow hover:opacity-90 transition-opacity"
            download="AYONIME.apk"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download APK · v{version}
          </a>
        ) : (
          <p className="text-ayo-muted text-sm">No build available yet.</p>
        )}
        <p className="text-ayo-muted text-xs">Free · No account needed · Android 7.0+</p>
        <a
          href={`https://expo.dev/accounts/${EXPO_ACCOUNT}/projects/ayonime/builds`}
          target="_blank" rel="noreferrer"
          className="text-ayo-muted text-xs hover:text-ayo-accent transition-colors underline underline-offset-2"
        >
          View all builds on Expo →
        </a>
      </div>

      {/* Install instructions */}
      <div className="w-full bg-ayo-card border border-ayo-border rounded-2xl p-6 text-left flex flex-col gap-4">
        <h2 className="text-white font-black text-lg">How to install</h2>
        {[
          { n: "1", text: 'Tap "Download APK" above' },
          { n: "2", text: "Open the downloaded file from your notifications or Downloads folder" },
          { n: "3", text: 'If prompted, tap "Install anyway" or enable "Install from unknown sources" in Settings → Security' },
          { n: "4", text: "Open AYONIME and start watching" },
        ].map((s) => (
          <div key={s.n} className="flex items-start gap-4">
            <div className="w-7 h-7 rounded-full bg-ayo-gradient flex items-center justify-center shrink-0 text-white font-black text-xs">
              {s.n}
            </div>
            <p className="text-ayo-muted text-sm leading-relaxed pt-0.5">{s.text}</p>
          </div>
        ))}
      </div>

      <p className="text-ayo-muted text-xs max-w-sm">
        AYONIME is a free app. It does not collect any personal data.
      </p>
    </main>
  );
}
