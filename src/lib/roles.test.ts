import { describe, expect, it } from "vitest";
import { inviteUiRoleToUserRole, isTenantOwnerRole } from "./roles";

describe("roles", () => {
  it("treats OWNER case-insensitively", () => {
    expect(isTenantOwnerRole("OWNER")).toBe(true);
    expect(isTenantOwnerRole("owner")).toBe(true);
    expect(isTenantOwnerRole(" STAFF")).toBe(false);
  });

  it("maps invite UI slugs to DB roles", () => {
    expect(inviteUiRoleToUserRole("owner")).toBe("OWNER");
    expect(inviteUiRoleToUserRole("admin")).toBe("STAFF");
    expect(inviteUiRoleToUserRole("scanner")).toBe("STAFF");
  });
});
