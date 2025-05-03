import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Settings, Palette, Eye } from 'lucide-react';
import { useCFStore } from '../../../zustand/useCFStore';
import { EditorSettingsTypes } from '../../../types/types';
import { useEditorSettings } from '../../../utils/hooks/useEditorSettings';
import CodeEditor from '../../main/editor/CodeEditor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { PREVIEW_CODE } from '../../../data/constants';
import { formatCode } from '../../../utils/helper';

interface EditorSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditorSettings: React.FC<EditorSettingsProps> = ({ isOpen, onClose }) => {
    const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const editorThemeList = useCFStore(state => state.editorThemeList);
    const editorSettings = useCFStore<EditorSettingsTypes>(state => state.editorSettings);
    const setEditorSettings = useCFStore(state => state.setEditorSettings);
    const { getEditorSettings, handleToggle, saveEditorSettings } = useEditorSettings(editorSettings, setEditorSettings);
    const { language, fontSize } = useCFStore();

    useEffect(() => {
        if (isOpen) {
            setEditorSettings(getEditorSettings());
        }
    }, [isOpen]);

    useEffect(() => {
        saveEditorSettings();
    }, [editorSettings]);

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
                        className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                        }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-[#1a1a1a] z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold dark:text-white text-black flex items-center gap-2">
                                <Code size={20} />
                                Editor Settings
                            </h2>
                            <motion.button
                                onClick={() => onClose()}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Close"
                                aria-label="Close"
                                whileHover={{ rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={18} className="text-gray-700 dark:text-gray-300" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-6">
                            <div className="space-y-8">
                                {/* Editor Appearance Section */}
                                <section className="pb-6 border-b border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Palette size={18} className="text-blue-500" />
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                            Editor Appearance
                                        </h3>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Eye size={16} className="text-gray-500" />
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Live Preview
                                                </h4>
                                            </div>
                                        </div>
                                        <div className='w-full h-44'>
                                            <CodeEditor
                                                monacoInstanceRef={monacoInstanceRef}
                                                language={language}
                                                fontSize={fontSize}
                                                templateCode={PREVIEW_CODE}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                                            Preview shows your selected current editor settings.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Indent Size
                                            </label>
                                            <select
                                                value={editorSettings.indentSize || 4}
                                                onChange={(e) => {
                                                    setEditorSettings({ ...editorSettings, indentSize: Number(e.target.value) })
                                                    formatCode(monacoInstanceRef, language);
                                                }}
                                                className="w-full cursor-pointer bg-gray-100 dark:bg-[#2a2a2a] px-3 py-2 font-medium text-gray-700 dark:text-zinc-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                aria-label="Select tab indent size"
                                            >
                                                <option value="2">2 spaces</option>
                                                <option value="4">4 spaces</option>
                                                <option value="6">6 spaces</option>
                                                <option value="8">8 spaces</option>
                                            </select>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Number of spaces for each indentation level
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Editor Theme
                                            </label>
                                            <select
                                                value={editorSettings.theme}
                                                onChange={(e) => {
                                                    setEditorSettings({ ...editorSettings, theme: e.target.value });
                                                }}
                                                className="w-full cursor-pointer bg-gray-100 dark:bg-[#2a2a2a] px-3 py-2 text-gray-700 dark:text-zinc-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                aria-label="Select editor theme"
                                            >
                                                <option value="default">Default</option>
                                                <option value="vs-dark">Dark</option>
                                                <option value="vs-light">Light</option>
                                                <option value="hc-black">High Contrast</option>
                                                {Object.keys(editorThemeList).map((theme, index) => (
                                                    <option key={index} value={theme}>{editorThemeList[theme]}</option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Color scheme for the code editor
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Editor Features Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Settings size={18} className="text-blue-500" />
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                            Editor Features
                                        </h3>
                                    </div>

                                    <div className="space-y-5">
                                        {/* Feature Toggle Item */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-gray-50 dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <label className="flex items-center cursor-pointer">
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={editorSettings.autoSuggestions}
                                                                onChange={() => handleToggle('autoSuggestions')}
                                                            />
                                                            <div className={`block w-11 h-6 rounded-full transition-colors ${editorSettings.autoSuggestions ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${editorSettings.autoSuggestions ? 'transform translate-x-5' : ''}`}></div>
                                                        </div>
                                                        <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Auto Suggestions</span>
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-14">
                                                    Show code suggestions and completions as you type
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-gray-50 dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <label className="flex items-center cursor-pointer">
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={editorSettings.minimap}
                                                                onChange={() => handleToggle('minimap')}
                                                            />
                                                            <div className={`block w-11 h-6 rounded-full transition-colors ${editorSettings.minimap ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${editorSettings.minimap ? 'transform translate-x-5' : ''}`}></div>
                                                        </div>
                                                        <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Minimap</span>
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-14">
                                                    Show a condensed preview of the code on the right side
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-gray-50 dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <label className="flex items-center cursor-pointer">
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={editorSettings.lineNumbers}
                                                                onChange={() => handleToggle('lineNumbers')}
                                                            />
                                                            <div className={`block w-11 h-6 rounded-full transition-colors ${editorSettings.lineNumbers ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${editorSettings.lineNumbers ? 'transform translate-x-5' : ''}`}></div>
                                                        </div>
                                                        <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Line Numbers</span>
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-14">
                                                    Display line numbers in the editor gutter
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-gray-50 dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <label className="flex items-center cursor-pointer">
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={editorSettings.lineWrapping}
                                                                onChange={() => handleToggle('lineWrapping')}
                                                            />
                                                            <div className={`block w-11 h-6 rounded-full transition-colors ${editorSettings.lineWrapping ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${editorSettings.lineWrapping ? 'transform translate-x-5' : ''}`}></div>
                                                        </div>
                                                        <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Line Wrapping</span>
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-14">
                                                    Wrap long lines of code instead of horizontal scrolling
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 dark:bg-[#222222] px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                            <motion.button
                                onClick={() => onClose()}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Close
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditorSettings;
