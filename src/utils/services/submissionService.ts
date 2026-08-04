import { toast } from "sonner";
import { editorNotLoadedMessage, isProduction } from "src/data/constants";
import { getProblemName } from "src/utils/dom/getProblemName";
import { getProblemUrl } from "src/utils/dom/getProblemUrl";
import { getUserId } from "src/utils/dom/getUserId";
import { usageDataHelper } from "src/utils/usageDataHelper";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { browserAPI } from "src/utils/browser/browserDetect";

// Reported back by the injected function, which runs in the Codeforces page where sonner
// does not exist, so the panel raises the toast for whatever the page found missing.
type SubmissionOutcome =
  "submitted" | "fileInputMissing" | "submitButtonMissing" | "injectionFailed";

const submissionFailureMessages: Record<Exclude<SubmissionOutcome, "submitted">, string> = {
  fileInputMissing: "Couldn't find the Codeforces file upload field on this page",
  submitButtonMissing: "Couldn't find the Codeforces submit button on this page",
  injectionFailed: "Couldn't reach the Codeforces tab to submit. Reload the problem page.",
};

export const handleSubmission = async (
  editor: monaco.editor.IStandaloneCodeEditor | null,
  setIsSubmitting: (isSubmitting: boolean) => void,
  language: string,
  testCases: any
) => {
  if (!editor) {
    toast(editorNotLoadedMessage);
    return;
  }

  const problemUrl = await getProblemUrl();
  const problemName = await getProblemName();
  problemName;
  problemUrl;
  const userId = await getUserId();

  if (userId.includes("Unknown")) {
    toast.error("Please login to Codeforces to submit code");
    return;
  }

  setIsSubmitting(true);
  const editorValue = editor.getValue();
  let [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });

  const submissionOutcome = await new Promise<SubmissionOutcome>((resolve) => {
    browserAPI.scripting.executeScript(
      {
        target: { tabId: tab.id! },
        func: function (codeToSubmit) {
          return new Promise<SubmissionOutcome>((resolveInner) => {
            const blob = new Blob([codeToSubmit], { type: "text/plain" });
            const file = new File([blob], "solution.txt", { type: "text/plain" });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            const fileInput = document.querySelector(
              'input[type="file"][name="sourceFile"]'
            ) as HTMLInputElement | null;
            if (!fileInput) {
              resolveInner("fileInputMissing");
              return;
            }

            fileInput.files = dataTransfer.files;
            fileInput.dispatchEvent(new Event("change", { bubbles: true }));

            setTimeout(() => {
              const submitButton = document.querySelector(
                "#sidebarSubmitButton"
              ) as HTMLInputElement | null;
              if (!submitButton) {
                resolveInner("submitButtonMissing");
                return;
              }
              submitButton.click();
              resolveInner("submitted");
            }, 200);
          });
        },
        args: [editorValue],
      },
      // An uninjectable tab leaves the results array empty, and reading through it would
      // throw here and leave the promise pending, which locks the submit button forever.
      (injectionResults) => {
        const reportedOutcome = injectionResults?.[0]?.result as SubmissionOutcome | undefined;
        resolve(reportedOutcome ?? "injectionFailed");
      }
    );
  });

  if (submissionOutcome !== "submitted") {
    toast.error(submissionFailureMessages[submissionOutcome]);
    setIsSubmitting(false);
    return;
  }

  if (isProduction) {
    await usageDataHelper(language, testCases, userId).handleUsageData(
      editorValue,
      problemUrl,
      "SUBMIT",
      problemName
    );
  }

  setIsSubmitting(false);
};
