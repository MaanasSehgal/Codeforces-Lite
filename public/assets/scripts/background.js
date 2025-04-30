if (typeof isFirefox === 'undefined') {
    let isFirefox = typeof browser !== 'undefined';
    let browserAPI = isFirefox ? browser : chrome;
}

if (!isFirefox && browserAPI.sidePanel) {
    browserAPI.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
}

// Helper function to send messages with browser compatibility
const sendTabMessage = (message) => {
    browserAPI.runtime.sendMessage(message, (response) => {
        if (browserAPI.runtime.lastError) {
            console.log('No receiver for the message or error occurred:', browserAPI.runtime.lastError);
        }
    });
}

// 1. Handle tab activation
browserAPI.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await browserAPI.tabs.get(activeInfo.tabId);
        if (tab.url) {
            sendTabMessage({ type: 'TAB_SWITCH', url: tab.url });
        }
    } catch (error) {
        console.error('Error getting tab info or sending message:', error);
    }
});

// 2. Handle tab URL updates
browserAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0 && tabs[0].id === tabId) {
                sendTabMessage({ type: 'TAB_UPDATED', url: changeInfo.url });
            }
        });
    }
});

// 3. Handle window focus changes
browserAPI.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== browserAPI.windows.WINDOW_ID_NONE) {
        // Window is focused
        browserAPI.windows.get(windowId, { populate: true }, (window) => {
            if (window && window.tabs) {
                const tab = window.tabs.find((t) => t.active);
                if (tab && tab.url) {
                    sendTabMessage({ type: 'WINDOW_FOCUSED', url: tab.url });
                }
            }
        });
    }
});

// 4. Handle when the extension loses focus
browserAPI.idle.onStateChanged.addListener((newState) => {
    if (newState === 'active') {
        // When the user returns to the browser
        browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                sendTabMessage({ type: 'USER_RETURNED', url: tabs[0].url });
            }
        });
    }
});
