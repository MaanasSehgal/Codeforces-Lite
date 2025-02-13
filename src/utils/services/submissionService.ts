import { usageDataHelper } from "../usageDataHelper";

export const handleSubmission = async (editor: React.RefObject<any>, setIsSubmitting: (isSubmitting: boolean) => void, language: string, currentSlug: string, testCases: any) => {
    const slug = currentSlug || "Unknown";
    const code = editor.current?.view?.state.doc.toString();

    setIsSubmitting(true);
    const editorValue = editor.current?.view?.state?.doc?.toString();
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id! },
            func: (code) => {
                const blob = new Blob([code], { type: 'text/plain' });
                const file = new File([blob], 'solution.txt', { type: 'text/plain' });

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                const fileInput = document.querySelector('input[type="file"][name="sourceFile"]') as HTMLInputElement;

                if (fileInput) {
                    fileInput.files = dataTransfer.files;
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);

                    setTimeout(() => {
                        const submitButton = document.querySelector('#sidebarSubmitButton') as HTMLInputElement;
                        if (submitButton) {
                            submitButton.click();
                        } else {
                            alert('Submit button not found!');
                            setIsSubmitting(false);
                        }
                    }, 200);
                } else {
                    alert('File input not found!');
                    setIsSubmitting(false);
                }
            },
            args: [editorValue],
        },
        () => {
            if (chrome.runtime.lastError) {
                setIsSubmitting(false);
            }
        }
    );

    try {
        await usageDataHelper(language, testCases).handleUsageData(code, slug, "SUBMISSION");
    } catch (error) {
    }
};
