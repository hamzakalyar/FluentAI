import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? "p-4" : "p-0"
      }`}
    >
      <header
        className={`mx-auto transition-all duration-500 ${
          scrolled
            ? "max-w-5xl bg-[var(--bg-surface)]/70 backdrop-blur-2xl border border-[var(--border-subtle)] shadow-premium rounded-[28px]"
            : "max-w-full bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm"
        }`}
      >
        <div
          className={`flex items-center justify-between px-8 transition-all duration-500 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-4 group text-left"
          >
            <div className="relative w-11 h-11 flex items-center justify-center bg-teal-600 rounded-2xl shadow-lg shadow-teal-500/20 overflow-hidden group-hover:rotate-3 transition-transform duration-500">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M3 12h1m3 0h1m3-4v8m4-10v12m4-8v4m3-4h1" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-[var(--text-primary)] leading-none">
                FluentAI
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Clinical Intelligence
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-bold text-slate-500 hover:text-teal-600 transition-all relative group/link"
              >
                {l.label}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover/link:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-black text-[var(--text-secondary)] hover:text-teal-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="h-11 px-7 text-sm font-black text-white rounded-xl transition-all bg-teal-600 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-500/20 active:scale-95"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--bg-elevated)] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)]"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            open ? "max-h-[500px] border-t border-slate-100" : "max-h-0"
          }`}
        >
          <div className="px-8 py-10 flex flex-col gap-8 bg-[var(--bg-surface)] backdrop-blur-xl">
            <div className="flex flex-col gap-6">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-2xl font-black text-[var(--text-primary)] transition-colors hover:text-teal-600"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-4 pt-8 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => navigate("/login")}
                className="h-14 w-full font-black text-[var(--text-secondary)] border-2 border-[var(--border-subtle)] rounded-2xl hover:bg-[var(--bg-elevated)] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="h-14 w-full font-black text-white rounded-2xl shadow-lg shadow-teal-500/10 active:scale-[0.98] transition-all bg-teal-600 hover:bg-teal-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
