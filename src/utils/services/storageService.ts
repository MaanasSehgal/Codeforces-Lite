import { toast } from "sonner";
import type { TestCaseArray } from "src/types/types";
import {
  getTotalCodeSize,
  saveCode,
  saveTestCases,
  SaveOutcome,
} from "src/utils/storage/codeStorage";
import { SINGLE_CODE_LIMIT_BYTES } from "src/data/constants";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

/**
 * Slugs whose save failure has already been reported, so the autosave debounce does not
 * raise a toast every keystroke. A slug leaves the set once it saves again, so freeing
 * space or shrinking the file re-arms the warning.
 */
const slugsWithReportedFailure = new Set<string>();

const toMegabytes = (byteCount: number): string => (byteCount / (1024 * 1024)).toFixed(1);

/**
 * A refused save is indistinguishable from the disappearing-code bug this whole path
 * exists to prevent, so the user is told once per problem which of the two limits
 * they hit and what to do about it.
 */
const reportOutcome = (slug: string, outcome: SaveOutcome) => {
  if (outcome.status === "saved") {
    slugsWithReportedFailure.delete(slug);
    return;
  }

  if (slugsWithReportedFailure.has(slug)) {
    return;
  }
  slugsWithReportedFailure.add(slug);

  if (outcome.status === "storage-full") {
    toast.error(
      "Browser storage is full, so this code could not be saved. Delete saved codes from Settings to free up space.",
      { duration: 8000 }
    );
    return;
  }

  toast.error(
    `Code is too large to save (${toMegabytes(outcome.size)}MB, limit ${toMegabytes(SINGLE_CODE_LIMIT_BYTES)}MB). It will not be restored later.`,
    { duration: 8000 }
  );
};

/**
 * Reads the editor and persists it against `slug`. Synchronous on purpose: the save
 * paths run from tab events and from page teardown, and an `await` in either creates
 * a window where a second event interleaves and writes one problem's code under
 * another problem's slug.
 */
export const saveCodeForSlug = (
  slug: string | null,
  editor: monaco.editor.IStandaloneCodeEditor | null
): SaveOutcome => {
  if (!slug || !editor) {
    return { status: "saved" };
  }

  const code = editor.getValue();
  const position = editor.getPosition();
  const cursorOffset = position ? editor.getModel()?.getOffsetAt(position) : undefined;

  const outcome = saveCode(slug, code, cursorOffset);
  reportOutcome(slug, outcome);
  return outcome;
};

export const saveTestCaseForSlug = (slug: string | null, testCasesToSave: TestCaseArray) => {
  if (!slug || !testCasesToSave?.testCases?.length) {
    return;
  }
  saveTestCases(slug, testCasesToSave);
};

export const initializeStorage = (): number => getTotalCodeSize();
