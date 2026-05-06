import Link from "next/link";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="bg-ink py-16 text-white">
      <div className="container-pricescout">
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-mint-500 to-mint-600" />
              <span className="font-display text-base font-bold tracking-tight">
                {brand.name}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-slate-400">
              Discover the hidden value of secondhand treasures. Visual flip scanner for resellers — point, snap, sell.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/features" className="transition-colors hover:text-mint-500">Features</Link></li>
                <li><Link href="/scan" className="transition-colors hover:text-mint-500">Scanner</Link></li>
                <li><Link href="/pricing" className="transition-colors hover:text-mint-500">Pricing</Link></li>
                <li><Link href="/how-it-works" className="transition-colors hover:text-mint-500">How it works</Link></li>
                <li><Link href="/watch" className="transition-colors hover:text-mint-500">Watch</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/legal/privacy" className="transition-colors hover:text-mint-500">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="transition-colors hover:text-mint-500">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about" className="transition-colors hover:text-mint-500">About</Link></li>
                <li><Link href="/contact" className="transition-colors hover:text-mint-500">Contact</Link></li>
                <li><Link href="/blog" className="transition-colors hover:text-mint-500">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/resources" className="transition-colors hover:text-mint-500">Guides hub</Link></li>
                <li><Link href="/support/getting-started" className="transition-colors hover:text-mint-500">Getting started</Link></li>
                <li><Link href="/compare" className="transition-colors hover:text-mint-500">Compare</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
