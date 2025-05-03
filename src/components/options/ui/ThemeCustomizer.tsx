import React, { useState, useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
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
    const sliderClass = "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

    const [settings, setSettings] = useState<ThemeSettings>(getThemeSettings());

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
        toast.success('Theme settings reset to defaults');
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

    useEffect(() => {
        if (isOpen && theme === 'dark') {
            applyThemeSettings(settings);
        }
    }, [isOpen, settings, theme]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                        }}
                    >
                        <div className="sticky top-0 bg-white dark:bg-[#1a1a1a] z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold dark:text-white">Advanced Theme Settings</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleReset}
                                    title="Reset to defaults"
                                    aria-label="Reset to defaults"
                                >
                                    <RotateCcw size={18} className="text-gray-700 dark:text-gray-300" />
                                </button>
                                <motion.button
                                    onClick={onClose}
                                    title="Close"
                                    aria-label="Close"
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={18} className="text-gray-700 dark:text-gray-300" />
                                </motion.button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>
                                        Brightness: {settings.brightness}%
                                    </label>
                                    <input
                                        type="range"
                                        name="brightness"
                                        min="50"
                                        max="150"
                                        value={settings.brightness}
                                        onChange={handleChange}
                                        className={sliderClass}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>Darker</span>
                                        <span>Brighter</span>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Contrast: {settings.contrast}%
                                    </label>
                                    <input
                                        type="range"
                                        name="contrast"
                                        min="50"
                                        max="150"
                                        value={settings.contrast}
                                        onChange={handleChange}
                                        className={sliderClass}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>Less</span>
                                        <span>More</span>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Sepia: {settings.sepia}%
                                    </label>
                                    <input
                                        type="range"
                                        name="sepia"
                                        min="0"
                                        max="100"
                                        value={settings.sepia}
                                        onChange={handleChange}
                                        className={sliderClass}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>None</span>
                                        <span>Full</span>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Grayscale: {settings.grayscale}%
                                    </label>
                                    <input
                                        type="range"
                                        name="grayscale"
                                        min="0"
                                        max="100"
                                        value={settings.grayscale}
                                        onChange={handleChange}
                                        className={sliderClass}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>Colorful</span>
                                        <span>Monochrome</span>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Invert: {settings.invert}%
                                    </label>
                                    <input
                                        type="range"
                                        name="invert"
                                        min="0"
                                        max="100"
                                        value={settings.invert}
                                        onChange={handleChange}
                                        className={sliderClass}
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>Normal</span>
                                        <span>Inverted</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-800 pt-5">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Theme Presets</h3>
                                <ThemePresets onSelectPreset={handlePresetSelect} currentSettings={settings} />
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 dark:bg-[#222222] px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                            <motion.button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Save Changes
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ThemeCustomizer;