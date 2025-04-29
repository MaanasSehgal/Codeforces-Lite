import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import ThemePresets from './ThemePresets';
import {
    ThemeSettings,
    getThemeSettings,
    saveThemeSettings,
    resetThemeSettings,
    applyThemeSettings
} from '../../../utils/themeUtils';

interface ThemeCustomizerProps {
    isOpen: boolean;
    onClose: () => void;
    theme: string;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose, theme }) => {
    const [settings, setSettings] = useState<ThemeSettings>(getThemeSettings());

    useEffect(() => {
        if (isOpen && theme === 'dark') {
            applyThemeSettings(settings);
        }
    }, [isOpen, settings, theme]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: parseInt(value)
        }));
    };

    const handleSave = () => {
        saveThemeSettings(settings);
        applyThemeSettings(settings);
        toast.success('Theme settings saved');
        onClose();
    };

    const handleReset = () => {
        const defaultSettings = resetThemeSettings();
        setSettings(defaultSettings);
        applyThemeSettings(defaultSettings);
    };

    const handleCancel = () => {
        const savedSettings = localStorage.getItem('themeCustomSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(parsedSettings);
            saveThemeSettings(parsedSettings);
            applyThemeSettings(parsedSettings);
        }

        onClose();
    };

    const handlePresetSelect = (preset: { name: string; settings: ThemeSettings }) => {
        setSettings(preset.settings);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-[#222222] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-white">Advanced Theme Settings</h2>
                    <button
                        onClick={handleReset}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Reset to defaults"
                    >
                        <RotateCcw size={18} className="text-gray-700 dark:text-gray-300" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Brightness: {settings.brightness}%
                        </label>
                        <input
                            type="range"
                            name="brightness"
                            min="50"
                            max="150"
                            value={settings.brightness}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contrast: {settings.contrast}%
                        </label>
                        <input
                            type="range"
                            name="contrast"
                            min="50"
                            max="150"
                            value={settings.contrast}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Sepia: {settings.sepia}%
                        </label>
                        <input
                            type="range"
                            name="sepia"
                            min="0"
                            max="100"
                            value={settings.sepia}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Grayscale: {settings.grayscale}%
                        </label>
                        <input
                            type="range"
                            name="grayscale"
                            min="0"
                            max="100"
                            value={settings.grayscale}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Invert: {settings.invert}%
                        </label>
                        <input
                            type="range"
                            name="invert"
                            min="0"
                            max="100"
                            value={settings.invert}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>

                    <ThemePresets onSelectPreset={handlePresetSelect} currentSettings={settings} />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThemeCustomizer;
