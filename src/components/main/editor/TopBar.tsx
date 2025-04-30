import { Braces, ChartNoAxesGantt, CloudUpload, Code2, LoaderCircle, Play, RotateCcw, Settings } from 'lucide-react';
import { TopBarProps } from '../../../types/types';
import { useState } from 'react';
import Timer from './CodeTimer';

const TopBar: React.FC<TopBarProps> = ({
    theme,
    handleClick,
    setShowOptions,
    language,
    fontSize,
    handleLanguageChange,
    handleFontSizeChange,
    handleResetCode,
    handleRedirectToLatestSubmission,
    currentSlug,
    isRunning,
    isSubmitting,
    runCode,
    testCases,
    isFormating,
    handleFormatCode
}) => {

    const [showRunTooltip, setShowRunTooltip] = useState<boolean>(false);
    const [showSubmitTooltip, setShowSubmitTooltip] = useState<boolean>(false);
    // const apiKey = useCFStore((state) => state.apiKey);

    return (
        <>
            <div className='w-full flex border-b border-gray-500 justify-between text-xl text-black py-2 px-2'>
                <h1 className='flex justify-center items-center gap-2 font-[600] text-black'>
                    <Code2 size={20} color='green' />
                </h1>
                <div className='flex justify-center items-center gap-3'>
                    <div className="relative inline-flex shadow-sm">
                        <button
                            disabled={!currentSlug || isRunning || testCases.length === 0}
                            onClick={runCode}
                            onMouseEnter={() => setShowRunTooltip(true)}
                            onMouseLeave={() => setShowRunTooltip(false)}
                            className={`
                                ${(!currentSlug || isRunning || testCases.length === 0) && "cursor-not-allowed"}
                                h-7 px-3
                                text-white text-sm font-medium
                                bg-blue-500 hover:bg-blue-600
                                rounded-l-md
                                border-r border-blue-600
                                flex items-center gap-1
                                transition-colors
                            `}
                        >
                            {isRunning ?
                                <LoaderCircle className="animate-spin w-4 h-4" /> :
                                <>
                                    <Play className="w-4 h-4" />
                                    <span>Run</span>
                                </>
                            }
                        </button>

                        {showRunTooltip && (
                            <div className="absolute left-1/1 transform -translate-x-1/2 mt-10 ml-9 w-20 bg-gray-200 dark:bg-[#222222] text-white text-xs rounded-lg text-center py-1 shadow-lg">
                                <span className="dark:text-white text-black"><kbd className="border border-gray-600 px-1 rounded">Ctrl</kbd> + <kbd className="border border-gray-600 px-1 rounded">'</kbd></span>
                            </div>
                        )}

                        <button
                            disabled={!currentSlug || isSubmitting}
                            onClick={handleClick}
                            onMouseEnter={() => setShowSubmitTooltip(true)}
                            onMouseLeave={() => setShowSubmitTooltip(false)}
                            className={`
                                ${!currentSlug && "cursor-not-allowed"}
                                h-7 px-3
                                bg-green-500 hover:bg-green-600
                                text-black text-sm font-medium
                                rounded-r-md
                                flex items-center gap-1
                                transition-colors
                            `}
                        >
                            {isSubmitting ?
                                <LoaderCircle className="animate-spin w-4 h-4" /> :
                                <>
                                    <CloudUpload className="w-4 h-4" />
                                    <span>Submit</span>
                                </>
                            }
                        </button>

                        {showSubmitTooltip && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-10 ml-8 w-28 bg-gray-200 dark:bg-[#222222] text-white text-xs rounded-lg text-center py-1 shadow-lg">
                                <span className="dark:text-white text-black"><kbd className="border border-gray-600 px-1 rounded">Ctrl</kbd> + <kbd className="border border-gray-600 px-1 rounded">Enter</kbd></span>
                            </div>
                        )}
                    </div>

                </div>
                <div className='cursor-pointer flex justify-center items-center' onClick={() => setShowOptions(true)}>
                    <Settings color={theme === 'light' ? '#444444' : '#ffffff'} size={20} />
                </div>
            </div>

            <div className='w-full flex items-center justify-between py-2 px-2'>
                <div className='text-black flex items-center gap-2'>
                    {/* Language Selector */}
                    <select disabled={!currentSlug} value={language} onChange={handleLanguageChange} className={`${!currentSlug && "cursor-not-allowed"} bg-white dark:bg-zinc-800 border border-gray-300 text-gray-700 dark:text-zinc-100 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}>
                        <option className='text-black dark:text-zinc-100' value="cpp">C++</option>
                        <option className='text-black dark:text-zinc-100' value="java">Java</option>
                        <option className='text-black dark:text-zinc-100' value="python">Python</option>
                        <option className='text-black dark:text-zinc-100' value="javascript">JavaScript</option>
                        <option className='text-black dark:text-zinc-100' value="kotlin">Kotlin</option>
                        <option className='text-black dark:text-zinc-100' value="go">Go</option>
                        <option className='text-black dark:text-zinc-100' value="rust">Rust</option>
                        <option className='text-black dark:text-zinc-100' value="ruby">Ruby</option>
                    </select>

                    {/* Font Size Selector */}
                    <select disabled={!currentSlug} value={fontSize} onChange={handleFontSizeChange} className={`${!currentSlug && "cursor-not-allowed"} bg-white dark:bg-zinc-800 border border-gray-300 text-gray-700 dark:text-zinc-100 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}>
                        <option className='text-black dark:text-zinc-100' value="12">12px</option>
                        <option className='text-black dark:text-zinc-100' value="14">14px</option>
                        <option className='text-black dark:text-zinc-100' value="16">16px</option>
                        <option className='text-black dark:text-zinc-100' value="18">18px</option>
                        <option className='text-black dark:text-zinc-100' value="20">20px</option>
                    </select>
                </div>
                <div className={`flex items-center gap-2 cursor-pointer`}>
                    <Timer theme={theme} />
                    <button
                        disabled={!currentSlug || isFormating}
                        title='Format Code'
                    >
                        {isFormating ? (
                            <LoaderCircle color={theme === 'light' ? '#666666' : '#ffffff'} size={16} className={`animate-spin w-4 h-4 ${!currentSlug || isFormating ? 'cursor-not-allowed' : 'cursor-pointer'}`} />
                        ) : (
                            <ChartNoAxesGantt color={theme === 'light' ? '#666666' : '#ffffff'} size={16} className={`${!currentSlug ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleFormatCode} />
                        )}
                    </button>
                    <button
                        disabled={!currentSlug}
                        title='Latest Submission'
                    >
                        <Braces color={theme === 'light' ? '#666666' : '#ffffff'} size={16} className={`${!currentSlug ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleRedirectToLatestSubmission} />
                    </button>
                    <button
                        disabled={!currentSlug}
                        title='Reset Code'
                    >
                        <RotateCcw color={theme === 'light' ? '#666666' : '#ffffff'} size={16} className={`${!currentSlug ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleResetCode} />
                    </button>
                </div>
            </div>
        </>
    )
}
export default TopBar