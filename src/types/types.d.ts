export interface MainProps {
  theme: "light" | "dark";
  tabIndent: number;
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
}

export interface CodeEditorProps {
  theme: "light" | "dark";
  language: string;
  fontSize: number;
  tabIndent: number;
  currentSlug: string | null;
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
  tabIndent: number;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  setShowOptions: (showOptions: boolean) => void;
  setTabIndent: (tabIndent: number) => void;
}

export interface OptionProps {
  title: string;
  children: ReactNode;
}

export interface OptionsProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  changeUI: string;
  setChangeUI: (changeUI: string) => void;
  tabIndent: number;
  setOpenConfirmationPopup: (open: boolean) => void;
  handleTabIndent: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
