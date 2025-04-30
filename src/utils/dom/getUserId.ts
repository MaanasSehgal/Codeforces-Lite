import { browserAPI } from "../browser/browserDetect";

export const getUserId = async () => {
    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    const [result] = await browserAPI.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {
            const profileLink = document.querySelector('a[href^="/profile/"]');
            if (!profileLink) return '';

            const userId = profileLink.getAttribute('href')?.split('/profile/')[1];
            return userId;
        }
    });

    return result.result || "Unknown";
};
