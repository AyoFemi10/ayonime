"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type DownloadStatus = "idle" | "queued" | "resolving" | "downloading" | "compiling" | "done" | "failed";

interface DownloadJob {
  job_id: string;
  status: DownloadStatus;
  progress: number;
  file_path: string | null;
  error: string | null;
}

const STATUS_LABEL: Record<DownloadStatus, string> = {
  idle: "Download MP4",
  queued: "Queued...",
  resolving: "Resolving stream...",
  downloading: "Downloading segments...",
  compiling: "Compiling video...",
  done: "Download File",
  failed: "Retry Download",
};

const QUALITIES = ["best", "1080", "720", "480"] as const;
const AUDIOS = [{ value: "jpn", label: "Japanese" }, { value: "eng", label: "English" }] as const;

export default function WatchPage({ params }: { params: { slug: string; session: string } }) {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || params.slug;
  const ep = searchParams.get("ep") || "?";

  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(true);
  const [streamError, setStreamError] = useState("");
  const [quality, setQuality] = useState("best");
  const [audio, setAudio] = useState("jpn");

  const [dlJob, setDlJob] = useState<DownloadJob | null>(null);
  const [dlStatus, setDlStatus] = useState<DownloadStatus>("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load stream — get kwik embed URL
  useEffect(() => {
    setStreamLoading(true);
    setStreamError("");
    setStreamUrl(null);
    fetch(
      `${API_BASE}/api/stream?anime_slug=${params.slug}&episode_session=${params.session}&quality=${quality}&audio=${audio}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.detail) setStreamError(d.detail);
        else setStreamUrl(d.stream_url);
      })
      .catch(() => setStreamError("Failed to load stream. Is the backend running?"))
      .finally(() => setStreamLoading(false));
  }, [params.slug, params.session, quality, audio]);

  // Poll download job
  const startPolling = useCallback((jobId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`${API_BASE}/api/download/${jobId}/status`);
        if (!r.ok) { clearInterval(pollRef.current!); setDlStatus("failed"); return; }
        const job: DownloadJob = await r.json();
        setDlJob(job);
        setDlStatus(job.status);
        if (job.status === "done" || job.status === "failed") clearInterval(pollRef.current!);
      } catch { /* ignore */ }
    }, 1500);
  }, []);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const handleDownload = async () => {
    if (dlStatus === "done" && dlJob?.job_id) {
      window.open(`${API_BASE}/api/download/${dlJob.job_id}/file`, "_blank");
      return;
    }
    setDlStatus("queued");
    try {
      const r = await fetch(`${API_BASE}/api/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anime_slug: params.slug,
          episode_session: params.session,
          anime_title: title,
          episode_number: parseInt(ep as string) || 0,
          quality,
          audio,
        }),
      });
      const { job_id } = await r.json();
      startPolling(job_id);
    } catch {
      setDlStatus("failed");
    }
  };

  const isDownloading = ["queued", "resolving", "downloading", "compiling"].includes(dlStatus);
  const dlProgress = dlJob?.progress ?? 0;

  return (
    <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-ayo-muted flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/anime/${params.slug}?title=${encodeURIComponent(title)}`} className="hover:text-white transition-colors line-clamp-1 max-w-[200px]">
          {title}
        </Link>
        <span>/</span>
        <span className="text-white">Episode {ep}</span>
      </div>

      {/* Title + download button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-ayo-gradient" />
          <h1 className="text-xl font-black text-white">
            {title} <span className="text-ayo-muted font-normal">— Ep {ep}</span>
          </h1>
        </div>

        <div className="flex flex-col items-end gap-1 min-w-[160px]">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all w-full justify-center ${
              dlStatus === "done" ? "bg-green-600 hover:bg-green-500 text-white" :
              dlStatus === "failed" ? "bg-red-600 hover:bg-red-500 text-white" :
              isDownloading ? "bg-ayo-card border border-ayo-border text-ayo-muted cursor-not-allowed" :
              "bg-ayo-gradient text-white ayo-glow hover:opacity-90"
            }`}
          >
            {isDownloading ? (
              <><div className="w-3.5 h-3.5 rounded-full border-2 border-ayo-border border-t-ayo-accent animate-spin" />{STATUS_LABEL[dlStatus]}</>
            ) : dlStatus === "done" ? (
              <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>{STATUS_LABEL[dlStatus]}</>
            ) : (
              <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>{STATUS_LABEL[dlStatus]}</>
            )}
          </button>
          {isDownloading && (
            <div className="w-full h-1 bg-ayo-border rounded-full overflow-hidden">
              <div className="h-full bg-ayo-gradient transition-all duration-500 rounded-full" style={{ width: `${dlProgress}%` }} />
            </div>
          )}
          {dlJob?.error && <p className="text-red-400 text-xs">{dlJob.error}</p>}
        </div>
      </div>

      {/* Player — kwik iframe embedded seamlessly */}
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-ayo-border relative">
        {streamLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ayo-bg">
            <div className="w-12 h-12 rounded-full border-2 border-ayo-border border-t-ayo-accent animate-spin" />
            <p className="text-ayo-muted text-sm">Loading stream...</p>
          </div>
        )}
        {!streamLoading && streamError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ayo-bg px-8 text-center">
            <div className="w-14 h-14 rounded-full bg-ayo-card border border-ayo-border flex items-center justify-center">
              <svg width="24" height="24" fill="none" stroke="#ec4899" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <p className="text-white font-semibold">{streamError}</p>
            <p className="text-ayo-muted text-xs">Make sure the backend is running</p>
          </div>
        )}
        {!streamLoading && streamUrl && (
          <iframe
            src={`${API_BASE}${streamUrl}`}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-center bg-ayo-card border border-ayo-border rounded-xl px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-ayo-muted text-xs uppercase tracking-wider font-semibold">Quality</span>
          <div className="flex gap-1">
            {QUALITIES.map((q) => (
              <button key={q} onClick={() => setQuality(q)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${quality === q ? "bg-ayo-gradient text-white ayo-glow" : "bg-ayo-surface border border-ayo-border text-ayo-muted hover:text-white hover:border-ayo-accent"}`}>
                {q === "best" ? "Best" : `${q}p`}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden sm:block w-px h-6 bg-ayo-border" />
        <div className="flex items-center gap-3">
          <span className="text-ayo-muted text-xs uppercase tracking-wider font-semibold">Audio</span>
          <div className="flex gap-1">
            {AUDIOS.map((a) => (
              <button key={a.value} onClick={() => setAudio(a.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${audio === a.value ? "bg-ayo-gradient text-white ayo-glow" : "bg-ayo-surface border border-ayo-border text-ayo-muted hover:text-white hover:border-ayo-accent"}`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
        <Link href={`/anime/${params.slug}?title=${encodeURIComponent(title)}`}
          className="ml-auto flex items-center gap-2 text-ayo-muted hover:text-white transition-colors text-sm">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
          All Episodes
        </Link>
      </div>

      {/* Download status card */}
      {dlJob && dlStatus !== "idle" && (
        <div className="bg-ayo-card border border-ayo-border rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-sm">{title} — Episode {ep}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${dlStatus === "done" ? "bg-green-900/50 text-green-400" : dlStatus === "failed" ? "bg-red-900/50 text-red-400" : "bg-ayo-surface text-ayo-muted"}`}>
              {dlStatus?.toUpperCase()}
            </span>
          </div>
          {isDownloading && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-ayo-muted">
                <span>{STATUS_LABEL[dlStatus]}</span>
                <span>{dlProgress}%</span>
              </div>
              <div className="w-full h-2 bg-ayo-border rounded-full overflow-hidden">
                <div className="h-full bg-ayo-gradient transition-all duration-500 rounded-full" style={{ width: `${dlProgress}%` }} />
              </div>
            </div>
          )}
          {dlStatus === "done" && dlJob.file_path && (
            <div className="flex items-center justify-between">
              <p className="text-ayo-muted text-xs font-mono truncate max-w-xs">{dlJob.file_path}</p>
              <a href={`${API_BASE}/api/download/${dlJob.job_id}/file`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-ayo-accent hover:text-ayo-glow transition-colors shrink-0">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Save File
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
