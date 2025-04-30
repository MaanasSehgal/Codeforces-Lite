import { browserAPI } from "../browser/browserDetect";

export const getProblemName = async () => {
    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    const [result] = await browserAPI.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {
            const titleElement = document.querySelector('.problem-statement .title');
            if (!titleElement) return '';
            return titleElement.textContent?.trim();
        }
    });

    return result.result || "Unknown";
};
