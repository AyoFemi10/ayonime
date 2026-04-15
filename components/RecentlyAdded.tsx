"use client";

import { useEffect, useState } from "react";
import AnimeCard, { AnimeProp } from "./AnimeCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface PageData {
  data: any[];
  last_page: number;
  current_page: number;
}

export default function RecentlyAdded() {
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/recently-added?page=${page}`)
      .then((r) => r.json())
      .then((d) => setPageData(d))
      .catch(() => setPageData(null))
      .finally(() => setLoading(false));
  }, [page]);

  const items: AnimeProp[] = (pageData?.data || []).map((item: any) => ({
    session: item.anime_session,
    title: item.anime_title,
    poster: item.snapshot,
    type: item.fansub || "TV",
    episodes: item.episode,
  }));

  const lastPage = pageData?.last_page || 1;

  // Build page numbers to show (max 5 around current)
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(lastPage, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-ayo-gradient" />
          <h2 className="text-xl sm:text-2xl font-black text-white">Recently Added</h2>
        </div>
        {lastPage > 1 && (
          <span className="text-ayo-muted text-xs">Page {page} of {lastPage}</span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl shimmer" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 animate-fade-in">
          {items.map((item) => (
            <AnimeCard key={`${item.session}-${page}`} anime={item} />
          ))}
        </div>
      ) : (
        <p className="text-ayo-muted text-sm text-center py-10">No data available</p>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-1 flex-wrap pt-2">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-ayo-card border border-ayo-border text-ayo-muted hover:text-white hover:border-ayo-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >«</button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-ayo-card border border-ayo-border text-ayo-muted hover:text-white hover:border-ayo-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >‹</button>

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                p === page
                  ? "bg-ayo-gradient text-white ayo-glow"
                  : "bg-ayo-card border border-ayo-border text-ayo-muted hover:text-white hover:border-ayo-accent"
              }`}
            >{p}</button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page === lastPage}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-ayo-card border border-ayo-border text-ayo-muted hover:text-white hover:border-ayo-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >›</button>
          <button
            onClick={() => setPage(lastPage)}
            disabled={page === lastPage}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-ayo-card border border-ayo-border text-ayo-muted hover:text-white hover:border-ayo-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >»</button>
        </div>
      )}
    </section>
  );
}
