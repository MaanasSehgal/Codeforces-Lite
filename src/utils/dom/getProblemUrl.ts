import { browserAPI } from "../browser/browserDetect";

export const getProblemUrl = async () => {
    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    const [result] = await browserAPI.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {
            const url = window.location.href;
            return url;
        }
    });
    return result.result || "Unknown";
};