"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function updateTenantSettings(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await prisma.tenant.update({
    where: { id: session.tenantId },
    data: { name },
  });
  revalidatePath("/admin/settings");
}
