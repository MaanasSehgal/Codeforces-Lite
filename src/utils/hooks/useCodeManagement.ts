import { toast } from "sonner";
import { useCFStore } from "src/zustand/useCFStore";
import { getValueFromLanguage } from "src/utils/helper";
import { loadCodeWithCursor, readTemplateWithCursor } from "src/utils/codeHandlers";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { browserAPI } from "src/utils/browser/browserDetect";

export const useCodeManagement = (
  monacoInstanceRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>
) => {
  const setLanguage = useCFStore((state) => state.setLanguage);
  const setFontSize = useCFStore((state) => state.setFontSize);
  const currentSlug = useCFStore((state) => state.currentSlug);

  const handleResetCode = () => {
    if (!currentSlug) {
      return;
    }
    const { code, cursorOffset } = readTemplateWithCursor();
    loadCodeWithCursor(monacoInstanceRef.current, code, cursorOffset);
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("preferredLanguage", selectedLanguage);
    const languageValue = getValueFromLanguage(selectedLanguage);

    let [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    browserAPI.scripting.executeScript(
      {
        target: { tabId: tab.id! },
        func: (languageValue) => {
          const languageSelect = document.querySelector(
            'select[name="programTypeId"]'
          ) as HTMLSelectElement;
          if (languageSelect) {
            languageSelect.value = languageValue;
            const event = new Event("change", { bubbles: true });
            languageSelect.dispatchEvent(event);
          }
        },
        args: [languageValue],
      },
      () => browserAPI.runtime.lastError
    );
    if (monaco) {
      monaco.editor.getEditors().forEach((editor) => {
        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, selectedLanguage);
        }
      });
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFontSize = parseInt(e.target.value, 10);
    setFontSize(selectedFontSize);
    localStorage.setItem("preferredFontSize", selectedFontSize.toString());
    if (monaco) {
      monaco.editor.getEditors().forEach((editor) => {
        editor.updateOptions({
          fontSize: selectedFontSize,
        });
      });
    }
  };

  const handleRedirectToLatestSubmission = async () => {
    if (!currentSlug) {
      return;
    }
    let [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });

    browserAPI.scripting.executeScript(
      {
        target: { tabId: tab.id! },
        func: () => {
          const submissionAnchor = document.querySelector(
            ".roundbox.sidebox .rtable tbody tr td a"
          ) as HTMLAnchorElement | null;
          if (!submissionAnchor) {
            return "noSubmissionFound";
          }
          window.location.href = submissionAnchor.href;
          return "redirected";
        },
      },
      (injectionResults) => {
        if (browserAPI.runtime.lastError) {
          console.error(browserAPI.runtime.lastError.message);
          return;
        }
        // The injected function runs in the Codeforces page and has no sonner, so it
        // reports the empty-list case back here for the toast.
        if (injectionResults?.[0]?.result === "noSubmissionFound") {
          toast.error("No submission found for this problem");
        }
      }
    );
  };

  return {
    handleResetCode,
    handleLanguageChange,
    handleFontSizeChange,
    handleRedirectToLatestSubmission,
  };
};
