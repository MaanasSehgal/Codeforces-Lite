// Functions in respective folders
// changeLoginPageUI, changeProblemSetPageUI, removeLoginPageUI, removeProblemSetPageUI-> changeUIFunctions
// injectDarkModeCSS, sortToggleImgInvert, removeSortToggleImgInvert -> darkModeFunctions
// Chrome 148+ also defines `browser`, so its presence no longer identifies Firefox.
// The extension URL scheme does: moz-extension:// only ever comes from Firefox.

// Guard: skip all content-script work on non-Codeforces pages.
// The manifest matches *://*.codeforces.com/* but this protects against
// programmatic injection or future match changes.
const isCodeforcesSite = window.location.hostname.includes("codeforces.com");

const browserAPI = isCodeforcesSite ? (globalThis.browser ?? globalThis.chrome) : undefined;
const isFirefox = isCodeforcesSite
  ? browserAPI.runtime.getURL("/").startsWith("moz-extension://")
  : false;

if (isCodeforcesSite) {

// The manifest runs this at document_start, but the background worker also injects it
// into tabs that were already open at install time. DOMContentLoaded has long since
// fired in those, so waiting for it would silently skip the UI changes.
const whenDomReady = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
    return;
  }
  callback();
};

browserAPI.storage.local
  .get(["changeUI", "theme", "themeCustomSettings", "defaultThemeSettings"])
  .then((result) => {
    if (result.changeUI === "true") {
      whenDomReady(() => {
        changeLoginPageUI();
        changeProblemSetPageUI();
      });
    }

    if (result.theme === "dark") {
      injectDarkModeCSS();
      sortToggleImgInvert();

      if (result.themeCustomSettings) {
        applyCustomThemeSettings(result.themeCustomSettings);
      } else if (result.defaultThemeSettings) {
        applyCustomThemeSettings(result.defaultThemeSettings);
      }
    }
  });

browserAPI.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    if (changes.theme) {
      if (changes.theme.newValue === "dark") {
        injectDarkModeCSS();
        sortToggleImgInvert();

        browserAPI.storage.local.get(["themeCustomSettings", "defaultThemeSettings"], (result) => {
          if (result.themeCustomSettings) {
            applyCustomThemeSettings(result.themeCustomSettings);
          } else if (result.defaultThemeSettings) {
            applyCustomThemeSettings(result.defaultThemeSettings);
          }
        });
      } else {
        if (styleElement) {
          styleElement.remove();
        }
        if (customStyleElement) {
          customStyleElement.remove();
        }
        removeSortToggleImgInvert();
      }
    } else if (changes.themeCustomSettings) {
      if (
        document.documentElement.classList.contains("dark") ||
        document.querySelector('html[data-theme="dark"]')
      ) {
        applyCustomThemeSettings(changes.themeCustomSettings.newValue);
      }
    } else if (changes.changeUI) {
      if (changes.changeUI.newValue === "true") {
        changeLoginPageUI();
        changeProblemSetPageUI();
      } else {
        removeChangeLoginPageUI();
        removeChangeProblemSetPageUI();
      }
    }
  }
});

browserAPI.runtime.onMessage.addListener((message, sendResponse) => {
  if (message.type === "APPLY_CUSTOM_THEME") {
    applyCustomThemeSettings(message.settings);
    sendResponse({ success: true });
  }
  return true;
});

} // end isCodeforcesSite guard
