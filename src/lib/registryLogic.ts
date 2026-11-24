import type { Member, SearchKey } from "../data/registry";

/**
 * Mirrors the Search sheet formula:
 *   IF(colName="BIRTHDATE", MONTH(birthdate)=VALUE(term), ISNUMBER(SEARCH(TRIM(term), searchCol)))
 * An empty term returns nothing, like the sheet's IF(B2="", "", …) guard.
 */
export function searchMembers(rows: Member[], key: SearchKey, rawTerm: string): Member[] {
  const term = rawTerm.trim();
  if (term === "") return [];
  if (key === "birthdate") {
    const month = Number(term);
    if (!Number.isInteger(month) || month < 1 || month > 12) return [];
    return rows.filter((r) => Number(r.birthdate.slice(5, 7)) === month);
  }
  const needle = term.toLowerCase();
  return rows.filter((r) => String(r[key]).toLowerCase().includes(needle));
}

/** Google Sheets displays dates as M/D/YYYY. */
export function formatSheetDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${m}/${d}/${y}`;
}

const GENRE_CANON: Record<string, string> = {
  opm: "OPM",
  "r&b": "R&B",
  rnb: "R&B",
  edm: "EDM",
  any: "Any",
};

/** Split a free-text cell into tidy, consistently cased tokens. */
export function normalizeTokens(cell: string, canon: Record<string, string> = GENRE_CANON): string[] {
  return cell
    .split(/[,/;]+/)
    .map((t) => t.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .map((t) => {
      const lower = t.toLowerCase();
      if (canon[lower]) return canon[lower];
      return lower.replace(/\b([a-z])/g, (c) => c.toUpperCase());
    });
}

const ROLE_RULES: [RegExp, string][] = [
  [/vocal/i, "Vocals"],
  [/lead guitar/i, "Lead guitar"],
  [/rhythm guitar|acoustic guitar|^guitarist$/i, "Rhythm / acoustic guitar"],
  [/bass/i, "Bass"],
  [/drum|percussion/i, "Drums & percussion"],
  [/key|synth/i, "Keys"],
  [/song ?writ/i, "Songwriting"],
  [/music prod/i, "Production"],
  [/violin/i, "Strings"],
  [/volunteer/i, "Volunteer"],
];

/** Map messy role text ("DRUMMER/PERCUSSIONIST", "Rhythm Guitarist") to standard categories. */
export function normalizeRoles(cell: string): string[] {
  const out = new Set<string>();
  for (const part of cell.split(/[,/;]+/)) {
    const p = part.trim();
    if (!p) continue;
    const hit = ROLE_RULES.find(([re]) => re.test(p));
    out.add(hit ? hit[1] : p);
  }
  return [...out];
}

export function countBy<T>(items: T[], pick: (item: T) => string | string[]): { key: string; count: number }[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const keys = pick(it);
    for (const k of Array.isArray(keys) ? keys : [keys]) map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

/** Share of rows (0–1) where the field is filled in. */
export function completeness(rows: Member[], key: keyof Member): number {
  if (rows.length === 0) return 0;
  const filled = rows.filter((r) => String(r[key]).trim() !== "").length;
  return filled / rows.length;
}

/** Same checks the sheet's data validation enforces. */
export function validateMember(r: Member, departments: readonly string[], roles: readonly string[]): string[] {
  const errors: string[] = [];
  if (!departments.includes(r.department)) errors.push("department");
  if (!roles.includes(r.role)) errors.push("role");
  if (!Number.isInteger(r.level) || r.level < 1 || r.level > 5) errors.push("level");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.birthdate) || Number.isNaN(Date.parse(r.birthdate))) errors.push("birthdate");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email)) errors.push("email");
  return errors;
}
