import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCFStore } from "src/zustand/useCFStore";
import { formatCode, getSlug } from "src/utils/helper";
import { getSavedCode } from "src/utils/storage/codeStorage";
import { useCodePersistence } from "src/utils/hooks/useCodePersistence";
import TopBar from "./editor/TopBar";
import TestCases from "./testcases/TestCases";
import { ResizablePanel } from "src/components/global/ResizablePanel";
import { useCodeExecution } from "src/utils/hooks/useCodeExecution";
import { useCodeManagement } from "src/utils/hooks/useCodeManagement";
import { useTestCases } from "src/utils/hooks/useTestCases";
import { useTabEvents } from "src/utils/hooks/useTabEvents";
import { handleSubmission } from "src/utils/services/submissionService";
import { initializeStorage } from "src/utils/services/storageService";
import { loadCodeWithCursor, readTemplateWithCursor } from "src/utils/codeHandlers";
import { accessRestrictionMessage, shortcutAccessRestrictionMessage } from "src/data/constants";
import CodeEditor from "./editor/CodeEditor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { browserAPI } from "src/utils/browser/browserDetect";

interface MainProps {
  showOptions: boolean;
  setShowOptions: (show: boolean) => void;
  theme: string;
}

const Main: React.FC<MainProps> = ({ showOptions, setShowOptions, theme }) => {
  const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Zustand store hooks
  const {
    language,
    fontSize,
    currentSlug,
    // totalSize,
    setCurrentSlug,
    setCurrentUrl,
    setTotalSize,
    testCases,
    isRunning,
    isSubmitting,
    setIsSubmitting,
    isFocusMode,
    setIsFocusMode,
  } = useCFStore();

  // Custom hooks
  const { runCode } = useCodeExecution(monacoInstanceRef.current);
  const {
    handleResetCode,
    handleLanguageChange,
    handleFontSizeChange,
    handleRedirectToLatestSubmission,
  } = useCodeManagement(monacoInstanceRef);
  const { loadTestCases, setupTestCaseListener } = useTestCases();
  const { handleTabEvents } = useTabEvents();
  const [isFormating, setIsFormating] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  useCodePersistence(monacoInstanceRef, isEditorReady);
  const shortcutSettings = useCFStore((state: any) => state.shortcutSettings);
  const pressedKeysRef = useRef<Set<string>>(new Set());
  // Reset on keyup so holding the shortcut down for a no-op action doesn't spam a toast.
  const hasShownAccessRestrictionToastRef = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      setIsSubmitting(false);
    }, 3000);
  }, [isSubmitting, currentSlug]);

  useEffect(() => {
    const cleanup = setupTestCaseListener();
    const size = initializeStorage();
    setTotalSize(size);
    return cleanup;
  }, []);

  // Runs off the editor's own ready signal rather than a timer. The old version
  // replaced the editor contents ~600ms after mount, which discarded anything typed
  // in the meantime.
  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    const loadCodeForActiveTab = async () => {
      const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
      if (!tab?.url) {
        return;
      }

      const newSlug = getSlug(tab.url);
      setCurrentSlug(newSlug);
      setCurrentUrl(tab.url);

      if (!newSlug) {
        loadCodeWithCursor(monacoInstanceRef.current, accessRestrictionMessage);
        return;
      }

      const savedEntry = getSavedCode(newSlug);
      const { code, cursorOffset } = savedEntry?.code ? savedEntry : readTemplateWithCursor();
      loadCodeWithCursor(monacoInstanceRef.current, code, cursorOffset);
      loadTestCases({ slug: newSlug });
    };

    loadCodeForActiveTab();
  }, [isEditorReady]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showOptions) {
        return;
      }
      pressedKeysRef.current.add(event.key);
      handleShortcutActions(event);
    };

    const handleKeyUp = () => {
      pressedKeysRef.current.clear();
      hasShownAccessRestrictionToastRef.current = false;
    };

    const handleShortcutActions = (event: KeyboardEvent) => {
      const { run, submit, reset, format } = shortcutSettings;
      const keysArray = Array.from(pressedKeysRef.current);
      const shortcutString = keysArray.join(" + ");
      const isConfiguredShortcut = [run, submit, reset, format].includes(shortcutString);
      if (!isConfiguredShortcut) {
        return;
      }

      // currentSlug is null whenever the active tab isn't a Codeforces problem page, which is
      // also when the editor above is read-only. Shortcuts can't run against it, so tell the
      // user why instead of silently doing nothing.
      if (!currentSlug) {
        event.stopPropagation();
        event.preventDefault();
        if (hasShownAccessRestrictionToastRef.current) {
          return;
        }
        hasShownAccessRestrictionToastRef.current = true;
        toast.error(shortcutAccessRestrictionMessage);
        return;
      }

      switch (shortcutString) {
        case run:
          if (isRunning) {
            return;
          }
          event.stopPropagation();
          event.preventDefault();
          runCode();
          break;
        case submit:
          if (isSubmitting) {
            return;
          }
          event.stopPropagation();
          event.preventDefault();
          handleSubmission(monacoInstanceRef.current, setIsSubmitting, language, testCases);
          break;
        case reset:
          event.stopPropagation();
          event.preventDefault();
          handleResetCode();
          break;
        case format:
          if (isFormating) {
            return;
          }
          event.stopPropagation();
          event.preventDefault();
          handleFormatCode();
          break;
      }
    };

    const domNode = monacoInstanceRef?.current?.getDomNode() ?? null;
    if (!domNode) {
      return;
    }

    domNode.addEventListener("keydown", handleKeyDown, { capture: true });
    domNode.addEventListener("keyup", handleKeyUp, { capture: true });

    return () => {
      domNode.removeEventListener("keydown", handleKeyDown, { capture: true });
      domNode.removeEventListener("keyup", handleKeyUp, { capture: true });
    };
  }, [showOptions, currentSlug, runCode, handleSubmission]);

  useEffect(() => {
    if (monacoInstanceRef.current) {
      if (!currentSlug) {
        monacoInstanceRef.current.updateOptions({
          readOnly: true,
        });
      } else {
        monacoInstanceRef.current.updateOptions({
          readOnly: false,
        });
      }
    }
  }, [currentSlug, monacoInstanceRef.current]);

  useEffect(() => {
    const listener = (message: any, sender: any, sendResponse: (response: any) => void) => {
      if (message?.type === "EXIT_FOCUS_MODE") {
        setIsFocusMode(false);
      }
      return handleTabEvents(message, sender, sendResponse, monacoInstanceRef.current);
    };
    browserAPI.runtime.onMessage.addListener(listener);
    return () => {
      browserAPI.runtime.onMessage.removeListener(listener);
    };
  }, [currentSlug, testCases, setIsFocusMode]);

  const isFocusIframe =
    typeof window !== "undefined" && window.location.search.includes("focus=true");

  useEffect(() => {
    if (isFocusIframe) {
      setIsFocusMode(true);
    }
  }, [isFocusIframe, setIsFocusMode]);

  const isFocusMountRef = useRef(true);

  useEffect(() => {
    if (isFocusIframe) return; // The embedded iframe must NEVER auto-send focus messages on store updates
    if (isFocusMountRef.current) {
      isFocusMountRef.current = false;
      return;
    }
    browserAPI.runtime.sendMessage({ type: "TOGGLE_FOCUS_MODE", isFocusMode }, (response: any) => {
      if (browserAPI.runtime.lastError) {
        // ignore
      }
    });
  }, [isFocusMode, isFocusIframe]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFocusIframe) {
          browserAPI.runtime.sendMessage({ type: "TOGGLE_FOCUS_MODE", isFocusMode: false });
        } else if (isFocusMode) {
          setIsFocusMode(false);
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isFocusMode, isFocusIframe, setIsFocusMode]);

  const handleFormatCode = () => {
    formatCode(monacoInstanceRef, language, setIsFormating);
  };

  return (
    <div className="flex flex-col w-full justify-start items-center h-full dark:bg-[#111111]">
      <TopBar
        theme={theme as "light" | "dark"}
        handleClick={() =>
          handleSubmission(monacoInstanceRef.current, setIsSubmitting, language, testCases)
        }
        setShowOptions={setShowOptions}
        language={language}
        handleLanguageChange={handleLanguageChange}
        fontSize={fontSize}
        handleFontSizeChange={handleFontSizeChange}
        handleResetCode={handleResetCode}
        handleRedirectToLatestSubmission={handleRedirectToLatestSubmission}
        currentSlug={currentSlug}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        runCode={runCode}
        testCases={testCases.testCases}
        isFormating={isFormating}
        handleFormatCode={handleFormatCode}
      />

      <div className="w-full h-[calc(100vh-88px)]">
        <ResizablePanel
          top={
            <CodeEditor
              monacoInstanceRef={monacoInstanceRef}
              language={language}
              fontSize={fontSize}
              onEditorReady={() => setIsEditorReady(true)}
            />
          }
          bottom={<TestCases />}
          initialHeight={70}
        />
      </div>
    </div>
  );
};
export default Main;
