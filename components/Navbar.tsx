"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur bg-ayo-bg/80 border-b border-ayo-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-ayo-gradient flex items-center justify-center ayo-glow">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight">
            AYO<span className="ayo-gradient">NIME</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-ayo-muted">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/search?q=action" className="hover:text-white transition-colors">Browse</Link>
          <Link href="/downloads" className="hover:text-white transition-colors flex items-center gap-1.5">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Downloads
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full bg-ayo-card border border-ayo-border rounded-full px-4 py-2 pr-10 text-sm text-white placeholder-ayo-muted focus:outline-none focus:border-ayo-accent transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ayo-muted hover:text-ayo-accent transition-colors"
              aria-label="Search"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-ayo-muted hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen
              ? <path d="M18 6 6 18M6 6l12 12" />
              : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-ayo-surface border-t border-ayo-border px-6 py-4 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime..."
              className="flex-1 bg-ayo-card border border-ayo-border rounded-lg px-4 py-2 text-sm text-white placeholder-ayo-muted focus:outline-none focus:border-ayo-accent"
            />
            <button type="submit" className="px-4 py-2 bg-ayo-gradient rounded-lg text-white text-sm font-bold">
              Go
            </button>
          </form>
          <Link href="/" className="text-ayo-muted hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/search?q=action" className="text-ayo-muted hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Browse</Link>
          <Link href="/downloads" className="text-ayo-muted hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Downloads</Link>
        </div>
      )}
    </nav>
  );
}
