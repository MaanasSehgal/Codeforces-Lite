import { getProblemName } from "../dom/getProblemName";
import { getProblemUrl } from "../dom/getProblemUrl";
import { getUserId } from "../dom/getUserId";
import { usageDataHelper } from "../usageDataHelper";

export const handleSubmission = async (editor: React.RefObject<any>, setIsSubmitting: (isSubmitting: boolean) => void, language: string, testCases: any) => {
    const problemUrl = await getProblemUrl();
    const problemName = await getProblemName();
    const userId = await getUserId();
    
    if(userId.includes("Unknown")) {
        alert("Please login to submit code");
        return;
    }
    
    setIsSubmitting(true);
    const editorValue = editor.current?.view?.state?.doc?.toString();
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const result = await new Promise((resolve) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            func: function(codeToSubmit) {
                return new Promise((resolveInner) => {
                    const blob = new Blob([codeToSubmit], { type: 'text/plain' });
                    const file = new File([blob], 'solution.txt', { type: 'text/plain' });
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    
                    const fileInput = document.querySelector('input[type="file"][name="sourceFile"]') as HTMLInputElement;
                    if (!fileInput) {
                        resolveInner(false);
                        alert("File input not found!");
                        return;
                    }

                    fileInput.files = dataTransfer.files;
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                    setTimeout(() => {
                        const submitButton = document.querySelector('#sidebarSubmitButton') as HTMLInputElement;
                        if (submitButton) {
                            submitButton.click();
                            resolveInner(true);
                        } else {
                            resolveInner(false);
                            alert("Submit button not found!");
                        }
                    }, 200);
                });
            },
            args: [editorValue]
        }, (results) => {
            resolve(results[0].result);
        });
    });

    if (result) {
        await usageDataHelper(language, testCases, userId).handleUsageData(editorValue, problemUrl, "SUBMIT", problemName);
    } else {
    }

    setIsSubmitting(false);
};
