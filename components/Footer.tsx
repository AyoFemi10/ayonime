import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ayo-border bg-ayo-surface mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row justify-between gap-6 sm:gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ayo-gradient flex items-center justify-center">
              <span className="text-white font-black text-xs">A</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              AYO<span className="ayo-gradient">NIME</span>
            </span>
          </div>
          <p className="text-ayo-muted text-sm max-w-xs leading-relaxed">
            Stream and download anime in HD. Free, forever.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-white font-semibold text-sm">Browse</span>
            <Link href="/" className="text-ayo-muted text-sm hover:text-white transition-colors">Home</Link>
            <Link href="/search?q=action" className="text-ayo-muted text-sm hover:text-white transition-colors">Action</Link>
            <Link href="/search?q=romance" className="text-ayo-muted text-sm hover:text-white transition-colors">Romance</Link>
            <Link href="/downloads" className="text-ayo-muted text-sm hover:text-white transition-colors">My Downloads</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-white font-semibold text-sm">Popular</span>
            <Link href="/search?q=naruto" className="text-ayo-muted text-sm hover:text-white transition-colors">Naruto</Link>
            <Link href="/search?q=one piece" className="text-ayo-muted text-sm hover:text-white transition-colors">One Piece</Link>
            <Link href="/search?q=demon slayer" className="text-ayo-muted text-sm hover:text-white transition-colors">Demon Slayer</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-ayo-border px-6 py-4 max-w-7xl mx-auto flex justify-between items-center">
        <p className="text-ayo-muted text-xs">© 2026 AYOMIKUN DEV CORP. For personal use only.</p>
        <p className="text-ayo-muted text-xs">Powered by AnimePahe</p>
      </div>
    </footer>
  );
}
