import { useEffect } from "react";
import { useCFStore } from "src/zustand/useCFStore";
import { saveCodeForSlug } from "src/utils/services/storageService";
import { AUTOSAVE_DEBOUNCE_MS } from "src/data/constants";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

/**
 * Keeps the editor's contents on disk without depending on a tab event happening to
 * fire. Saves on a debounce while typing, and flushes on every teardown signal the
 * side panel gets, because closing the panel destroys the document with no warning.
 */
export const useCodePersistence = (
  monacoInstanceRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>,
  isEditorReady: boolean
) => {
  useEffect(() => {
    const editor = monacoInstanceRef.current;
    if (!isEditorReady || !editor) {
      return;
    }

    let debounceTimer: number | null = null;
    let lastSavedCode: string | null = null;
    // This effect outlives any single problem, so the redundant-write check has to
    // know which problem the remembered code belongs to. Without the slug, opening a
    // problem whose stored code matches the previous one's skips its save entirely.
    let lastSavedSlug: string | null = null;

    const flush = () => {
      const currentEditor = monacoInstanceRef.current;
      const slug = useCFStore.getState().currentSlug;
      if (!currentEditor || !slug) {
        return;
      }

      try {
        const code = currentEditor.getValue();
        if (code === lastSavedCode && slug === lastSavedSlug) {
          return;
        }
        const outcome = saveCodeForSlug(slug, currentEditor);
        if (outcome.status === "saved") {
          lastSavedCode = code;
          lastSavedSlug = slug;
        }
      } catch {
        // The editor can already be disposed when this runs during teardown.
        // A failed flush must never take the page down with it.
      }
    };

    const contentSubscription = editor.onDidChangeModelContent(() => {
      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(() => {
        debounceTimer = null;
        flush();
      }, AUTOSAVE_DEBOUNCE_MS);
    });

    const flushIfHidden = () => {
      if (document.visibilityState === "hidden") {
        flush();
      }
    };

    window.addEventListener("pagehide", flush);
    window.addEventListener("blur", flush);
    document.addEventListener("visibilitychange", flushIfHidden);

    return () => {
      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }
      contentSubscription.dispose();
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("blur", flush);
      document.removeEventListener("visibilitychange", flushIfHidden);
      flush();
    };
  }, [isEditorReady]);
};
