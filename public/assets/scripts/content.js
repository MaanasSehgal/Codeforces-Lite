// Functions in respective folders
// changeLoginPageUI, changeProblemSetPageUI, removeLoginPageUI, removeProblemSetPageUI-> changeUIFunctions
// injectDarkModeCSS, sortToggleImgInvert, removeSortToggleImgInvert -> darkModeFunctions
const isFirefox = typeof browser !== 'undefined';
const browserAPI = isFirefox ? browser : chrome;

browserAPI.storage.local.get(["changeUI", "theme", "themeCustomSettings", "defaultThemeSettings"]).then((result) => {
    if (result.changeUI === "true") {
        document.addEventListener("DOMContentLoaded", () => {
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
            if (document.documentElement.classList.contains('dark') ||
                document.querySelector('html[data-theme="dark"]')) {
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
    if (message.type === 'APPLY_CUSTOM_THEME') {
        applyCustomThemeSettings(message.settings);
        sendResponse({ success: true });
    }
    return true;
});
