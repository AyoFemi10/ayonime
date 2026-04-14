import Link from "next/link";

export interface AnimeProp {
  session: string;
  title: string;
  poster?: string;
  type?: string;
  episodes?: number;
  score?: string | number;
}

export default function AnimeCard({ anime }: { anime: AnimeProp }) {
  return (
    <Link
      href={`/anime/${anime.session}?title=${encodeURIComponent(anime.title)}`}
      className="anime-card group block"
    >
      <div className="relative rounded-xl overflow-hidden bg-ayo-card border border-ayo-border aspect-[2/3]">
        {/* Poster */}
        {anime.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={anime.poster}
            alt={anime.title}
            className="card-img w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ayo-card">
            <svg width="40" height="40" fill="none" stroke="#2a2a3d" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3 gap-2">
          <span className="text-white text-xs font-bold bg-ayo-accent/90 rounded px-2 py-0.5 self-start">
            Watch Now
          </span>
        </div>

        {/* Type badge */}
        {anime.type && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5">
            <span className="text-xs font-bold text-ayo-muted uppercase">{anime.type}</span>
          </div>
        )}

        {/* Score badge */}
        {anime.score && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5 flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs font-bold text-white">{anime.score}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 pb-1 px-0.5">
        <h3 className="text-white font-semibold text-sm line-clamp-2 leading-snug group-hover:text-ayo-glow transition-colors">
          {anime.title}
        </h3>
        {anime.episodes && (
          <p className="text-ayo-muted text-xs mt-1">{anime.episodes} episodes</p>
        )}
      </div>
    </Link>
  );
}
