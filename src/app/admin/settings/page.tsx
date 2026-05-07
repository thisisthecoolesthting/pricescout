import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { updateTenantSettings } from "./actions";
import { isTenantOwnerRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) return null;

  const owner = isTenantOwnerRole(session.role);
  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId },
  });

  const tr = tenant?.tagPriceRounding ?? "nearest_1";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-2 text-muted">Workspace defaults your crew sees on scanners and Marketplace drafts.</p>
      </div>

      {!owner ? (
        <p role="alert" className="max-w-2xl rounded-2xl border border-line/70 bg-cream px-4 py-3 text-sm text-muted">
          Only owners can edit workspace settings. Ask an owner to update store defaults.
        </p>
      ) : null}

      <form
        action={updateTenantSettings}
        className="max-w-2xl space-y-6 rounded-2xl border border-line/60 bg-white p-8 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="name">
            Store name
          </label>
          <input
            id="name"
            name="name"
            required
            readOnly={!owner}
            defaultValue={tenant?.name ?? ""}
            disabled={!owner}
            className="w-full rounded-xl border border-line/70 px-4 py-3 text-ink outline-none ring-mint-500/30 focus:ring-2 disabled:bg-cream/80"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="storeAddress">
            Store address (pickup line for Marketplace copy)
          </label>
          <textarea
            id="storeAddress"
            name="storeAddress"
            rows={3}
            readOnly={!owner}
            disabled={!owner}
            defaultValue={tenant?.storeAddress ?? ""}
            className="w-full rounded-xl border border-line/70 px-4 py-3 text-sm text-ink outline-none ring-mint-500/30 focus:ring-2 disabled:bg-cream/80"
            placeholder="123 Main St, City, ST 12345"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="defaultCurrency">
            Default currency
          </label>
          <select
            id="defaultCurrency"
            name="defaultCurrency"
            disabled={!owner}
            defaultValue={tenant?.defaultCurrency ?? "USD"}
            className="w-full rounded-xl border border-line/70 px-4 py-3 text-sm text-ink disabled:bg-cream/80"
          >
            <option value="USD">USD</option>
            <option value="CAD" disabled>
              CAD (coming soon)
            </option>
            <option value="GBP" disabled>
              GBP (coming soon)
            </option>
            <option value="EUR" disabled>
              EUR (coming soon)
            </option>
          </select>
        </div>
        <fieldset disabled={!owner} className="space-y-0">
          <legend className="mb-2 text-sm font-medium text-ink">Tag price rounding</legend>
          <div className="space-y-2 text-sm text-muted">
            <label className="flex items-center gap-2">
              <input type="radio" name="tagPriceRounding" value="nearest_1" defaultChecked={tr === "nearest_1"} />
              Nearest $1
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="tagPriceRounding" value="nearest_5" defaultChecked={tr === "nearest_5"} />
              Nearest $5
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="tagPriceRounding" value="none" defaultChecked={tr === "none"} />
              No rounding
            </label>
          </div>
        </fieldset>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="defaultScannerRole">
            Default role for new devices
          </label>
          <select
            id="defaultScannerRole"
            name="defaultScannerRole"
            disabled={!owner}
            defaultValue={tenant?.defaultScannerRole ?? "scanner"}
            className="w-full rounded-xl border border-line/70 px-4 py-3 text-sm text-ink disabled:bg-cream/80"
          >
            <option value="scanner">Scanner</option>
            <option value="scanner_and_marketplace">Scanner + Marketplace poster</option>
          </select>
        </div>
        {owner ? (
          <button type="submit" className="btn-primary px-8 py-3">
            Save changes
          </button>
        ) : null}
      </form>
    </div>
  );
}
