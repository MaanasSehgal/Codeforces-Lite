import { Braces, ChartNoAxesGantt, CloudUpload, Code2, LoaderCircle, Play, RotateCcw, Settings, Wifi, WifiOff } from 'lucide-react';
import { ShortcutSettings, TopBarProps } from '../../../types/types';
import React, { useEffect, useState, useRef } from 'react';
import { useCFStore } from '../../../zustand/useCFStore';
import { normalizeShortcut } from '../../../utils/helper';
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
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const [showStatusAnimation, setShowStatusAnimation] = useState<boolean>(false);
    const [statusText, setStatusText] = useState<string>('');
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const shortcutSettings = useCFStore(state => state.shortcutSettings);
    const [normalizedShortcutSettings, setNormalizedShortcutSettings] = useState<ShortcutSettings>({
        run: normalizeShortcut(shortcutSettings.run),
        submit: normalizeShortcut(shortcutSettings.submit),
        reset: normalizeShortcut(shortcutSettings.reset),
        format: normalizeShortcut(shortcutSettings.format),
    });
    const SHOW_DURATION_MS = 4000;

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setStatusText('Online');
            setShowStatusAnimation(true);

            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

            hideTimeoutRef.current = setTimeout(() => {
                setShowStatusAnimation(false);
            }, SHOW_DURATION_MS);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setStatusText('Offline');
            setShowStatusAnimation(true);

            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

            hideTimeoutRef.current = setTimeout(() => {
                setShowStatusAnimation(false);
            }, SHOW_DURATION_MS);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        setNormalizedShortcutSettings({
            run: normalizeShortcut(shortcutSettings.run),
            submit: normalizeShortcut(shortcutSettings.submit),
            reset: normalizeShortcut(shortcutSettings.reset),
            format: normalizeShortcut(shortcutSettings.format),
        });
    }, [shortcutSettings]);

    return (
        <>
            <style>{`
                @keyframes iconPop {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes slideInFromLeft {
                    0% {
                        transform: translateX(-20px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOutToLeft {
                    0% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(-20px);
                        opacity: 0;
                    }
                }

                .status-container {
                    display: flex;
                    align-items: center;
                    min-width: 80px;
                    height: 28px;
                }

                .icon-wrapper {
                    display: flex;
                    align-items: center;
                    z-index: 2;
                }

                .status-icon {
                    animation: iconPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                }

                .status-text {
                    margin-left: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    white-space: nowrap;
                    animation: slideInFromLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    animation-delay: 0.2s;
                    opacity: 0;
                }

                .status-text.online {
                    color: #22c55e;
                }

                .status-text.offline {
                    color: #ef4444;
                }

                .status-container.hiding .status-icon {
                    animation: iconPop 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse forwards;
                }

                .status-container.hiding .status-text {
                    animation: slideOutToLeft 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .code-icon {
                    transition: opacity 0.2s ease-in-out;
                }

                .code-icon.hidden {
                    opacity: 0;
                    pointer-events: none;
                }

                .top-bar-container {
                    position: relative;
                    width: 100%;
                }

                .center-buttons {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                }

                .left-section {
                    position: absolute;
                    left: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .right-section {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            `}</style>

            <div className='top-bar-container w-full flex border-b border-gray-500 h-12 relative'>
                <div className='left-section flex items-center'>
                    <div className="status-container">
                        {!showStatusAnimation && isOnline && (
                            <div className="code-icon">
                                <Code2 size={18} color='green' />
                            </div>
                        )}

                        {showStatusAnimation && (
                            <>
                                <div className="icon-wrapper">
                                    <span className="status-icon">
                                        {isOnline
                                            ? <Wifi size={18} color="#22c55e" aria-label="Online" />
                                            : <WifiOff size={18} color="#ef4444" aria-label="Offline" />
                                        }
                                    </span>
                                </div>
                                <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
                                    {statusText}
                                </span>
                            </>
                        )}

                        {!showStatusAnimation && !isOnline && (
                            <span
                                title={"Offline"}
                                className="flex items-center"
                            >
                                <WifiOff size={16} color="red" aria-label="Offline" />
                            </span>
                        )}
                    </div>
                </div>

                <div className='center-buttons'>
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
                            <div
                                role="tooltip"
                                className="absolute left-1/2 -translate-x-1/2 mt-8 z-50 inline-flex items-center justify-center
                                        px-2 py-1 rounded-lg text-xs text-black dark:text-white bg-gray-200 dark:bg-[#222222]
                                        shadow-lg min-w-max max-w-[90vw] whitespace-normal break-words"
                            >
                                <div className="flex items-center gap-1 flex-wrap justify-center">
                                {normalizedShortcutSettings.run.split('+').map((key, index, arr) => (
                                    <React.Fragment key={index}>
                                    <kbd className="border border-gray-600 rounded px-1 text-[11px] font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</kbd>
                                    {index < arr.length - 1 && <span className="mx-0.5 text-xs">+</span>}
                                    </React.Fragment>
                                ))}
                                </div>
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
                            <div
                                role="tooltip"
                                className="absolute left-1/2 -translate-x-1/2 mt-8 z-50 inline-flex items-center justify-center
                                        px-2 py-1 rounded-lg text-xs text-black dark:text-white bg-gray-200 dark:bg-[#222222]
                                        shadow-lg min-w-max max-w-[90vw] whitespace-normal break-words"
                            >
                                <div className="flex items-center gap-1 flex-wrap justify-center">
                                {normalizedShortcutSettings.submit.split('+').map((key, index, arr) => (
                                    <React.Fragment key={index}>
                                    <kbd className="border border-gray-600 rounded px-1 text-[11px] font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</kbd>
                                    {index < arr.length - 1 && <span className="mx-0.5 text-xs">+</span>}
                                    </React.Fragment>
                                ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='right-section'>
                    <div className='cursor-pointer flex justify-center items-center' onClick={() => setShowOptions(true)}>
                        <Settings color={theme === 'light' ? '#444444' : '#ffffff'} size={18} />
                    </div>
                </div>
            </div>

            <div className='w-full flex items-center justify-between py-2 px-2'>
                <div className='text-black flex items-center gap-2'>
                    {/* Language Selector */}
                    <select
                        disabled={!currentSlug}
                        value={language}
                        onChange={handleLanguageChange}
                        className={`
                            ${!currentSlug && "cursor-not-allowed opacity-70"} 
                            bg-zinc-200 dark:bg-zinc-800  
                            text-gray-700 dark:text-zinc-100 
                            rounded-md 
                            shadow-sm 
                            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                            text-sm
                            transition-all duration-200 py-1
                        `}
                    >
                        <option className='text-black dark:text-zinc-100' value="cpp">C++</option>
                        <option className='text-black dark:text-zinc-100' value="java">Java</option>
                        <option className='text-black dark:text-zinc-100' value="python">Python</option>
                        <option className='text-black dark:text-zinc-100' value="pypy">PyPy</option>
                        <option className='text-black dark:text-zinc-100' value="javascript">JavaScript</option>
                        <option className='text-black dark:text-zinc-100' value="kotlin">Kotlin</option>
                        <option className='text-black dark:text-zinc-100' value="go">Go</option>
                        <option className='text-black dark:text-zinc-100' value="rust">Rust</option>
                        <option className='text-black dark:text-zinc-100' value="ruby">Ruby</option>
                    </select>

                    {/* Font Size Selector */}
                    <select
                        disabled={!currentSlug}
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        className={`
                            ${!currentSlug && "cursor-not-allowed opacity-70"} 
                            bg-zinc-200 dark:bg-zinc-800
                            text-gray-700 dark:text-zinc-100 
                            rounded-md 
                            shadow-sm 
                            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                            text-sm
                            transition-all duration-200 py-1
                        `}
                    >
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
                        title={`Format Code\nShortcut: ${normalizedShortcutSettings.format}`}
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
                        title={`Reset Code\nShortcut: ${normalizedShortcutSettings.reset}`}
                    >
                        <RotateCcw color={theme === 'light' ? '#666666' : '#ffffff'} size={16} className={`${!currentSlug ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleResetCode} />
                    </button>
                </div>
            </div>
        </>
    )
}
export default TopBar