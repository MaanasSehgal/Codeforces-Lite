import type { CodeEntry, TestCaseArray } from "src/types/types";
import {
  MAX_PROBLEM_IO_SIZE,
  SINGLE_CODE_LIMIT_BYTES,
  STORAGE_LIMIT_BYTES,
  TEMPLATE_CURSOR_MARKER,
} from "src/data/constants";

const CODE_MAP_KEY = "codeMap";
const LEGACY_SLUG_QUEUE_KEY = "slugQueue";
const TEST_CASE_MAP_KEY = "testCaseMap";

/**
 * Least-recently-used order is derived from `updatedAt` on each entry rather than
 * from a parallel queue. A queue and a map have to be mutated in lockstep, and any
 * divergence between them silently evicts live code.
 */
type StoredCodeEntry = CodeEntry & { updatedAt: number };

type StoredTestCaseEntry = { testCases: TestCaseArray; updatedAt: number };

export type SaveOutcome =
  { status: "saved" } | { status: "too-large"; size: number } | { status: "storage-full" };

/**
 * Absent and unparseable are different situations: an absent key is a new user, an
 * unparseable one is a user whose saved work is still on disk behind a bad blob.
 * Collapsing them lets a single corrupt read overwrite everything on the next save.
 */
type ReadResult<T> = { status: "ok"; value: T } | { status: "absent" } | { status: "corrupt" };

/**
 * Several saves can land inside the same millisecond, which would make `Date.now()`
 * alone produce ties and an unstable eviction order. Keeping the stamp strictly
 * increasing means least-recently-used is always well defined.
 */
let lastIssuedStamp = 0;
const nextUpdateStamp = (): number => {
  lastIssuedStamp = Math.max(Date.now(), lastIssuedStamp + 1);
  return lastIssuedStamp;
};

const CORRUPT_BACKUP_SUFFIX = ".corrupt";

/**
 * Moves an unreadable blob aside instead of leaving it to be overwritten, so a user
 * whose storage got truncated (a crash mid-write, a quota failure) still has their
 * code recoverable by hand. Only the first corruption is kept; a later one would
 * otherwise overwrite the good backup with the same bad data.
 */
const backUpCorruptValue = (key: string, raw: string) => {
  const backupKey = `${key}${CORRUPT_BACKUP_SUFFIX}`;
  try {
    if (localStorage.getItem(backupKey) === null) {
      localStorage.setItem(backupKey, raw);
    }
  } catch {
    // Backing up is best effort; storage may be full, which is often why we are here.
  }
};

const readJson = <T>(key: string): ReadResult<T> => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return { status: "absent" };
  }
  try {
    return { status: "ok", value: JSON.parse(raw) as T };
  } catch {
    backUpCorruptValue(key, raw);
    return { status: "corrupt" };
  }
};

/**
 * The old save path spliced a literal "$0" into the buffer at the caret and the old loader
 * stripped it again on every load, so a legacy entry's marker is bookkeeping rather than
 * the user's text. Migration has to complete that round trip: leaving the marker in place
 * would splice two visible characters into the code the first time it loads after upgrading,
 * and drop the caret the marker was recording. Stripping mirrors the old loader exactly,
 * including taking the caret from the first marker only.
 */
const migrateLegacyEntry = (
  slug: string,
  entry: CodeEntry,
  legacyOrder: string[]
): StoredCodeEntry => {
  const markerOffset = entry.code.indexOf(TEMPLATE_CURSOR_MARKER);
  const code = entry.code.replaceAll(TEMPLATE_CURSOR_MARKER, "");
  const positionInLegacyOrder = legacyOrder.indexOf(slug);
  return {
    code,
    cursorOffset: markerOffset === -1 ? undefined : markerOffset,
    size: code.length,
    // Preserve the old queue's ordering so the first eviction after upgrading
    // still drops the genuinely oldest problem.
    updatedAt: positionInLegacyOrder === -1 ? 0 : positionInLegacyOrder + 1,
  };
};

/**
 * `isReadable` is false only when the key exists but could not be parsed. The legacy
 * key is retained in that case: its ordering is unrecoverable, and deleting it would
 * throw away the one copy a user could still repair by hand.
 */
const readLegacySlugOrder = (): { order: string[]; isReadable: boolean } => {
  const stored = readJson<string[] | { items?: string[] }>(LEGACY_SLUG_QUEUE_KEY);
  if (stored.status === "corrupt") {
    return { order: [], isReadable: false };
  }
  if (stored.status === "absent") {
    return { order: [], isReadable: true };
  }

  const { value } = stored;
  if (Array.isArray(value)) {
    return { order: value, isReadable: true };
  }
  if (value && Array.isArray(value.items)) {
    return { order: value.items, isReadable: true };
  }
  return { order: [], isReadable: false };
};

export const getCodeMap = (): Map<string, StoredCodeEntry> => {
  const stored = readJson<[string, CodeEntry & { updatedAt?: number }][]>(CODE_MAP_KEY);
  if (stored.status !== "ok" || !Array.isArray(stored.value)) {
    return new Map();
  }

  const { order: legacyOrder } = readLegacySlugOrder();
  const codeMap = new Map<string, StoredCodeEntry>();
  for (const [slug, entry] of stored.value) {
    if (!slug || !entry || typeof entry.code !== "string") {
      continue;
    }
    if (typeof entry.updatedAt === "number") {
      codeMap.set(slug, entry as StoredCodeEntry);
    } else {
      codeMap.set(slug, migrateLegacyEntry(slug, entry, legacyOrder));
    }
  }
  return codeMap;
};

/** Drops the single least-recently-used entry. Returns false when there is nothing left to drop. */
const evictOldestEntry = (
  codeMap: Map<string, StoredCodeEntry>,
  protectedSlug: string
): boolean => {
  let oldestSlug: string | null = null;
  let oldestStamp = Infinity;
  codeMap.forEach((entry, slug) => {
    if (slug !== protectedSlug && entry.updatedAt < oldestStamp) {
      oldestStamp = entry.updatedAt;
      oldestSlug = slug;
    }
  });

  if (oldestSlug === null) {
    return false;
  }
  codeMap.delete(oldestSlug);
  return true;
};

/**
 * The budget in constants is a guess at the real quota, which varies by browser and
 * profile, so `setItem` can still throw after the proactive eviction believed it had
 * room. Evicting and retrying makes the true limit self-correcting rather than turning
 * a full disk into a lost save.
 */
const writeCodeMap = (codeMap: Map<string, StoredCodeEntry>, protectedSlug: string): boolean => {
  while (true) {
    try {
      localStorage.setItem(CODE_MAP_KEY, JSON.stringify(Array.from(codeMap.entries())));
      const { isReadable } = readLegacySlugOrder();
      if (isReadable) {
        localStorage.removeItem(LEGACY_SLUG_QUEUE_KEY);
      }
      return true;
    } catch {
      if (!evictOldestEntry(codeMap, protectedSlug)) {
        return false;
      }
    }
  }
};

export const getTotalCodeSize = (codeMap: Map<string, StoredCodeEntry> = getCodeMap()): number => {
  let totalSize = 0;
  codeMap.forEach((entry) => {
    totalSize += entry.size;
  });
  return totalSize;
};

/**
 * Drops least-recently-used entries until the map fits the budget. `protectedSlug` is
 * never dropped: evicting the problem being saved right now is what "my code vanished"
 * looks like from the outside.
 */
const evictUntilWithinBudget = (codeMap: Map<string, StoredCodeEntry>, protectedSlug: string) => {
  const evictionOrder = Array.from(codeMap.entries())
    .filter(([slug]) => slug !== protectedSlug)
    .sort(([, left], [, right]) => left.updatedAt - right.updatedAt);

  let index = 0;
  while (getTotalCodeSize(codeMap) > STORAGE_LIMIT_BYTES && index < evictionOrder.length) {
    codeMap.delete(evictionOrder[index][0]);
    index++;
  }
};

/**
 * Persists code verbatim. Returns `too-large` instead of throwing or alerting so the
 * caller decides how to surface it; a save path that can interrupt the user is a save
 * path that gets skipped.
 */
export const saveCode = (slug: string, code: string, cursorOffset?: number): SaveOutcome => {
  if (!slug) {
    return { status: "saved" };
  }

  const size = code.length;
  if (size > SINGLE_CODE_LIMIT_BYTES) {
    return { status: "too-large", size };
  }

  const codeMap = getCodeMap();
  codeMap.set(slug, { code, size, cursorOffset, updatedAt: nextUpdateStamp() });
  evictUntilWithinBudget(codeMap, slug);

  if (!writeCodeMap(codeMap, slug)) {
    return { status: "storage-full" };
  }
  return { status: "saved" };
};

export const getSavedCode = (slug: string): StoredCodeEntry | null => {
  return getCodeMap().get(slug) ?? null;
};

export const getSavedCodeCount = (): number => getCodeMap().size;

export const clearSavedCode = () => {
  localStorage.removeItem(CODE_MAP_KEY);
  localStorage.removeItem(LEGACY_SLUG_QUEUE_KEY);
  // Otherwise "delete all codes" leaves a set-aside copy behind, still occupying the
  // quota the user was trying to reclaim.
  localStorage.removeItem(`${CODE_MAP_KEY}${CORRUPT_BACKUP_SUFFIX}`);
};

export const getTestCaseMap = (): Map<string, StoredTestCaseEntry> => {
  const stored = readJson<[string, StoredTestCaseEntry][]>(TEST_CASE_MAP_KEY);
  if (stored.status !== "ok" || !Array.isArray(stored.value)) {
    return new Map();
  }

  const testCaseMap = new Map<string, StoredTestCaseEntry>();
  for (const [slug, entry] of stored.value) {
    if (slug && entry && entry.testCases) {
      testCaseMap.set(slug, entry);
    }
  }
  return testCaseMap;
};

export const getSavedTestCases = (slug: string): TestCaseArray | null => {
  return getTestCaseMap().get(slug)?.testCases ?? null;
};

export const saveTestCases = (slug: string, testCases: TestCaseArray) => {
  if (!slug) {
    return;
  }

  const testCaseMap = getTestCaseMap();
  testCaseMap.set(slug, { testCases, updatedAt: nextUpdateStamp() });

  const evictionOrder = Array.from(testCaseMap.entries())
    .filter(([storedSlug]) => storedSlug !== slug)
    .sort(([, left], [, right]) => left.updatedAt - right.updatedAt);

  let index = 0;
  while (testCaseMap.size > MAX_PROBLEM_IO_SIZE && index < evictionOrder.length) {
    testCaseMap.delete(evictionOrder[index][0]);
    index++;
  }

  // Test cases are recoverable by re-opening the problem, so a full disk here is
  // swallowed rather than allowed to escape into a tab switch and abort it.
  try {
    localStorage.setItem(TEST_CASE_MAP_KEY, JSON.stringify(Array.from(testCaseMap.entries())));
  } catch {
    // Nothing useful to do: the code map is the copy worth keeping.
  }
};
