import { create } from "zustand";
import { EditorSettingsTypes, TestCaseArray, ShortcutSettings } from "../types/types";
import themesJSON from '../../themes/themelist.json';
import { DEFAULT_EDITOR_SETTINGS, DEFAULT_SHORTCUT_SETTINGS } from "../data/constants";

interface CFStoreInterface {
    language: string;
    fontSize: number;
    currentUrl: string | null;
    currentSlug: string | null;
    totalSize: number;
    testCases: TestCaseArray;
    isRunning: boolean;
    isSubmitting: boolean;
    apiKey: string;
    editorThemeList: Record<string, string>;
    editorSettings: EditorSettingsTypes;
    shortcutSettings: ShortcutSettings;

    // Actions
    setLanguage: (language: string) => void;
    setFontSize: (size: number) => void;
    setCurrentUrl: (url: string | null) => void;
    setCurrentSlug: (slug: string | null) => void;
    setTotalSize: (size: number) => void;
    setTestCases: (testCases: TestCaseArray) => void;
    setIsRunning: (running: boolean) => void;
    setIsSubmitting: (submitting: boolean) => void;
    setApiKey: (key: string) => void;
    setEditorSettings: (editorSettings: EditorSettingsTypes) => void;
    setShortcutSettings: (shortcutSettings: ShortcutSettings) => void;
}

export const useCFStore = create<CFStoreInterface>((set) => ({
    // Initial State
    language: localStorage.getItem('preferredLanguage') || 'cpp',
    fontSize: parseInt(localStorage.getItem('preferredFontSize') || '16', 10),
    currentUrl: null,
    currentSlug: null,
    totalSize: 0,
    testCases: { ErrorMessage: '', testCases: [] },
    isRunning: false,
    isSubmitting: false,
    apiKey: localStorage.getItem('judge0CEApiKey') || '',
    editorThemeList: themesJSON,
    editorSettings: JSON.parse(localStorage.getItem('editorSettings') ?? 'null') ?? DEFAULT_EDITOR_SETTINGS,
    shortcutSettings: JSON.parse(localStorage.getItem('shortcutSettings') ?? 'null') ?? DEFAULT_SHORTCUT_SETTINGS,

    // Actions
    setLanguage: (language) => set({ language }), setFontSize: (size) => set({ fontSize: size }),
    setCurrentUrl: (url) => set({ currentUrl: url }),
    setCurrentSlug: (slug) => set({ currentSlug: slug }),
    setTotalSize: (size) => set({ totalSize: size }),
    setTestCases: (testCases) => set({ testCases }),
    setIsRunning: (running) => set({ isRunning: running }),
    setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
    setApiKey: (key) => set({ apiKey: key }),
    setEditorSettings: (editorSettings) => set({ editorSettings }),
    setShortcutSettings: (shortcutSettings) => set({ shortcutSettings }),
}));
