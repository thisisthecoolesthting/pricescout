import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const tenantId = session.tenantId;

  const [totalScans, recent, categories] = await Promise.all([
    prisma.scan.count({ where: { tenantId } }),
    prisma.scan.findMany({
      where: { tenantId },
      orderBy: { scannedAt: "desc" },
      take: 8,
      include: { user: true, device: true },
    }),
    prisma.scan.groupBy({
      by: ["identifyCategory"],
      where: { tenantId },
      _count: { _all: true },
    }),
  ]);

  const hist = [...categories].sort((a, b) => (b._count._all ?? 0) - (a._count._all ?? 0));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
        <p className="mt-2 text-muted">Recent flip activity across your tenant.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-soft">Total scans</p>
          <p className="mt-2 text-4xl font-bold text-ink">{totalScans}</p>
        </div>
        <div className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm md:col-span-2">
          <p className="text-sm font-medium text-soft">Categories (confidence buckets)</p>
          <ul className="mt-4 space-y-2">
            {hist.slice(0, 6).map((row) => (
              <li key={row.identifyCategory ?? "unknown"} className="flex justify-between text-sm">
                <span className="text-ink">{row.identifyCategory ?? "Uncategorized"}</span>
                <span className="font-semibold text-mint-700">{row._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-ink">Recent scans</h2>
          <Link href="/admin/scans" className="text-sm font-medium text-mint-700 underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line/60 text-soft">
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Verdict</th>
                <th className="py-2 pr-4 font-medium">Median</th>
                <th className="py-2 pr-4 font-medium">Staff</th>
                <th className="py-2 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id} className="border-b border-line/40">
                  <td className="py-3 pr-4 font-medium text-ink">{s.identifyTitle ?? "—"}</td>
                  <td className="py-3 pr-4 capitalize text-muted">{s.verdict ?? "—"}</td>
                  <td className="py-3 pr-4 text-muted">
                    {s.compMedian != null ? `$${s.compMedian.toFixed(2)}` : "—"}
                  </td>
                  <td className="py-3 pr-4 text-muted">{s.user.name}</td>
                  <td className="py-3 text-muted">{s.scannedAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
