import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { useCFStore } from '../../../zustand/useCFStore';
import { ShortcutSettings } from '../../../types/types';
import { useShortcutSettings } from '../../../utils/hooks/useShortcutSettings';
import { toast } from 'sonner';
import { normalizeShortcut } from '../../../utils/helper';
import { DEFAULT_SHORTCUT_SETTINGS } from '../../../data/constants';
import ShortcutRow from './ShortcutRow';

interface ShortcutSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShortcutSettingsComponent: React.FC<ShortcutSettingsProps> = ({ isOpen, onClose }) => {
    const storeShortcutSettings = useCFStore<ShortcutSettings>(state => state.shortcutSettings);
    const setStoreShortcutSettings = useCFStore(state => state.setShortcutSettings);
    const [localShortcutSettings, setLocalShortcutSettings] = useState<ShortcutSettings>(storeShortcutSettings);
    const [recordingFor, setRecordingFor] = useState<'run' | 'submit' | 'reset' | 'format' | null>(null);
    const pressedKeysRef = useRef<Set<string>>(new Set());
    const { getShortcutSettings, saveShortcutSettings } = useShortcutSettings(localShortcutSettings, setStoreShortcutSettings);

    const rows: {
        id: "run" | "submit" | "reset" | "format";
        label: string;
        description: string;
    }[] = [
        {
            id: "run",
            label: "Run Code Shortcut",
            description: "Click to set a new shortcut for running code.",
        },
        {
            id: "submit",
            label: "Submit Code Shortcut",
            description: "Click to set a new shortcut for submitting code.",
        },
        {
            id: "reset",
            label: "Reset Code Shortcut",
            description: "Click to set a new shortcut for resetting code.",
        },
        {
            id: "format",
            label: "Format Code Shortcut",
            description: "Click to set a new shortcut for formatting code.",
        },
    ];

    useEffect(() => {
        if(isOpen) {
            setLocalShortcutSettings(getShortcutSettings());
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(!recordingFor) return;
            e.preventDefault();
            pressedKeysRef.current.add(e.key);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if(!recordingFor) return;
            e.preventDefault();
            updateShortcutDisplay();
            setRecordingFor(null);
            pressedKeysRef.current.clear();
        };

        if (recordingFor) {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [recordingFor]);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if(recordingFor) {
                const target = e.target as HTMLElement;
                if (!target.closest('.shortcut-input')) {
                    setRecordingFor(null);
                    pressedKeysRef.current.clear();
                }
            };
        };

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [recordingFor]);

    const updateShortcutDisplay = () => {
        if(!recordingFor) return;
        const keysArray = Array.from(pressedKeysRef.current);
        const shortcutString = keysArray.join(' + ');
        if(hasConflict(shortcutString)) {
            toast.error('This shortcut conflicts with another. Please choose a different combination.');
            return;
        }
        setLocalShortcutSettings({
        ...localShortcutSettings,
            [recordingFor]: shortcutString
        });
    };

    const handleSave = () => {
        setStoreShortcutSettings(localShortcutSettings);
        saveShortcutSettings();
        toast.success('Shortcuts saved successfully!');
        onClose();
    };

    const hasConflict = (current: string) => {
        return Object.entries(localShortcutSettings).some(([key, value]) => key !== recordingFor && value === current);
    };

    const handleReset = useCallback((id: keyof ShortcutSettings) => {
        setLocalShortcutSettings(prev => ({ ...prev, [id]: DEFAULT_SHORTCUT_SETTINGS[id] }));
        toast.success(`${id} shortcut reset`);
    }, [setLocalShortcutSettings]);

    const startRecording = useCallback((id: keyof ShortcutSettings) => {
        setRecordingFor(id);
    }, []);

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
                        className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
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
                            <h2 className="text-xl font-bold dark:text-white text-black flex items-center gap-2">
                                <Zap size={20} />
                                Shortcut Settings
                            </h2>
                            <motion.button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Close"
                                aria-label="Close"
                                whileHover={{ rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={18} className="text-gray-700 dark:text-gray-300" />
                            </motion.button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <div className="space-y-6">
                                {rows.map((row) => (
                                    <ShortcutRow
                                        key={row.id}
                                        id={row.id}
                                        label={row.label}
                                        value={
                                            recordingFor === row.id
                                            ? "Press keys..."
                                            : normalizeShortcut(localShortcutSettings[row.id])
                                        }
                                        isRecording={recordingFor === row.id}
                                        onStartRecording={startRecording}
                                        onReset={handleReset}
                                        description={row.description}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 dark:bg-[#222222] px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                            <motion.button
                                onClick={onClose}
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
                                Save
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShortcutSettingsComponent;
