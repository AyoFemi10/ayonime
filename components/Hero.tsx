import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[75vh] flex items-center overflow-hidden bg-ayo-bg pt-16">
      {/* Glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] rounded-full bg-ayo-accent/10 blur-[140px]" />
        <div className="absolute top-20 right-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-ayo-pink/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] rounded-full bg-ayo-accent/5 blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24 flex flex-col gap-5 sm:gap-8 items-start">
        {/* Badge */}
        <div className="flex items-center gap-2 bg-ayo-card border border-ayo-border rounded-full px-3 sm:px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-ayo-accent pulse-dot" />
          <span className="text-xs font-semibold text-ayo-muted uppercase tracking-widest">
            Stream &amp; Download — Free
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.05] max-w-3xl">
          Watch. Download.{" "}
          <span className="ayo-gradient">Repeat.</span>
        </h1>

        <p className="text-ayo-muted text-base sm:text-lg max-w-xl leading-relaxed">
          Stream anime in HD or download episodes to keep forever.
          No subscriptions, no limits.
        </p>

        {/* CTAs */}
        <div className="flex gap-3 sm:gap-4 flex-wrap">
          <Link
            href="/search?q=action"
            className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-white bg-ayo-gradient ayo-glow hover:opacity-90 transition-opacity text-sm sm:text-base"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Watching
          </Link>
          <Link
            href="/downloads"
            className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-white border border-ayo-border bg-ayo-card hover:border-ayo-accent transition-colors text-sm sm:text-base"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            My Downloads
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2">
          {[
            { icon: "▶", label: "HD Streaming" },
            { icon: "⬇", label: "MP4 Downloads" },
            { icon: "🎌", label: "JP / EN Audio" },
            { icon: "⚡", label: "Fast Servers" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 bg-ayo-card border border-ayo-border rounded-full px-3 sm:px-4 py-1.5"
            >
              <span className="text-xs">{f.icon}</span>
              <span className="text-xs font-semibold text-ayo-muted">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
