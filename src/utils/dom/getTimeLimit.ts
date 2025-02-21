export const getTimeLimit = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {
            const timeLimitElement = document.querySelector('.time-limit');
            if (!timeLimitElement) return 0;
            const timeText = timeLimitElement.textContent || '';
            const matches = timeText.match(/(\d+)/);
            return matches ? parseInt(matches[0]) : 0;
        }
    });

    return result.result || 0;
};
