import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { brand } from "@/lib/brand";
import { MobileAppCard } from "@/components/admin/MobileAppCard";
import { addDevice, renameDevice, revokeDevice } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDevicesPage() {
  const session = await getSession();
  if (!session) return null;

  const tenantId = session.tenantId;

  const [tenant, devices] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: tenantId } }),
    prisma.device.findMany({
      where: { tenantId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://pricescout.pro";
  const scanUrl = `${origin.replace(/\/$/, "")}/scan`;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-ink">Devices</h1>
        <p className="mt-2 text-muted">
          Up to {tenant?.deviceLimit ?? 4} active installs on your plan — revoke retired phones anytime.
        </p>
      </div>

      <MobileAppCard />

      <section className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Install URL</h2>
        <p className="mt-2 text-sm text-muted">
          Crew opens this URL on each scanner phone ({brand.name} web app). QR encode during onboarding UI polish.
        </p>
        <code className="mt-4 block rounded-xl bg-cream px-4 py-3 text-sm text-ink">{scanUrl}</code>
      </section>

      <section className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-ink">Register another phone</h2>
        <form action={addDevice} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-xs font-medium text-soft" htmlFor="name">
              Friendly name
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="Front counter Pixel"
              className="w-full rounded-xl border border-line/70 px-4 py-2 text-sm text-ink outline-none ring-mint-500/30 focus:ring-2"
            />
          </div>
          <button type="submit" className="btn-primary px-6 py-2 text-sm">
            Add device slot
          </button>
        </form>
      </section>

      <div className="space-y-4">
        {devices.map((d) => (
          <div
            key={d.id}
            className="flex flex-col gap-4 rounded-2xl border border-line/60 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold text-ink">{d.name}</p>
              <p className="text-xs text-soft">
                Fingerprint <span className="font-mono">{d.installFingerprint}</span>
              </p>
              <p className="text-xs text-soft">
                Last seen {d.lastSeenAt ? d.lastSeenAt.toLocaleString() : "never"} ·{" "}
                <span className="capitalize">{d.status}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <form action={renameDevice} className="flex gap-2">
                <input type="hidden" name="deviceId" value={d.id} />
                <input
                  name="name"
                  defaultValue={d.name}
                  className="rounded-lg border border-line/70 px-3 py-2 text-sm"
                />
                <button type="submit" className="rounded-lg border border-line/70 px-3 py-2 text-sm hover:bg-cream">
                  Rename
                </button>
              </form>
              {d.status === "active" ? (
                <form action={revokeDevice}>
                  <input type="hidden" name="deviceId" value={d.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    Revoke
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
