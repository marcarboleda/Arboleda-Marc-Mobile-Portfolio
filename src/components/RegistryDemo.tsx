import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  COLUMNS,
  DEPARTMENTS,
  MEMBER_ROLES,
  MEMBERS,
  SEARCH_CATEGORIES,
  type Member,
  type SearchKey,
} from "../data/registry";
import {
  completeness,
  countBy,
  formatSheetDate,
  normalizeRoles,
  normalizeTokens,
  searchMembers,
  validateMember,
} from "../lib/registryLogic";
import { color, font, useLayout, type InteractionState } from "../theme";
import { Body, Chip, Mono } from "./ui";

type Tab = "members" | "search" | "insights";
const TABS: { id: Tab; label: string }[] = [
  { id: "members", label: "Members 26-27" },
  { id: "search", label: "Search" },
  { id: "insights", label: "Insights" },
];

const ROW_H = 34;
const HEAD_H = 40;
const LETTER_H = 22;
const ROWNUM_W = 40;
const PAGE = 10;
const LETTERS = "ABCDEFGHIJK";

const SEARCH_FORMULA =
  '=IF(B2="","",LET(colName,B1, col,XMATCH(colName,\'Members 26-27\'!A2:K2), data,\'Members 26-27\'!A3:K9886, searchCol,INDEX(data,,col), IFERROR(FILTER(data, IF(colName="BIRTHDATE", MONTH(\'Members 26-27\'!E3:E9886)=VALUE(B2), ISNUMBER(SEARCH(TRIM(B2),searchCol)))), {"No Search Found","","","","","","","","","",""})))';

function displayValue(m: Member, key: keyof Member, cleaned: boolean): { text: string; changed: boolean } {
  const raw = key === "birthdate" ? formatSheetDate(m.birthdate) : String(m[key]);
  if (!cleaned) return { text: raw, changed: false };
  let text = raw;
  if (key === "genre") text = normalizeTokens(m.genre).join(", ");
  if (key === "musicRoles") text = normalizeRoles(m.musicRoles).join(", ");
  if (key === "instrument" && raw.trim() === "") text = "None";
  return { text, changed: text !== raw };
}

export function RegistryDemo() {
  const [tab, setTab] = useState<Tab>("members");
  const formula = tab === "members" ? `=COUNTA(A3:A${MEMBERS.length + 2})` : tab === "search" ? SEARCH_FORMULA : "Insights are computed live from 'Members 26-27' for this demo";

  return (
    <View style={styles.window}>
      <View style={styles.formulaBar}>
        <Text style={styles.fx}>fx</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          <Text style={styles.formula} selectable>
            {formula}
          </Text>
        </ScrollView>
      </View>

      <View style={{ minHeight: 420 }}>
        {tab === "members" ? <MembersView /> : tab === "search" ? <SearchView /> : <InsightsView />}
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setTab(t.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t.id }}
            style={(s) => [styles.tab, tab === t.id && styles.tabOn, (s as InteractionState).hovered && tab !== t.id && { backgroundColor: color.surfaceHi }]}
          >
            <Text style={[styles.tabText, tab === t.id && { color: color.accent }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/* ---------------- Members ---------------- */

function MembersView() {
  const [cleaned, setCleaned] = useState(false);
  const [page, setPage] = useState(0);
  const pages = Math.ceil(MEMBERS.length / PAGE);
  const rows = MEMBERS.slice(page * PAGE, page * PAGE + PAGE);

  return (
    <View>
      <View style={styles.toolbar}>
        <View style={styles.totalCell}>
          <Text style={styles.totalLabel}>TOTAL MEMBERS</Text>
          <Text style={styles.totalValue}>{MEMBERS.length}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Chip label="Raw entries" active={!cleaned} onPress={() => setCleaned(false)} />
          <Chip label="Cleaned view" active={cleaned} onPress={() => setCleaned(true)} />
        </View>
      </View>
      {cleaned ? (
        <Text style={styles.note}>
          <Text style={{ color: color.accent }}>■</Text> Highlighted cells were standardized: genres split and re-cased, role text mapped to fixed categories, and blank instrument cells marked &quot;None&quot;.
        </Text>
      ) : null}
      <Grid rows={rows} startRow={3 + page * PAGE} cleaned={cleaned} />
      <View style={styles.pager}>
        <Mono dim>
          Rows {page * PAGE + 1}–{Math.min(MEMBERS.length, (page + 1) * PAGE)} of {MEMBERS.length}
        </Mono>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <PagerBtn label="← Prev" disabled={page === 0} onPress={() => setPage(page - 1)} />
          <PagerBtn label="Next →" disabled={page >= pages - 1} onPress={() => setPage(page + 1)} />
        </View>
      </View>
    </View>
  );
}

function PagerBtn({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={(s) => [styles.pagerBtn, disabled && { opacity: 0.35 }, (s as InteractionState).hovered && !disabled && { borderColor: color.text }]}
    >
      <Text style={styles.pagerText}>{label}</Text>
    </Pressable>
  );
}

/* ---------------- Search ---------------- */

const EXAMPLES: { key: SearchKey; term: string }[] = [
  { key: "musicRoles", term: "guitar" },
  { key: "birthdate", term: "3" },
  { key: "department", term: "CITE" },
  { key: "genre", term: "opm" },
];

function SearchView() {
  const [key, setKey] = useState<SearchKey>("musicRoles");
  const [term, setTerm] = useState("guitar");
  const results = useMemo(() => searchMembers(MEMBERS, key, term), [key, term]);
  const label = SEARCH_CATEGORIES.find((c) => c.key === key)?.label ?? "";

  return (
    <View>
      <View style={styles.searchPanel}>
        <View style={styles.searchRow}>
          <Text style={styles.searchLabel}>Search Category:</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 }}>
            {SEARCH_CATEGORIES.map((c) => (
              <Chip
                key={c.key}
                label={c.label}
                active={key === c.key}
                onPress={() => {
                  setKey(c.key);
                  if (c.key === "birthdate" && !/^\d{1,2}$/.test(term.trim())) setTerm("");
                }}
              />
            ))}
          </View>
        </View>
        <View style={styles.searchRow}>
          <Text style={styles.searchLabel}>Search Term:</Text>
          <TextInput
            value={term}
            onChangeText={setTerm}
            placeholder={key === "birthdate" ? "Month number, 1–12" : `Search ${label.toLowerCase()}…`}
            placeholderTextColor={color.faint}
            keyboardType={key === "birthdate" ? "number-pad" : "default"}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            accessibilityLabel="Search term"
          />
        </View>
        <View style={[styles.searchRow, { alignItems: "center" }]}>
          <Text style={styles.searchLabel}>Try:</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, flex: 1 }}>
            {EXAMPLES.map((e) => (
              <Pressable
                key={e.key + e.term}
                onPress={() => {
                  setKey(e.key);
                  setTerm(e.term);
                }}
                accessibilityRole="button"
              >
                {(s) => (
                  <Text style={[styles.example, (s as InteractionState).hovered && { color: color.accent }]}>
                    {SEARCH_CATEGORIES.find((c) => c.key === e.key)?.label} = &quot;{e.term}&quot;
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      <Mono dim style={{ marginHorizontal: 14, marginBottom: 8 }}>
        {term.trim() === "" ? "Enter a term to search" : `${results.length} match${results.length === 1 ? "" : "es"}`}
      </Mono>
      <Grid rows={results} startRow={5} cleaned={false} emptyText={term.trim() === "" ? "" : "No Search Found"} maxRows={8} />
      {results.length > 8 ? (
        <Mono dim style={{ margin: 14 }}>
          + {results.length - 8} more rows
        </Mono>
      ) : null}
    </View>
  );
}

/* ---------------- Insights ---------------- */

function InsightsView() {
  const { bp } = useLayout();
  const cols = bp === "desktop" ? 3 : bp === "tablet" ? 2 : 1;
  const invalid = MEMBERS.filter((m) => validateMember(m, DEPARTMENTS, MEMBER_ROLES).length > 0).length;

  const cards = [
    { title: "Members by department", data: countBy(MEMBERS, (m) => m.department) },
    { title: "Member role", data: countBy(MEMBERS, (m) => m.role) },
    { title: "Year level", data: countBy(MEMBERS, (m) => `Year ${m.level}`).sort((a, b) => a.key.localeCompare(b.key)) },
    { title: "Music roles (cleaned)", data: countBy(MEMBERS, (m) => normalizeRoles(m.musicRoles)).slice(0, 7) },
    { title: "Genres (cleaned)", data: countBy(MEMBERS, (m) => normalizeTokens(m.genre)).slice(0, 7) },
    {
      title: "Field completeness",
      data: (["instrument", "musicRoles", "genre", "email", "birthdate"] as (keyof Member)[]).map((k) => ({
        key: COLUMNS.find((c) => c.key === k)!.label,
        count: Math.round(completeness(MEMBERS, k) * 100),
      })),
      percent: true,
    },
  ];

  return (
    <View style={{ padding: 14 }}>
      <View style={styles.kpis}>
        <Kpi label="Total members" value={String(MEMBERS.length)} />
        <Kpi label="Pass validation" value={`${MEMBERS.length - invalid}/${MEMBERS.length}`} />
        <Kpi label="Own an instrument" value={`${Math.round(completeness(MEMBERS, "instrument") * 100)}%`} />
        <Kpi label="Performers" value={String(MEMBERS.filter((m) => m.role !== "Volunteer").length)} />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -7 }}>
        {cards.map((c) => (
          <View key={c.title} style={{ width: `${100 / cols}%`, padding: 7 }}>
            <View style={styles.card}>
              <Mono style={{ marginBottom: 14 }}>{c.title}</Mono>
              <BarList data={c.data} percent={c.percent} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Mono dim>{label}</Mono>
    </View>
  );
}

function BarList({ data, percent }: { data: { key: string; count: number }[]; percent?: boolean }) {
  const max = percent ? 100 : Math.max(...data.map((d) => d.count), 1);
  return (
    <View style={{ gap: 10 }}>
      {data.map((d) => (
        <View key={d.key}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={styles.barLabel} numberOfLines={1}>
              {d.key}
            </Text>
            <Text style={styles.barValue}>{percent ? `${d.count}%` : d.count}</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${(d.count / max) * 100}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

/* ---------------- Grid (frozen columns, like the sheet's freeze panes) ---------------- */

function Grid({
  rows,
  startRow,
  cleaned,
  emptyText,
  maxRows,
}: {
  rows: Member[];
  startRow: number;
  cleaned: boolean;
  emptyText?: string;
  maxRows?: number;
}) {
  const { isPhone } = useLayout();
  const frozenKeys: (keyof Member)[] = isPhone ? ["fullName"] : ["department", "level", "fullName"];
  const frozen = COLUMNS.filter((c) => frozenKeys.includes(c.key));
  const rest = COLUMNS.filter((c) => !frozenKeys.includes(c.key));
  const shown = maxRows ? rows.slice(0, maxRows) : rows;
  const letter = (k: keyof Member) => LETTERS[COLUMNS.findIndex((c) => c.key === k)];
  const nameWidth = (c: (typeof COLUMNS)[number]) => (isPhone && c.key === "fullName" ? 168 : c.width);

  const renderPart = (cols: typeof COLUMNS, withRowNum: boolean) => (
    <View>
      <View style={{ flexDirection: "row", height: LETTER_H }}>
        {withRowNum ? <View style={[styles.letter, { width: ROWNUM_W }]} /> : null}
        {cols.map((c) => (
          <View key={c.key} style={[styles.letter, { width: nameWidth(c) }]}>
            <Text style={styles.letterText}>{letter(c.key)}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", height: HEAD_H }}>
        {withRowNum ? (
          <View style={[styles.rowNum, { height: HEAD_H }]}>
            <Text style={styles.rowNumText}>{startRow - 1}</Text>
          </View>
        ) : null}
        {cols.map((c) => (
          <View key={c.key} style={[styles.head, { width: nameWidth(c) }]}>
            <Text style={styles.headText} numberOfLines={1}>
              {c.label}
            </Text>
          </View>
        ))}
      </View>
      {shown.length === 0 && emptyText !== undefined ? (
        <View style={{ flexDirection: "row", height: ROW_H }}>
          {withRowNum ? (
            <View style={styles.rowNum}>
              <Text style={styles.rowNumText}>{startRow}</Text>
            </View>
          ) : null}
          {cols.map((c, i) => (
            <View key={c.key} style={[styles.cell, { width: nameWidth(c) }]}>
              <Text style={[styles.cellText, { color: color.warn }]} numberOfLines={1}>
                {withRowNum && i === 0 ? emptyText : ""}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      {shown.map((m, ri) => (
        <View key={m.email} style={{ flexDirection: "row", height: ROW_H, backgroundColor: ri % 2 === 1 ? "rgba(255,255,255,0.025)" : "transparent" }}>
          {withRowNum ? (
            <View style={styles.rowNum}>
              <Text style={styles.rowNumText}>{startRow + ri}</Text>
            </View>
          ) : null}
          {cols.map((c) => {
            const v = displayValue(m, c.key, cleaned);
            return (
              <View key={c.key} style={[styles.cell, { width: nameWidth(c) }, v.changed && styles.cellChanged]}>
                <Text
                  style={[styles.cellText, c.key === "level" && { textAlign: "right" }, c.key === "facebook" && { color: "#8AB4F8" }]}
                  numberOfLines={1}
                >
                  {v.text}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.grid}>
      <View style={styles.frozen}>{renderPart(frozen, true)}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator style={{ flex: 1 }}>
        {renderPart(rest, false)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  window: { borderWidth: StyleSheet.hairlineWidth, borderColor: color.lineHi, backgroundColor: color.surface },
  formulaBar: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.lineHi,
    height: 38,
  },
  fx: {
    fontFamily: font.displayItalic,
    fontSize: 18,
    color: color.muted,
    width: 44,
    textAlign: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: color.lineHi,
    lineHeight: 38,
  },
  formula: { fontFamily: font.mono, fontSize: 12, color: color.text, paddingHorizontal: 12, lineHeight: 38 },
  toolbar: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, padding: 14 },
  totalCell: { flexDirection: "row", borderWidth: StyleSheet.hairlineWidth, borderColor: color.lineHi },
  totalLabel: {
    fontFamily: font.monoMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: color.bg,
    backgroundColor: color.accent,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  totalValue: { fontFamily: font.monoMedium, fontSize: 12, color: color.text, paddingHorizontal: 14, paddingVertical: 7 },
  note: { fontFamily: font.sans, fontSize: 13, lineHeight: 20, color: color.muted, marginHorizontal: 14, marginBottom: 12 },
  grid: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.lineHi },
  frozen: { borderRightWidth: 2, borderRightColor: color.lineHi, backgroundColor: color.surface, zIndex: 1 },
  letter: {
    height: LETTER_H,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.surfaceHi,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.line,
  },
  letterText: { fontFamily: font.mono, fontSize: 10, color: color.faint },
  head: {
    height: HEAD_H,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: color.accentDim,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.line,
  },
  headText: { fontFamily: font.monoMedium, fontSize: 11, letterSpacing: 0.6, color: color.text },
  rowNum: {
    width: ROWNUM_W,
    height: ROW_H,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.surfaceHi,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.line,
  },
  rowNumText: { fontFamily: font.mono, fontSize: 10, color: color.faint },
  cell: {
    height: ROW_H,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.line,
  },
  cellChanged: { backgroundColor: "rgba(163,201,111,0.14)" },
  cellText: { fontFamily: font.sans, fontSize: 13, color: color.text },
  pager: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, flexWrap: "wrap", gap: 10 },
  pagerBtn: { borderWidth: 1, borderColor: color.lineHi, paddingHorizontal: 12, paddingVertical: 7 },
  pagerText: { fontFamily: font.mono, fontSize: 12, color: color.text },
  tabs: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.lineHi, backgroundColor: color.bg, flexWrap: "wrap" },
  tab: { paddingHorizontal: 16, paddingVertical: 11, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: color.line },
  tabOn: { backgroundColor: color.surface, borderTopWidth: 2, borderTopColor: color.accent, marginTop: -1 },
  tabText: { fontFamily: font.mono, fontSize: 12, color: color.muted },
  searchPanel: { padding: 14, gap: 12 },
  searchRow: { flexDirection: "row", gap: 12, alignItems: "flex-start", flexWrap: "wrap" },
  searchLabel: { fontFamily: font.monoMedium, fontSize: 12, color: color.text, width: 132, paddingTop: 9 },
  input: {
    flex: 1,
    minWidth: 200,
    borderWidth: 1,
    borderColor: color.lineHi,
    backgroundColor: color.bg,
    color: color.text,
    fontFamily: font.mono,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  example: { fontFamily: font.mono, fontSize: 12, color: color.muted, textDecorationLine: "underline", textDecorationColor: color.lineHi },
  kpis: { flexDirection: "row", flexWrap: "wrap", borderWidth: StyleSheet.hairlineWidth, borderColor: color.line, marginBottom: 14 },
  kpi: { flexGrow: 1, flexBasis: 140, padding: 16, gap: 4, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: color.line },
  kpiValue: { fontFamily: font.display, fontSize: 40, color: color.text, lineHeight: 44 },
  card: { borderWidth: StyleSheet.hairlineWidth, borderColor: color.line, padding: 16, backgroundColor: color.bg, minHeight: 100 },
  barLabel: { fontFamily: font.sans, fontSize: 13, color: color.text, flex: 1, marginRight: 8 },
  barValue: { fontFamily: font.mono, fontSize: 12, color: color.muted },
  barTrack: { height: 6, backgroundColor: color.surfaceHi },
  barFill: { height: 6, backgroundColor: color.accent },
});

export function RegistryNotes() {
  const { bp } = useLayout();
  const items = [
    { k: "Validation", v: "Dropdowns limit department and role to allowed values. Custom formulas reject a year level that isn't a number and a birthdate that isn't a real date." },
    { k: "Search", v: "One dynamic formula. XMATCH finds the chosen column, FILTER returns the matching rows, and birthdates match on the month number." },
    { k: "Privacy", v: "The real registry is shared only with officers. Every name, email and link in this demo is fictional." },
  ];
  return (
    <View style={{ flexDirection: bp === "phone" ? "column" : "row", gap: bp === "phone" ? 20 : 32, marginBottom: 32 }}>
      {items.map((i) => (
        <View key={i.k} style={{ flex: 1 }}>
          <Mono style={{ color: color.accent, marginBottom: 8 }}>{i.k}</Mono>
          <Body style={{ fontSize: 15, lineHeight: 24 }}>{i.v}</Body>
        </View>
      ))}
    </View>
  );
}
