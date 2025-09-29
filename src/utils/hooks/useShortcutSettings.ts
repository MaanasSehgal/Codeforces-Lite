import { useEffect } from 'react';
import { ShortcutSettings } from '../../types/types';
import { DEFAULT_SHORTCUT_SETTINGS } from '../../data/constants';

export const useShortcutSettings = (settings: ShortcutSettings, setSettings: (settings: ShortcutSettings) => void) => {
    const getShortcutSettings = (): ShortcutSettings => {
        const storedSettings = localStorage.getItem('shortcutSettings');
        if (storedSettings) {
            return JSON.parse(storedSettings);
        }
        return DEFAULT_SHORTCUT_SETTINGS;
    };

    const saveShortcutSettings = () => {
        localStorage.setItem('shortcutSettings', JSON.stringify(settings));
    };

    useEffect(() => {
        setSettings(getShortcutSettings());
    }, []);

    return { getShortcutSettings, saveShortcutSettings };
};
