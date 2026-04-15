import Hero from "@/components/Hero";
import AnimeCard, { AnimeProp } from "@/components/AnimeCard";
import RecentlyAdded from "@/components/RecentlyAdded";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getAiring(): Promise<AnimeProp[]> {
  try {
    const res = await fetch(`${API_BASE}/api/airing`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((item: any) => ({
      session: item.anime_session,
      title: item.anime_title,
      poster: item.snapshot,
      type: item.fansub || "TV",
      episodes: item.episode,
    }));
  } catch {
    return [];
  }
}

async function getTopAnime(): Promise<AnimeProp[]> {
  try {
    const res = await fetch(`${API_BASE}/api/top-anime`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).slice(0, 12).map((item: any) => ({
      session: item.session || item.anime_session,
      title: item.title || item.anime_title,
      poster: item.poster || item.snapshot,
      type: item.type || "TV",
      episodes: item.episodes || item.episode,
      score: item.score,
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const [airing, topAnime] = await Promise.all([getAiring(), getTopAnime()]);

  return (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12 flex flex-col gap-12 sm:gap-16">

        {/* Currently Airing */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-ayo-gradient" />
              <h2 className="text-xl sm:text-2xl font-black text-white">Currently Airing</h2>
            </div>
            <span className="text-ayo-muted text-sm">{airing.length > 0 ? `${airing.length} shows` : ""}</span>
          </div>
          {airing.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
              {airing.map((item) => (
                <AnimeCard key={item.session} anime={item} />
              ))}
            </div>
          ) : (
            <EmptyState message="Backend not connected" sub="Start the FastAPI backend on port 8000 to load live anime data." />
          )}
        </section>

        {/* Top Anime */}
        {topAnime.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-ayo-gradient" />
              <h2 className="text-xl sm:text-2xl font-black text-white">Top Anime</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">★ Popular</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
              {topAnime.map((item) => (
                <AnimeCard key={item.session} anime={item} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Added — paginated client component */}
        <RecentlyAdded />

      </main>
    </>
  );
}

function EmptyState({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-ayo-card border border-ayo-border flex items-center justify-center">
        <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <p className="text-ayo-muted text-lg font-semibold">{message}</p>
      <p className="text-ayo-muted text-sm max-w-sm">{sub}</p>
    </div>
  );
}
