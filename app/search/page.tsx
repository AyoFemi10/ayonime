import AnimeCard, { AnimeProp } from "@/components/AnimeCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function searchAnime(q: string): Promise<AnimeProp[]> {
  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((item: any) => ({
      session: item.session,
      title: item.title,
      poster: item.poster,
      type: item.type,
      episodes: item.episodes,
      score: item.score,
    }));
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q || "";
  const results = q ? await searchAnime(q) : [];

  return (
    <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-ayo-gradient" />
          <h1 className="text-2xl font-black text-white">
            {q ? `Results for "${q}"` : "Browse Anime"}
          </h1>
        </div>
        {q && (
          <p className="text-ayo-muted text-sm pl-4">
            {results.length} title{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 animate-fade-in">
          {results.map((item) => (
            <AnimeCard key={item.session} anime={item} />
          ))}
        </section>
      ) : q ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-ayo-card border border-ayo-border flex items-center justify-center">
            <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <p className="text-ayo-muted text-lg font-semibold">No results found</p>
          <p className="text-ayo-muted text-sm">Try a different search term</p>
        </div>
      ) : null}
    </main>
  );
}
