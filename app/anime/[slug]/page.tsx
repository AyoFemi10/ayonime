import Link from "next/link";
import EpisodeGrid from "@/components/EpisodeGrid";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Episode {
  id: number;
  episode: number;
  session: string;
  snapshot: string;
  duration: string;
  created_at: string;
}

async function getEpisodes(slug: string, title: string): Promise<Episode[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/anime/${slug}/episodes?anime_name=${encodeURIComponent(title)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function AnimePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { title?: string };
}) {
  const title = searchParams.title || params.slug;
  const episodes = await getEpisodes(params.slug, title);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-20 sm:pt-28 pb-16 flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-3 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 text-ayo-muted hover:text-white transition-colors text-sm w-fit">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-ayo-gradient shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-black text-white">{title}</h1>
        </div>
        <p className="text-ayo-muted text-sm pl-4">
          {episodes.length} episode{episodes.length !== 1 ? "s" : ""}
        </p>
      </div>

      {episodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-ayo-card border border-ayo-border flex items-center justify-center">
            <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <p className="text-ayo-muted text-lg font-semibold">No episodes found</p>
        </div>
      ) : (
        <EpisodeGrid episodes={episodes} slug={params.slug} title={title} />
      )}
    </main>
  );
}
