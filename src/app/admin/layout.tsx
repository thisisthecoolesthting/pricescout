import Link from "next/link";
import { getSession } from "@/lib/session";
import { LogoutButton } from "./logout-button";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/scans", label: "Scans" },
  { href: "/admin/devices", label: "Devices" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/billing", label: "Billing" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-[#f4faf7]">
      <aside className="hidden w-56 shrink-0 border-r border-line/60 bg-white p-4 md:block">
        <Link href="/admin" className="mb-8 block font-display text-lg font-bold text-ink">
          PriceScout Admin
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-cream"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 bg-white px-4 py-3">
          <p className="text-sm text-muted">
            Signed in as <span className="font-medium text-ink">{session?.email ?? "operator"}</span>
          </p>
          <LogoutButton />
        </header>

        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
