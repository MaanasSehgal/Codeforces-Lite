import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export interface MainProps {
  theme: "light" | "dark";
  setShowOptions: (showOptions: boolean) => void;
}

export interface CodeEntry {
  code: string;
  size: number;
  /** Caret offset within `code`. Absent for entries saved before carets were stored separately. */
  cursorOffset?: number;
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
  /** Fired once the monaco instance exists, so callers can load code without racing a timer. */
  onEditorReady?: () => void;
}

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
}

export type KeyBinding = "standard" | "vim";
export type LineNumber = "on" | "off" | "relative";
export type CursorSmoothCaretAnimation = "on" | "off" | "explicit";
export type CursorStyle =
  "line" | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin";

export interface EditorSettingsTypes {
  indentSize: number;
  theme: string;
  lineWrapping: boolean;
  autoSuggestions: boolean;
  minimap: boolean;
  lineNumbers: LineNumber;
  keyBinding: KeyBinding;
  cursorSmoothCaretAnimation: CursorSmoothCaretAnimation;
  cursorStyle: CursorStyle;
}

export interface IVimEditor extends monaco.editor.IStandaloneCodeEditor {
  vimMode: any;
  vimStatusRef: React.RefObject<HTMLDivElement | null>;
}

export interface ShortcutSettings {
  run: string;
  submit: string;
  reset: string;
  format: string;
}
