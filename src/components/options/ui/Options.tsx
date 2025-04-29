import { CircleCheck, CircleX, Moon, Palette, Settings, SunMedium, Trash2 } from "lucide-react";
import { OptionsProps } from "../../../types/types";
import Option from "./Option";
import { useCFStore } from "../../../zustand/useCFStore";
import { useState } from "react";
import ThemeCustomizer from "./ThemeCustomizer";

const Options = ({ theme, setTheme, changeUI, setChangeUI, tabIndent, setOpenConfirmationPopup, handleTabIndent, handleEditorThemeChange }: OptionsProps) => {
    const editorTheme = useCFStore(state => state.editorTheme);
    const editorThemeList = useCFStore(state => state.editorThemeList);
    const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);

    return (
        <>
            <ThemeCustomizer
                isOpen={isThemeCustomizerOpen}
                onClose={() => setIsThemeCustomizerOpen(false)}
                theme={theme}
            />

            <div className="w-full flex flex-wrap justify-evenly items-center gap-x-10 max-w-[1200px] mt-4 mx-auto">
                <Option title="Appearance">
                    <div className="flex items-center gap-2">
                        {theme === 'dark' && (
                            <button
                                onClick={() => setIsThemeCustomizerOpen(true)}
                                className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#333333] hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 flex justify-center items-center"
                                title="Advanced theme settings"
                            >
                                <Settings color="#ffffff" />
                            </button>
                        )}
                        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#333333] hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 flex justify-center items-center">
                            {theme === 'light' ? <Moon color="#111111" /> : <SunMedium color="#ffffff" />}
                        </button>
                    </div>
                </Option>
                <Option title="Change UI">
                    <button onClick={() => setChangeUI(changeUI === 'true' ? 'false' : 'true')} className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#333333] hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 flex justify-center items-center">
                        {changeUI === 'true' ? <CircleCheck color={theme === 'light' ? '#22c55e' : '#22c55e'} /> : <CircleX color={'#ef4444'} />}
                    </button>
                </Option>
                <Option title="Delete saved codes">
                    <button onClick={() => setOpenConfirmationPopup(true)} className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#333333] hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 flex justify-center items-center">
                        <Trash2 color={'#ef4444'} />
                    </button>
                </Option>
                <Option title="Tab indent">
                    <select value={tabIndent} onChange={handleTabIndent} className='cursor-pointer bg-gray-300 text-xl font-semibold dark:bg-[#333333] w-10 h-8 hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 flex justify-center items-center text-gray-700 dark:text-zinc-100 rounded-full shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'>
                        <option className='text-black dark:text-zinc-100' value="2">2</option>
                        <option className='text-black dark:text-zinc-100' value="4">4</option>
                        <option className='text-black dark:text-zinc-100' value="6">6</option>
                        <option className='text-black dark:text-zinc-100' value="8">8</option>
                    </select>
                </Option>
                <Option title="Editor Theme">
                    <div className="flex items-center">
                        <Palette className="mr-2 text-gray-700 dark:text-zinc-100" size={16} />
                        <select
                            value={editorTheme}
                            onChange={handleEditorThemeChange}
                            className="cursor-pointer bg-gray-300 dark:bg-[#333333] hover:bg-gray-400 dark:hover:bg-[#444444] transition duration-200 text-gray-700 dark:text-zinc-100 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1 px-2 text-sm"
                        >
                            <option value="default" className="text-black dark:text-zinc-100">Default</option>
                            <option value="vs-dark" className="text-black dark:text-zinc-100">Dark</option>
                            <option value="vs-light" className="text-black dark:text-zinc-100">Light</option>
                            <option value="hc-black" className="text-black dark:text-zinc-100">High Contrast</option>
                            {
                                Object.keys(editorThemeList).map((theme, index) => (
                                    <option key={index} value={theme} className="text-black dark:text-zinc-100">{editorThemeList[theme]}</option>
                                ))
                            }
                        </select>
                    </div>
                </Option>
            </div>
        </>
    );
};

export default Options;
