"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Episode {
  id: number;
  episode: number;
  session: string;
  snapshot: string;
  duration: string;
  created_at: string;
}

const PAGE_SIZE = 24;

export default function EpisodeGrid({
  episodes,
  slug,
  title,
}: {
  episodes: Episode[];
  slug: string;
  title: string;
}) {
  const [page, setPage] = useState(1);
  const [lastWatched, setLastWatched] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`last_watched_${slug}`);
      if (stored) setLastWatched(stored);
    } catch {}
  }, [slug]);

  const totalPages = Math.ceil(episodes.length / PAGE_SIZE);
  const paged = episodes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  const lastWatchedEp = episodes.find((e) => e.session === lastWatched);

  return (
    <div className="flex flex-col gap-6">
      {/* Continue watching banner */}
      {lastWatchedEp && (
        <Link
          href={`/watch/${slug}/${lastWatchedEp.session}?title=${encodeURIComponent(title)}&ep=${lastWatchedEp.episode}`}
          className="flex items-center gap-4 bg-ayo-card border border-ayo-accent/40 rounded-xl px-4 py-3 hover:border-ayo-accent transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-ayo-gradient flex items-center justify-center shrink-0 ayo-glow">
            <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-ayo-muted">Continue watching</span>
            <span className="text-white font-bold text-sm group-hover:text-ayo-glow transition-colors">Episode {lastWatchedEp.episode}</span>
          </div>
          <svg className="ml-auto text-ayo-muted group-hover:text-white transition-colors" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
        </Link>
      )}

      {/* Pagination top */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-ayo-muted text-xs">
            Ep {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, episodes.length)} of {episodes.length}
          </span>
          <Pagination page={page} totalPages={totalPages} pages={pages} setPage={setPage} />
        </div>
      )}

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {paged.map((ep) => (
          <Link
            key={ep.session}
            href={`/watch/${slug}/${ep.session}?title=${encodeURIComponent(title)}&ep=${ep.episode}`}
            onClick={() => {
              try { localStorage.setItem(`last_watched_${slug}`, ep.session); } catch {}
            }}
            className={`ep-card group bg-ayo-card border rounded-xl overflow-hidden flex flex-col ${
              ep.session === lastWatched ? "border-ayo-accent/60" : "border-ayo-border"
            }`}
          >
            {ep.snapshot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ep.snapshot} alt={`Episode ${ep.episode}`} className="w-full aspect-video object-cover" loading="lazy" />
            ) : (
              <div className="w-full aspect-video bg-ayo-surface flex items-center justify-center">
                <svg width="24" height="24" fill="none" stroke="#2a2a3d" strokeWidth="1.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            )}
            <div className="p-3 flex flex-col gap-1">
              <span className="text-white font-bold text-sm">Ep {ep.episode}</span>
              {ep.duration && <span className="text-ayo-muted text-xs">{ep.duration}</span>}
            </div>
          </Link>
        ))}
      </section>

      {/* Pagination bottom */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination page={page} totalPages={totalPages} pages={pages} setPage={setPage} />
        </div>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, pages, setPage }: {
  page: number; totalPages: number; pages: number[]; setPage: (p: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <PagBtn onClick={() => setPage(1)} disabled={page === 1}>«</PagBtn>
      <PagBtn onClick={() => setPage(page - 1)} disabled={page === 1}>‹</PagBtn>
      {pages.map((p) => (
        <button key={p} onClick={() => setPage(p)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            p === page ? "bg-ayo-gradient text-white ayo-glow" : "bg-ayo-card border border-ayo-border text-ayo-muted hover:text-white hover:border-ayo-accent"
          }`}>{p}</button>
      ))}
      <PagBtn onClick={() => setPage(page + 1)} disabled={page === totalPages}>›</PagBtn>
      <PagBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</PagBtn>
    </div>
  );
}

function PagBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-ayo-card border border-ayo-border text-ayo-muted hover:text-white hover:border-ayo-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all">
      {children}
    </button>
  );
}
