"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isTenantOwnerRole } from "@/lib/roles";

export async function updateTenantSettings(formData: FormData) {
  const session = await getSession();
  if (!session || !isTenantOwnerRole(session.role)) return;

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const storeAddress = String(formData.get("storeAddress") ?? "").trim() || null;
  const defaultCurrency = String(formData.get("defaultCurrency") ?? "USD") || "USD";
  const tagPriceRounding = String(formData.get("tagPriceRounding") ?? "nearest_1") || "nearest_1";
  const defaultScannerRole = String(formData.get("defaultScannerRole") ?? "scanner") || "scanner";

  await prisma.tenant.update({
    where: { id: session.tenantId },
    data: {
      name,
      storeAddress,
      defaultCurrency,
      tagPriceRounding,
      defaultScannerRole,
    },
  });
  revalidatePath("/admin/settings");
}
