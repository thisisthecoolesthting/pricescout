import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const session = await getSession();
  if (!session) return null;

  const users = await prisma.user.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8">
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
