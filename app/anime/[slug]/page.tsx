import Link from "next/link";

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
    <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 flex flex-col gap-8">
      {/* Back + title */}
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-ayo-muted hover:text-white transition-colors text-sm w-fit"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-ayo-gradient" />
          <h1 className="text-3xl font-black text-white">{title}</h1>
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
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {episodes.map((ep) => (
            <Link
              key={ep.session}
              href={`/watch/${params.slug}/${ep.session}?title=${encodeURIComponent(title)}&ep=${ep.episode}`}
              className="ep-card group bg-ayo-card border border-ayo-border rounded-xl overflow-hidden flex flex-col"
            >
              {ep.snapshot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ep.snapshot}
                  alt={`Episode ${ep.episode}`}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-ayo-surface flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="#2a2a3d" strokeWidth="1.5" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              )}
              <div className="p-3 flex flex-col gap-1">
                <span className="text-white font-bold text-sm">Ep {ep.episode}</span>
                {ep.duration && (
                  <span className="text-ayo-muted text-xs">{ep.duration}</span>
                )}
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
