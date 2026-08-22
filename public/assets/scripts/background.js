// isFirefox and browserAPI come from the entry script: serviceWorker.js on Chrome,
// browserDetect.js on Firefox.
if (!isFirefox && browserAPI.sidePanel) {
  browserAPI.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
}

// `invert` is required: applyCustomThemeSettings interpolates every field into one CSS
// filter, and a missing one yields `invert(undefined%)`, which is invalid and makes the
// browser drop the whole declaration, silently disabling brightness/contrast/sepia too.
const DEFAULT_THEME_SETTINGS = {
  brightness: 100,
  contrast: 100,
  sepia: 0,
  grayscale: 0,
  invert: 0,
};

// A fresh install starts with an empty storage.local, and the content script only acts
// on keys it finds there. Until the side panel was opened at least once nothing wrote
// them, so the theme stayed off. These values mirror the panel's own fallbacks in
// App.tsx (theme) and options/page.tsx (changeUI, theme settings).
const DEFAULT_SETTINGS = {
  theme: "dark",
  changeUI: "true",
  defaultThemeSettings: DEFAULT_THEME_SETTINGS,
  themeCustomSettings: DEFAULT_THEME_SETTINGS,
};

// Same set of files as content_scripts in both manifests, but deliberately in the
// reverse order: content.js reads storage and calls into the other three from an async
// callback, so it must be evaluated last for those definitions to exist by the time the
// read resolves. Nothing here touches browserAPI at top level, so loading them ahead of
// content.js is safe.
const CONTENT_SCRIPT_FILES = [
  "assets/scripts/changeUIFunctions/loginPageChanges.js",
  "assets/scripts/changeUIFunctions/problemSetPageChanges.js",
  "assets/scripts/darkModeFunctions/darkMode.js",
  "assets/scripts/content.js",
];
const CONTENT_STYLE_FILES = ["assets/styles/inject-styles.css"];

/** Writes only the keys that are absent, so a user's chosen theme is never overwritten. */
const seedMissingSettings = async () => {
  const stored = await browserAPI.storage.local.get(Object.keys(DEFAULT_SETTINGS));
  const missingSettings = {};
  for (const [key, defaultValue] of Object.entries(DEFAULT_SETTINGS)) {
    if (stored[key] === undefined) {
      missingSettings[key] = defaultValue;
    }
  }

  if (Object.keys(missingSettings).length > 0) {
    await browserAPI.storage.local.set(missingSettings);
  }
};

/**
 * Content scripts are not injected into tabs that were already open when the extension
 * was installed, so those tabs stay unstyled until they are reloaded by hand.
 * Only runs on a first install, where no earlier copy of the script can already be
 * present in the page to collide with.
 */
const injectIntoOpenCodeforcesTabs = async () => {
  const tabs = await browserAPI.tabs.query({ url: "https://codeforces.com/*" });
  for (const tab of tabs) {
    if (!tab.id) {
      continue;
    }
    try {
      await browserAPI.scripting.insertCSS({
        target: { tabId: tab.id },
        files: CONTENT_STYLE_FILES,
      });
      await browserAPI.scripting.executeScript({
        target: { tabId: tab.id },
        files: CONTENT_SCRIPT_FILES,
      });
    } catch (error) {
      // Tabs can be discarded, or navigating away mid-injection; neither is worth failing over.
      console.log("Could not inject into tab", tab.id, error);
    }
  }
};

browserAPI.runtime.onInstalled.addListener(async (details) => {
  await seedMissingSettings();
  if (details.reason === "install") {
    await injectIntoOpenCodeforcesTabs();
  }
});

// Helper function to send messages with browser compatibility
const sendTabMessage = (message) => {
  browserAPI.runtime.sendMessage(message, (response) => {
    if (browserAPI.runtime.lastError) {
      console.log("No receiver for the message or error occurred:", browserAPI.runtime.lastError);
    }
  });
};

// 1. Handle tab activation
browserAPI.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await browserAPI.tabs.get(activeInfo.tabId);
    if (tab.url) {
      sendTabMessage({ type: "TAB_SWITCH", url: tab.url });
    }
  } catch (error) {
    console.error("Error getting tab info or sending message:", error);
  }
});

// 2. Handle tab URL updates
browserAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id === tabId) {
        sendTabMessage({ type: "TAB_UPDATED", url: changeInfo.url });
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
          sendTabMessage({ type: "WINDOW_FOCUSED", url: tab.url });
        }
      }
    });
  }
});

// 4. Handle when the extension loses focus
browserAPI.idle.onStateChanged.addListener((newState) => {
  if (newState === "active") {
    // When the user returns to the browser
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        sendTabMessage({ type: "USER_RETURNED", url: tabs[0].url });
      }
    });
  }
});

// Focus Mode Relay ----
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message?.type === "TOGGLE_FOCUS_MODE" ||
    message?.type === "EXIT_FOCUS_MODE" ||
    message?.type === "ENTER_FOCUS_MODE"
  ) {
    const isFocusMode =
      message.type === "EXIT_FOCUS_MODE"
        ? false
        : message.type === "ENTER_FOCUS_MODE"
        ? true
        : !!message.isFocusMode;

    const sendFocusToTab = (tab) => {
      if (!tab || !tab.id) return;

      if (tab.windowId && browserAPI.windows) {
        browserAPI.windows
          .update(tab.windowId, {
            state: isFocusMode ? "fullscreen" : "normal",
          })
          .catch((err) => console.log("Window update error:", err));
      }

      browserAPI.tabs.sendMessage(
        tab.id,
        { type: "TOGGLE_FOCUS_MODE", isFocusMode },
        (response) => {
          if (browserAPI.runtime.lastError) {
            console.log(
              "Focus relay error, injecting content script dynamically:",
              browserAPI.runtime.lastError.message
            );
            if (browserAPI.scripting) {
              browserAPI.scripting
                .insertCSS({
                  target: { tabId: tab.id },
                  files: ["assets/styles/inject-styles.css"],
                })
                .catch(() => {});
              browserAPI.scripting
                .executeScript({
                  target: { tabId: tab.id },
                  files: CONTENT_SCRIPT_FILES,
                })
                .then(() => {
                  setTimeout(() => {
                    browserAPI.tabs
                      .sendMessage(tab.id, { type: "TOGGLE_FOCUS_MODE", isFocusMode })
                      .catch(() => {});
                  }, 150);
                })
                .catch((err) => console.log("ExecuteScript fallback error:", err));
            }
          }
        }
      );
    };

    if (sender.tab?.id) {
      sendFocusToTab(sender.tab);
    } else {
      // 1. Query active tab in last focused browser window
      browserAPI.tabs.query({ active: true, lastFocusedWindow: true }, (lastTabs) => {
        if (lastTabs && lastTabs[0]) {
          sendFocusToTab(lastTabs[0]);
        } else {
          // 2. Query active tab in current window
          browserAPI.tabs.query({ active: true, currentWindow: true }, (curTabs) => {
            if (curTabs && curTabs[0]) {
              sendFocusToTab(curTabs[0]);
            } else {
              // 3. Fallback: match apex and subdomain URLs for Codeforces
              browserAPI.tabs.query(
                { url: ["*://codeforces.com/*", "*://*.codeforces.com/*"] },
                (cfTabs) => {
                  if (cfTabs && cfTabs.length > 0) {
                    const activeCF = cfTabs.find((t) => t.active) || cfTabs[0];
                    sendFocusToTab(activeCF);
                  }
                }
              );
            }
          });
        }
      });
    }

    // Broadcast unified focus state update to runtime views (sidepanel/iframe)
    browserAPI.runtime
      .sendMessage({ type: "FOCUS_MODE_STATE_CHANGED", isFocusMode })
      .catch(() => {});
    if (sendResponse) sendResponse({ success: true });
    return true;
  }
});
