import { describe, it, expect } from "vitest";
import { isAuEmail, isAuPhone } from "./au-formats";

/**
 * Exhaustive unit tests for the pure AU format validators (FR-28). Covers the
 * edge cases called out by the spec: +61 forms, spaces, leading zero, too
 * short/long, letters, and empty input.
 */

describe("isAuEmail", () => {
  it.each([
    "jane@example.com",
    "jane.doe@example.com.au",
    "j+tag@sub.domain.io",
    "a@b.co",
  ])("accepts a valid email: %s", (email) => {
    expect(isAuEmail(email)).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(isAuEmail("  jane@example.com  ")).toBe(true);
  });

  it.each([
    "",
    "   ",
    "no-at-sign.com",
    "two@@example.com",
    "missing-tld@example",
    "space in@example.com",
    "trailing@space .com",
    "@example.com",
    "jane@",
    "jane@example.c",
    ".jane@example.com",       // leading dot in local part
    "jane.@example.com",       // trailing dot in local part
    "a..b@example.com",        // consecutive dots in local part
    "jane@example..com",       // consecutive dots in domain
    "jane@example.com.",       // trailing dot in domain
    "jane@.example.com",       // leading dot in domain
  ])("rejects an invalid email: %s", (email) => {
    expect(isAuEmail(email)).toBe(false);
  });
});

describe("isAuPhone", () => {
  it.each([
    "0412345678",
    "0412 345 678",
    "+61412345678",
    "+61 412 345 678",
    "0298765432",
    "02 9876 5432",
    "0387654321",
    "0765432100",
    "0812345678",
    "+61 2 9876 5432",
    "0412-345-678",       // dashes
    "(02) 9876 5432",     // parentheses
    "0412.345.678",       // dots
  ])("accepts a valid AU phone: %s", (phone) => {
    expect(isAuPhone(phone)).toBe(true);
  });

  it.each([
    "",
    "   ",
    "04123456",       // too short
    "041234567890",   // too long
    "04123456ab",     // letters
    "abcdefghij",     // letters
    "1412345678",     // wrong leading digit (no leading 0)
    "0512345678",     // invalid area/prefix digit
    "0112345678",     // invalid area/prefix digit
    "+62412345678",   // wrong country code
    "++61412345678",  // double plus
    "412345678",      // missing leading 0 and no +61
  ])("rejects an invalid AU phone: %s", (phone) => {
    expect(isAuPhone(phone)).toBe(false);
  });
});
