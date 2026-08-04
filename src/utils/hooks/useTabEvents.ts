import { useCFStore } from "src/zustand/useCFStore";
import { getSlug } from "src/utils/helper";
import { getSavedCode } from "src/utils/storage/codeStorage";
import { saveCodeForSlug, saveTestCaseForSlug } from "src/utils/services/storageService";
import { loadCodeWithCursor, readTemplateWithCursor } from "src/utils/codeHandlers";
import { accessRestrictionMessage } from "src/data/constants";
import { useTestCases } from "./useTestCases";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const TAB_EVENT_TYPES = ["TAB_SWITCH", "TAB_UPDATED", "WINDOW_FOCUSED", "USER_RETURNED"];

export const useTabEvents = () => {
  const setCurrentUrl = useCFStore((state) => state.setCurrentUrl);
  const setCurrentSlug = useCFStore((state) => state.setCurrentSlug);
  const { loadTestCases } = useTestCases();

  /**
   * Runs synchronously start to finish. The background worker fires several of these
   * message types for a single tab switch, so any suspension point here lets a second
   * event read a half-updated slug and save the visible editor under the previous
   * problem, which is what made one problem's code show up under another.
   */
  const handleTabEvents = (
    message: any,
    _sender: any,
    sendResponse: (response: any) => void,
    editor: monaco.editor.IStandaloneCodeEditor | null
  ) => {
    try {
      if (!TAB_EVENT_TYPES.includes(message?.type)) {
        sendResponse({ status: "error", message: "Unhandled message type" });
        return false;
      }

      const newUrl = message.url;
      setCurrentUrl(newUrl);

      // Read through the store rather than a captured value: this listener is
      // re-registered on render, so a closed-over slug can be a render behind.
      const previousSlug = useCFStore.getState().currentSlug;
      if (previousSlug) {
        // Isolated from the switch below. If persisting the outgoing problem
        // throws, the handler must still advance to the new one: bailing out
        // leaves the panel showing the previous problem's code while the user
        // is looking at a different tab.
        try {
          saveCodeForSlug(previousSlug, editor);
          saveTestCaseForSlug(previousSlug, useCFStore.getState().testCases);
        } catch (error) {
          console.error("Failed to save before tab switch:", error);
        }
      }

      const newSlug = getSlug(newUrl);
      setCurrentSlug(newSlug);

      // Refocusing the window fires these events with the problem unchanged.
      // Reloading in that case would overwrite whatever the user has typed since
      // the last save with the older stored copy.
      if (newSlug !== previousSlug) {
        if (newSlug) {
          // Falls back to the template when there is no saved entry, and also when the
          // saved entry is empty, which is what a problem opened and never typed in leaves.
          const savedEntry = getSavedCode(newSlug);
          const { code, cursorOffset } = savedEntry?.code ? savedEntry : readTemplateWithCursor();
          loadCodeWithCursor(editor, code, cursorOffset);
          loadTestCases({ slug: newSlug });
        } else {
          loadCodeWithCursor(editor, accessRestrictionMessage);
        }
      }

      sendResponse({ status: "success", message: "Tab event handled successfully" });
    } catch (error) {
      sendResponse({ status: "error", message: "Error handling tab event" });
    }
    return false;
  };

  return { handleTabEvents };
};
