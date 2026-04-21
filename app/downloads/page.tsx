"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MY_JOBS_KEY = "ayonime_my_job_ids";

type DownloadStatus = "queued" | "resolving" | "downloading" | "compiling" | "done" | "failed";

interface DownloadJob {
  job_id: string;
  status: DownloadStatus;
  progress: number;
  file_path: string | null;
  error: string | null;
  anime_title: string;
  episode_number: number;
}

const STATUS_COLOR: Record<DownloadStatus, string> = {
  queued: "text-yellow-400 bg-yellow-900/30",
  resolving: "text-blue-400 bg-blue-900/30",
  downloading: "text-ayo-accent bg-purple-900/30",
  compiling: "text-orange-400 bg-orange-900/30",
  done: "text-green-400 bg-green-900/30",
  failed: "text-red-400 bg-red-900/30",
};

const STATUS_LABEL: Record<DownloadStatus, string> = {
  queued: "Waiting...",
  resolving: "Resolving stream...",
  downloading: "Downloading segments...",
  compiling: "Compiling video...",
  done: "Done",
  failed: "Failed",
};

const ACTIVE = ["queued", "resolving", "downloading", "compiling"];

// Helpers to read/write job IDs from localStorage
function getMyJobIds(): string[] {
  try { return JSON.parse(localStorage.getItem(MY_JOBS_KEY) || "[]"); } catch { return []; }
}
export function saveMyJobId(jobId: string) {
  try {
    const ids = getMyJobIds();
    if (!ids.includes(jobId)) { ids.push(jobId); localStorage.setItem(MY_JOBS_KEY, JSON.stringify(ids)); }
  } catch {}
}
function removeMyJobId(jobId: string) {
  try {
    const ids = getMyJobIds().filter((id) => id !== jobId);
    localStorage.setItem(MY_JOBS_KEY, JSON.stringify(ids));
  } catch {}
}

export default function DownloadsPage() {
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    const ids = getMyJobIds();
    if (ids.length === 0) { setJobs([]); setLoading(false); return; }

    const results = await Promise.allSettled(
      ids.map((id) => fetch(`${API_BASE}/api/download/${id}/status`).then((r) => r.ok ? r.json() : null))
    );

    const fetched: DownloadJob[] = results
      .map((r) => (r.status === "fulfilled" ? r.value : null))
      .filter(Boolean);

    setJobs(fetched);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyJobs();
    const interval = setInterval(fetchMyJobs, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearJob = (jobId: string) => {
    removeMyJobId(jobId);
    setJobs((prev) => prev.filter((j) => j.job_id !== jobId));
  };

  const hasActive = jobs.some((j) => ACTIVE.includes(j.status));

  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-20 sm:pt-28 pb-16 flex flex-col gap-6 sm:gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-ayo-gradient" />
          <h1 className="text-2xl font-black text-white">My Downloads</h1>
        </div>
        <div className="flex items-center gap-2">
          {hasActive && (
            <span className="flex items-center gap-1.5 text-xs text-ayo-muted">
              <span className="w-2 h-2 rounded-full bg-ayo-accent pulse-dot" />
              Active
            </span>
          )}
          <button onClick={fetchMyJobs} className="text-ayo-muted hover:text-white transition-colors" aria-label="Refresh">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-2 border-ayo-border border-t-ayo-accent animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-ayo-card border border-ayo-border flex items-center justify-center">
            <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <p className="text-ayo-muted text-lg font-semibold">No downloads yet</p>
          <p className="text-ayo-muted text-sm">Hit the Download MP4 button on any episode to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-4 text-xs text-ayo-muted pb-2">
            <span>{jobs.filter((j) => j.status === "done").length} completed</span>
            <span>{jobs.filter((j) => ACTIVE.includes(j.status)).length} active</span>
            <span>{jobs.filter((j) => j.status === "failed").length} failed</span>
          </div>

          {jobs.map((job) => (
            <div key={job.job_id} className="bg-ayo-card border border-ayo-border rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{job.anime_title}</p>
                  <p className="text-ayo-muted text-xs">Episode {job.episode_number}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[job.status] || "text-gray-400 bg-gray-900/30"}`}>
                    {job.status?.toUpperCase()}
                  </span>
                  {(job.status === "done" || job.status === "failed") && (
                    <button onClick={() => clearJob(job.job_id)} className="text-ayo-muted hover:text-white transition-colors text-xs" aria-label="Remove">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {ACTIVE.includes(job.status) && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-ayo-muted">
                    <span>{STATUS_LABEL[job.status]}</span>
                    <span>{job.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-ayo-border rounded-full overflow-hidden">
                    <div className="h-full bg-ayo-gradient transition-all duration-500 rounded-full" style={{ width: `${job.progress}%` }} />
                  </div>
                </div>
              )}

              {job.status === "done" && (
                <a
                  href={`${API_BASE}/api/download/${job.job_id}/file`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors text-sm font-bold"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Save File
                </a>
              )}

              {job.status === "failed" && job.error && (
                <p className="text-red-400 text-xs">{job.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
