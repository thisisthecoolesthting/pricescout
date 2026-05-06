import { describe, expect, it } from "vitest";
import { checkoutTierSchema, identifyBodySchema } from "./api-schemas";

describe("api-schemas", () => {
  it("identifyBodySchema parses valid payload", () => {
    const r = identifyBodySchema.safeParse({
      imageBase64: "x".repeat(40),
      costBasis: "12",
    });
    expect(r.success).toBe(true);
  });

  it("checkoutTierSchema rejects unknown tier", () => {
    const r = checkoutTierSchema.safeParse("bad_tier");
    expect(r.success).toBe(false);
  });
});
