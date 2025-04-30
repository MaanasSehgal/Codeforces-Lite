import { browserAPI } from "./browser/browserDetect";

export interface ThemeSettings {
    brightness: number;
    contrast: number;
    sepia: number;
    grayscale: number;
    invert: number;
}

export const defaultThemeSettings: ThemeSettings = {
    brightness: 100,
    contrast: 100,
    sepia: 0,
    grayscale: 0,
    invert: 0,
};

export const getThemeSettings = (): ThemeSettings => {
    const savedSettings = localStorage.getItem('themeCustomSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultThemeSettings;
};

export const saveThemeSettings = (settings: ThemeSettings): void => {
    localStorage.setItem('themeCustomSettings', JSON.stringify(settings));
    browserAPI.storage.local.set({ themeCustomSettings: settings });
};

export const resetThemeSettings = (): ThemeSettings => {
    localStorage.setItem('themeCustomSettings', JSON.stringify(defaultThemeSettings));
    browserAPI.storage.local.set({ themeCustomSettings: defaultThemeSettings });
    return defaultThemeSettings;
};

export const applyThemeSettings = (settings: ThemeSettings): void => {
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            browserAPI.tabs.sendMessage(tabs[0].id, {
                type: 'APPLY_CUSTOM_THEME',
                settings
            }, (response) => {
                if (browserAPI.runtime.lastError) {
                    console.log('Could not establish connection:', browserAPI.runtime.lastError.message);
                }
            });
        }
    });
};
