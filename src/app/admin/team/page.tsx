import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isTenantOwnerRole } from "@/lib/roles";
import { TeamInviteShell } from "@/components/admin/TeamInviteShell";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const session = await getSession();
  if (!session) return null;

  const owner = isTenantOwnerRole(session.role);

  const [users, tenant, pendingInvites] = await Promise.all([
    prisma.user.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.tenant.findUnique({ where: { id: session.tenantId } }),
    owner
      ? prisma.invite.findMany({
          where: { tenantId: session.tenantId, redeemedAt: null },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
      : Promise.resolve([]),
  ]);

  const tenantIsWpbs = tenant?.subscriptionStatus === "WPBS";

  const inviteRows = pendingInvites.map((i) => ({
    id: i.id,
    email: i.email,
    role: i.role,
    expiresAt: i.expiresAt.toISOString(),
    createdAt: i.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Team</h1>
        <p className="mt-2 text-muted">
          Staff accounts scoped to this workspace. Owners can invite admins and scanners with a single-use link.
        </p>
      </div>

      <TeamInviteShell isOwner={owner} initialInvites={inviteRows} tenantIsWpbs={!!tenantIsWpbs} />

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
