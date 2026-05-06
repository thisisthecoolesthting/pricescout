"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Camera, Menu, X } from "lucide-react";
import { brand } from "@/lib/brand";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/industries", label: "Industries" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/faq", label: "FAQ" },
  { href: "/watch", label: "Watch tour" },
];

/**
 * Header shell + a sibling-mounted mobile drawer.
 *
 * The drawer is INTENTIONALLY rendered as a sibling of <header>, not a child.
 * Sticky + backdrop-blur on <header> creates a new stacking context; any
 * z-index inside it is trapped below position:fixed siblings and the drawer
 * disappears behind the header's backdrop blur. This is the trap the
 * SolutionStore SaaS spine (build/SOLUTIONSTORE_SAAS_SPINE.md, section 8)
 * explicitly warns against. We keep state at this top level so the hamburger
 * inside <header> can still toggle the sibling drawer.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when drawer is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-line/50 bg-white/95 backdrop-blur-xl">
        <nav
          className="container-pricescout flex items-center justify-between py-4"
          aria-label="Primary"
        >
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span
              aria-hidden
              className="inline-block h-9 w-9 rounded-xl bg-gradient-to-br from-mint-500 to-mint-600"
            />
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              {brand.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-8 md:flex" role="menubar">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="nav-link">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/scan" className="btn-primary">
                <Camera aria-hidden className="mr-2 h-4 w-4" />
                Open scanner
              </Link>
            </li>
          </ul>

          {/* Mobile hamburger — toggles the sibling drawer/overlay below */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line/60 text-ink transition hover:bg-cream"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/*
        Mobile overlay (full-screen scrim) — sibling of <header> so it lives in
        the root stacking context, not trapped inside the sticky+blur header.
      */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/*
        Mobile drawer — sibling of <header>, slides from the LEFT (per spine
        convention), 320px wide, beats every header z-index because it's
        position:fixed at z-[70].
      */}
      <aside
        id="mobile-drawer"
        aria-label="Mobile menu"
        aria-hidden={!open}
        className={`md:hidden fixed left-0 top-0 bottom-0 z-[70] w-[320px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span
              aria-hidden
              className="inline-block h-8 w-8 rounded-xl bg-gradient-to-br from-mint-500 to-mint-600"
            />
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              {brand.name}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line/60 text-ink transition hover:bg-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-4 py-5" aria-label="Mobile primary">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-cream"
            >
              {n.label}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/scan"
              onClick={() => setOpen(false)}
              className="btn-primary btn-full btn-large"
            >
              <Camera aria-hidden className="mr-2 h-5 w-5" />
              Open scanner
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
