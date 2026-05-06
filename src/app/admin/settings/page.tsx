import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { updateTenantSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) return null;

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-2 text-muted">Workspace identity — deeper fee defaults ship once billing dashboards graduate.</p>
      </div>

      <form action={updateTenantSettings} className="max-w-xl space-y-6 rounded-2xl border border-line/60 bg-white p-8 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="name">
            Store name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={tenant?.name ?? ""}
            className="w-full rounded-xl border border-line/70 px-4 py-3 text-ink outline-none ring-mint-500/30 focus:ring-2"
          />
        </div>
        <button type="submit" className="btn-primary px-8 py-3">
          Save changes
        </button>
      </form>
    </div>
  );
}
