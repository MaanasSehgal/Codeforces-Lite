import { handleSaveTemplate } from "../../utils/localStorageHelper";
import { useEffect, useRef, useState } from "react";
import { SettingsProps } from "../../types/types";
import { Toaster } from "sonner";
import Footer from "../global/Footer";
import DeleteCodesConfirmationPopup from "../global/popups/DeleteCodesConfirmationPopup";
import SettingsTopBar from "./ui/SettingsTopBar";
import Options from './ui/Options';
import CodeEditor from "../main/editor/CodeEditor";
import { useCFStore } from "../../zustand/useCFStore";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { browserAPI } from "../../utils/browser/browserDetect";
import { Save } from "lucide-react";
import ApiSettings from "../global/ApiSettings";

const Settings: React.FC<SettingsProps> = ({ setShowOptions, theme, setTheme }) => {
    const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const [changeUI, setChangeUI] = useState(localStorage.getItem('changeUI') || 'true');
    const [openConfirmationPopup, setOpenConfirmationPopup] = useState<boolean>(false);
    const { language, fontSize } = useCFStore();

    useEffect(() => {
        const defaultThemeSettings = localStorage.getItem('defaultThemeSettings');
        if (!defaultThemeSettings) {
            const initialSettings = {
                brightness: 100,
                contrast: 100,
                sepia: 0,
                grayscale: 0
            };
            localStorage.setItem('defaultThemeSettings', JSON.stringify(initialSettings));
            browserAPI.storage.local.set({ defaultThemeSettings: initialSettings });
        }

        const themeCustomSettings = localStorage.getItem('themeCustomSettings');
        if (!themeCustomSettings) {
            const initialSettings = JSON.parse(defaultThemeSettings || '{}');
            localStorage.setItem('themeCustomSettings', JSON.stringify(initialSettings));
            browserAPI.storage.local.set({ themeCustomSettings: initialSettings });
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        browserAPI.storage.local.set({ theme: theme });
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        browserAPI.storage.local.set({ changeUI: changeUI });
        localStorage.setItem('changeUI', changeUI);
    }, [changeUI]);

    return (
        <>
            <DeleteCodesConfirmationPopup
                openConfirmationPopup={openConfirmationPopup}
                setOpenConfirmationPopup={setOpenConfirmationPopup}
            />

            <div className="Settings-container w-full h-full flex flex-col items-center justify-center dark:bg-[#111111]">
                <Toaster theme={theme} position="bottom-left" />
                <SettingsTopBar theme={theme} setShowOptions={setShowOptions} />

                <div className="w-full h-full overflow-y-auto px-4">
                    <Options
                        theme={theme}
                        setTheme={setTheme}
                        changeUI={changeUI}
                        setChangeUI={setChangeUI}
                        setOpenConfirmationPopup={setOpenConfirmationPopup}
                    />
                    <ApiSettings />
                    <div className="mx-auto w-full max-w-3xl flex flex-col items-center gap-2 border-t-2 border-zinc-800">
                        <div className="self-center text-base text-zinc-700 font-semibold dark:text-zinc-200 flex justify-between w-full py-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-xl font-semibold text-gray-800 dark:text-white">Set your default template</p>
                                <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-300 pr-4">Use symbol <span className="font-[500] px-2 rounded-md bg-gray-300 dark:bg-gray-600">$0</span> to set your default cursor position in template.</p>
                            </div>
                            <button onClick={() => handleSaveTemplate(monacoInstanceRef.current)} aria-label="Save template" className="h-1/2 text-[#22c55e] text-sm px-2 py-1 font-bold rounded-lg gap-1 mt-1  bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#3a3a3a] transition-all duration-200 flex justify-center items-center shadow-sm">
                                <Save color="#22c55e" size={18} />
                                Save
                            </button>
                        </div>
                        <div className="text-left mt-2 mb-20 w-full h-[28rem]">
                            <CodeEditor
                                monacoInstanceRef={monacoInstanceRef}
                                language={language}
                                fontSize={fontSize}
                                templateCode={localStorage.getItem('template') || ''}
                            />
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Settings;
