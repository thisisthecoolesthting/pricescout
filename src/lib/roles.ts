/** Session JWT uses tenant roles uppercase (OWNER/STAFF); invite picker uses lowercase slugs. */

export function isTenantOwnerRole(role: string): boolean {
  return role.trim().toUpperCase() === "OWNER";
}

const INVITE_ROLE_MAP = {
  owner: "OWNER",
  admin: "STAFF",
  scanner: "STAFF",
} as const;

export type InviteUiRole = keyof typeof INVITE_ROLE_MAP;

export function inviteUiRoleToUserRole(r: InviteUiRole): string {
  return INVITE_ROLE_MAP[r];
}
