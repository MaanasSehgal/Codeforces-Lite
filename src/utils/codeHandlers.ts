import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { TEMPLATE_CURSOR_MARKER } from "src/data/constants";

/**
 * The options panel tells users to write "$0" where they want the caret in their
 * template, so in that one string the marker is authored intent and has to be parsed.
 * Saved problem code is different: it carries its caret as a separate offset, which is
 * what keeps a solution containing a literal "$0" from being mangled every time it loads.
 */
export const readTemplateWithCursor = (): { code: string; cursorOffset?: number } => {
  const template = localStorage.getItem("template") || "";
  const markerOffset = template.indexOf(TEMPLATE_CURSOR_MARKER);
  if (markerOffset === -1) {
    return { code: template };
  }

  // Every marker is removed, but only the first one places the caret. Removing the
  // later ones does not shift the first, so the offset stays valid.
  return {
    code: template.replaceAll(TEMPLATE_CURSOR_MARKER, ""),
    cursorOffset: markerOffset,
  };
};

/**
 * Replaces the editor contents and restores the caret to `cursorOffset`.
 * The caret is passed separately rather than marked inside `code`, so a solution that
 * legitimately contains "$0" is no longer mangled on load.
 */
export const loadCodeWithCursor = (
  editor: monaco.editor.IStandaloneCodeEditor | null,
  code: string,
  cursorOffset?: number
) => {
  if (!editor) {
    return;
  }

  editor.setValue(code);

  const model = editor.getModel();
  if (cursorOffset === undefined || !model) {
    return;
  }

  const clampedOffset = Math.min(Math.max(cursorOffset, 0), code.length);
  const position = model.getPositionAt(clampedOffset);

  editor.setPosition(position);
  editor.focus();
  editor.revealPositionInCenter(position);
};
