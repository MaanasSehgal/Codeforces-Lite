import { CircleCheck, CircleX, Code, Moon, Settings, SunMedium, Trash2 } from "lucide-react";
import { OptionsProps } from "../../../types/types";
import Option from "./Option";
import { useCFStore } from "../../../zustand/useCFStore";
import { useEffect, useState } from "react";
import ThemeCustomizer from "./ThemeCustomizer";
import { toast } from "sonner";
import EditorSettings from "./EditorSettings";

const Options = ({ theme, setTheme, changeUI, setChangeUI, setOpenConfirmationPopup }: OptionsProps) => {
    const buttonClass = "w-9 h-9 rounded-xl bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#3a3a3a] transition-all duration-200 flex justify-center items-center shadow-sm";

    const currentUrl = useCFStore(state => state.currentUrl);
    const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
    const [isEditorSettingsOpen, setIsEditorSettingsOpen] = useState(false);

    const handlOpenThemeCustomizer = () => {
        if (!currentUrl || (currentUrl && !currentUrl.includes('codeforces.com'))) {
            toast.error('You can only customize the theme while on Codeforces.');
            return;
        }
        setIsThemeCustomizerOpen(true);
    };

    useEffect(() => {
        if (isThemeCustomizerOpen && (!currentUrl || (currentUrl && !currentUrl.includes('codeforces.com')))) {
            toast.error('You can only customize the theme while on Codeforces.');
            setIsThemeCustomizerOpen(false);
        }
    }, [currentUrl]);

    return (
        <>
            <ThemeCustomizer
                isOpen={isThemeCustomizerOpen}
                onClose={() => setIsThemeCustomizerOpen(false)}
                theme={theme}
            />
            <EditorSettings
                isOpen={isEditorSettingsOpen}
                onClose={() => setIsEditorSettingsOpen(false)}
            />

            <div className="w-full py-4 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Option title="Appearance">
                        <div className="flex items-center gap-2">
                            {theme === 'dark' && (
                                <button
                                    onClick={() => handlOpenThemeCustomizer()}
                                    className={buttonClass}
                                    title="Advanced theme settings"
                                    aria-label="Theme settings"
                                >
                                    <Settings size={20} color="#ffffff" />
                                </button>
                            )}

                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className={buttonClass}
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <Moon size={20} color="#111111" /> : <SunMedium size={20} color="#ffffff" />}
                            </button>
                        </div>
                    </Option>
                    <Option title="Editor Settings">
                        <button
                            onClick={() => setIsEditorSettingsOpen(true)}
                            className={buttonClass}
                            title="Editor settings"
                        >
                            <Code color={theme === 'light' ? "#111111" : "#ffffff"} />
                        </button>
                    </Option>

                    <Option title="Change UI">
                        <button
                            onClick={() => setChangeUI(changeUI === 'true' ? 'false' : 'true')}
                            className={buttonClass}
                            aria-label="Toggle UI mode"
                        >
                            {changeUI === 'true'
                                ? <CircleCheck size={20} color="#22c55e" />
                                : <CircleX size={20} color="#ef4444" />
                            }
                        </button>
                    </Option>

                    <Option title="Delete Saved Codes">
                        <button
                            onClick={() => setOpenConfirmationPopup(true)}
                            className={`${buttonClass} hover:bg-red-100 dark:hover:bg-red-900/30`}
                            aria-label="Delete saved codes"
                        >
                            <Trash2 size={20} color="#ef4444" />
                        </button>
                    </Option>
                </div>
            </div>
        </>
    );
};

export default Options;