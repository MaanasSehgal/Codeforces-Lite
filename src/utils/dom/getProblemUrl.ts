export const getProblemUrl = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {
            const url = window.location.href;
            return url;
        }
    });
    return result.result || "Unknown";
};