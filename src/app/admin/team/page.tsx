import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const session = await getSession();
  if (!session) return null;

  const [users, tenant] = await Promise.all([
    prisma.user.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.tenant.findUnique({ where: { id: session.tenantId } }),
  ]);

  return (
    <div className="space-y-8">
      {tenant?.subscriptionStatus === "WPBS" ? (
        <section className="rounded-2xl border border-mint-500/30 bg-mint-50/50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Winter Park Benefit Shop (WPBS) access</h2>
          <p className="mt-2 text-sm text-muted">
            Partner bypass active for this organization. Granted{" "}
            {tenant.wpbsGrantedAt ? tenant.wpbsGrantedAt.toLocaleString() : "—"} · Expires{" "}
            {tenant.wpbsExpiresAt ? tenant.wpbsExpiresAt.toLocaleString() : "—"}
          </p>
          <p className="mt-2 text-xs text-soft">
            Cross-tenant grant management (extend / revoke) needs a superuser shell — not wired in this admin yet.
          </p>
        </section>
      ) : null}
      <div>
        <h1 className="text-3xl font-bold text-ink">Team</h1>
        <p className="mt-2 text-muted">
          Staff accounts tied to your tenant. Invite tooling ships after transactional email is wired — email{" "}
          <a href="mailto:hello@pricescout.pro" className="text-mint-700 underline">
            hello@pricescout.pro
          </a>{" "}
          for bulk onboarding meanwhile.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line/60 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line/60 bg-cream/60">
            <tr className="text-soft">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line/40">
                <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3 font-medium text-muted">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
