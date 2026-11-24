import { test } from "node:test";
import assert from "node:assert/strict";
import { DEPARTMENTS, MEMBER_ROLES, MEMBERS } from "../src/data/registry.ts";
import {
  completeness,
  countBy,
  formatSheetDate,
  normalizeRoles,
  normalizeTokens,
  searchMembers,
  validateMember,
} from "../src/lib/registryLogic.ts";

test("empty search term returns no rows (sheet IF guard)", () => {
  assert.equal(searchMembers(MEMBERS, "fullName", "   ").length, 0);
});

test("text search is case-insensitive and trims the term", () => {
  const rows = searchMembers(MEMBERS, "musicRoles", "  drummer ");
  assert.ok(rows.length >= 2);
  for (const r of rows) assert.match(r.musicRoles, /drummer/i);
});

test("birthdate search matches by month number", () => {
  const march = searchMembers(MEMBERS, "birthdate", "3");
  assert.ok(march.length > 0);
  for (const r of march) assert.equal(r.birthdate.slice(5, 7), "03");
});

test("invalid month returns no rows", () => {
  assert.equal(searchMembers(MEMBERS, "birthdate", "13").length, 0);
  assert.equal(searchMembers(MEMBERS, "birthdate", "March").length, 0);
});

test("dates render like Google Sheets", () => {
  assert.equal(formatSheetDate("2004-03-14"), "3/14/2004");
});

test("genre tokens are split and consistently cased", () => {
  assert.deepEqual(normalizeTokens("Rock,opm, pop"), ["Rock", "OPM", "Pop"]);
  assert.deepEqual(normalizeTokens("r&b, ballad"), ["R&B", "Ballad"]);
});

test("music roles map to standard categories without duplicates", () => {
  assert.deepEqual(normalizeRoles("DRUMMER/PERCUSSIONIST"), ["Drums & percussion"]);
  assert.deepEqual(normalizeRoles("VOCALIST, KEYBOARDIST"), ["Vocals", "Keys"]);
});

test("countBy sorts by count then key", () => {
  const out = countBy(["b", "a", "b"], (x) => x);
  assert.deepEqual(out, [
    { key: "b", count: 2 },
    { key: "a", count: 1 },
  ]);
});

test("completeness reflects blank optional fields", () => {
  const c = completeness(MEMBERS, "instrument");
  assert.ok(c > 0 && c < 1);
  assert.equal(completeness(MEMBERS, "email"), 1);
});

test("every demo row passes the sheet's validation rules", () => {
  for (const r of MEMBERS) assert.deepEqual(validateMember(r, DEPARTMENTS, MEMBER_ROLES), [], r.fullName);
});

test("validation catches bad entries", () => {
  const bad = { ...MEMBERS[0], department: "XYZ", level: 2.5, birthdate: "14/03/2004" } as unknown as (typeof MEMBERS)[number];
  assert.deepEqual(validateMember(bad, DEPARTMENTS, MEMBER_ROLES), ["department", "level", "birthdate"]);
});

test("demo data contains no real school domain", () => {
  for (const r of MEMBERS) assert.ok(r.email.endsWith("@school.edu.ph"));
});
