import { describe, expect, it } from "vitest";
import { isEmailVerified } from "../lib/server/auth-policy";

describe("email verification authorization", () => {
  it("allows verified Firebase tokens", () => {
    expect(isEmailVerified({ email_verified: true })).toBe(true);
  });

  it("rejects unverified Firebase tokens", () => {
    expect(isEmailVerified({ email_verified: false })).toBe(false);
    expect(isEmailVerified({})).toBe(false);
  });
});
