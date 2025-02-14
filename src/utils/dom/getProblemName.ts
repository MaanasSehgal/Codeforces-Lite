export const getProblemName = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {
            const titleElement = document.querySelector('.problem-statement .title');
            if (!titleElement) return '';
            return titleElement.textContent?.trim();
        }
    });

    return result.result || "Unknown";
};
