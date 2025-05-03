import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export interface MainProps {
    theme: "light" | "dark";
    setShowOptions: (showOptions: boolean) => void;
}

export interface CodeEntry {
    code: string;
    size: number;
}

export interface TopBarProps {
    theme: "light" | "dark";
    language: string;
    fontSize: number;
    handleClick: () => void;
    setShowOptions: (showOptions: boolean) => void;
    handleLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleFontSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleResetCode: () => void;
    handleRedirectToLatestSubmission: () => void;
    currentSlug: string | null;
    isRunning: boolean;
    isSubmitting: boolean;
    runCode: () => void;
    testCases: TestCase[];
    isFormating: boolean;
    handleFormatCode: () => void;
}

export interface CodeEditorProps {
    monacoInstanceRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
    language: string;
    fontSize: number;
    currentSlug?: string | null;
    templateCode?: string;
}

export type PopupBoxProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>> | ((value: boolean) => void);
    title?: string;
    children: React.ReactNode;
    customClass?: string;
    disableOutsideClick?: boolean;
    disabledTopBar?: boolean;
    popupHeight?: string;
};

export type PopupModalProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>> | ((value: boolean) => void);
    children: React.ReactNode;
    disableOutsideClick?: boolean;
};

export interface SettingsProps {
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
    setShowOptions: (showOptions: boolean) => void;
}

export interface OptionProps {
    title: string;
    children: ReactNode;
}

export interface TestCase {
    Testcase: number;
    Input: string;
    ExpectedOutput: string;
    Output: string;
    TimeAndMemory: {
        Time: string;
        Memory: string;
    };
}


export type TestCaseArray = {
    testCases: TestCase[];
    ErrorMessage?: string;
};

export interface ThemeSettings {
    brightness: number;
    contrast: number;
    sepia: number;
    grayscale: number;
}

export interface OptionsProps {
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
    changeUI: string;
    setChangeUI: (changeUI: string) => void;
    setOpenConfirmationPopup: (open: boolean) => void;
}

export interface EditorSettingsTypes {
    indentSize: number;
    theme: string;
    lineWrapping: boolean;
    autoSuggestions: boolean;
    minimap: boolean;
    lineNumbers: boolean;
}