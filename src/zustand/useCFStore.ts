import { create } from "zustand";
import { TestCaseArray } from "../types/types";
import themesJSON from '../../themes/themelist.json';

interface CFStoreInterface {
    language: string;
    fontSize: number;
    tabIndent: number;
    editorTheme: string;
    currentSlug: string | null;
    totalSize: number;
    testCases: TestCaseArray;
    isRunning: boolean;
    isSubmitting: boolean;
    apiKey: string;
    editorThemeList: Record<string, string>;

    // Actions
    setLanguage: (language: string) => void;
    setFontSize: (size: number) => void;
    setTabIndent: (indent: number) => void;
    setEditorTheme: (theme: string) => void;
    setCurrentSlug: (slug: string | null) => void;
    setTotalSize: (size: number) => void;
    setTestCases: (testCases: TestCaseArray) => void;
    setIsRunning: (running: boolean) => void;
    setIsSubmitting: (submitting: boolean) => void;
    setApiKey: (key: string) => void;
}

export const useCFStore = create<CFStoreInterface>((set) => ({
    // Initial State
    language: localStorage.getItem('preferredLanguage') || 'cpp', // Initialize from localStorage or default to 'cpp'
    fontSize: parseInt(localStorage.getItem('preferredFontSize') || '16', 10),
    tabIndent: parseInt(localStorage.getItem('tabIndent') || '4', 10),
    editorTheme: localStorage.getItem('preferredEditorTheme') || 'vs-dark',
    currentSlug: null,
    totalSize: 0,
    testCases: { ErrorMessage: '', testCases: [] },
    isRunning: false,
    isSubmitting: false,
    apiKey: localStorage.getItem('judge0CEApiKey') || '',
    editorThemeList: themesJSON,

    // Actions
    setLanguage: (language) => set({ language }), setFontSize: (size) => set({ fontSize: size }),
    setEditorTheme: (theme) => set({ editorTheme: theme }),
    setTabIndent: (indent) => set({ tabIndent: indent }),
    setCurrentSlug: (slug) => set({ currentSlug: slug }),
    setTotalSize: (size) => set({ totalSize: size }),
    setTestCases: (testCases) => set({ testCases }),
    setIsRunning: (running) => set({ isRunning: running }),
    setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
    setApiKey: (key) => set({ apiKey: key }),
}));
