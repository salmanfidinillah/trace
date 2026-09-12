import { describe, expect, it } from "vitest";
import { emailScanSchema, maskEmail, normalizeEmail, passwordHashSchema } from "../lib/validation";

describe("validation", () => {
  it("normalizes and masks email without exposing the full local part", () => {
    expect(normalizeEmail("  User@Example.com ")).toBe("user@example.com");
    expect(maskEmail("user@example.com")).toBe("us**@example.com");
  });

  it("accepts valid scan input and rejects invalid input", () => {
    expect(emailScanSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
    expect(emailScanSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });

  it("only accepts the expected hash shape for password lookup", () => {
    expect(passwordHashSchema.safeParse({ prefix: "ABCDE", suffix: "A".repeat(35) }).success).toBe(true);
    expect(passwordHashSchema.safeParse({ prefix: "password", suffix: "secret" }).success).toBe(false);
  });
});
