import { useRef, useEffect, useState } from 'react';
import { useCFStore } from '../../zustand/useCFStore';
import { formatCode, getCodeMap, getSlug } from '../../utils/helper';
import TopBar from './editor/TopBar';
import TestCases from './testcases/TestCases';
import { ResizablePanel } from '../global/ResizablePanel';
import { useCodeExecution } from '../../utils/hooks/useCodeExecution';
import { useCodeManagement } from '../../utils/hooks/useCodeManagement';
import { useTestCases } from '../../utils/hooks/useTestCases';
import { useTabEvents } from '../../utils/hooks/useTabEvents';
import { handleSubmission } from '../../utils/services/submissionService';
import { initializeStorage } from '../../utils/services/storageService';
import { loadCodeWithCursor } from '../../utils/codeHandlers';
import { accessRestrictionMessage } from '../../data/constants';
import ApiLimitAlert from '../global/popups/ApiLimitAlert';
import CodeEditor from './editor/CodeEditor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { browserAPI } from '../../utils/browser/browserDetect';

interface MainProps {
    setShowOptions: (show: boolean) => void;
    theme: string;
    tabIndent: number;
}

const Main: React.FC<MainProps> = ({ setShowOptions, theme, tabIndent }) => {
    const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    // Zustand store hooks
    const {
        language,
        fontSize,
        currentSlug,
        setCurrentSlug,
        setTotalSize,
        testCases,
        isRunning,
        isSubmitting,
        setIsSubmitting
    } = useCFStore();

    // Custom hooks
    const { runCode, showApiLimitAlert, setShowApiLimitAlert } = useCodeExecution(monacoInstanceRef.current);
    const { handleResetCode, handleLanguageChange, handleFontSizeChange, handleRedirectToLatestSubmission } = useCodeManagement(monacoInstanceRef);
    const { loadTestCases, setupTestCaseListener } = useTestCases();
    const { handleTabEvents } = useTabEvents();
    const [isFormating, setIsFormating] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsSubmitting(false);
        }, 3000);
    }, [isSubmitting, currentSlug]);

    useEffect(() => {
        const cleanup = setupTestCaseListener();
        const size = initializeStorage();
        setTotalSize(size);
        return cleanup;
    }, []);

    useEffect(() => {
        const getCurrentSlug = async () => {
            const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.url) {
                const newSlug = getSlug(tab.url);
                setCurrentSlug(newSlug);
                if (newSlug) {
                    let codeForUrl = getCodeMap().get(newSlug)?.code || '';
                    codeForUrl = codeForUrl === '' ? localStorage.getItem('template') || '' : codeForUrl;

                    setTimeout(() => {
                        loadCodeWithCursor(monacoInstanceRef.current, codeForUrl);
                    }, 500);
                    loadTestCases({ slug: newSlug });
                } else {
                    setTimeout(() => {
                        loadCodeWithCursor(monacoInstanceRef.current, accessRestrictionMessage);
                    }, 500);
                }
            }
        };

        setTimeout(() => {
            getCurrentSlug();
        }, 100);

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.stopPropagation();
                event.preventDefault();
                handleSubmission(monacoInstanceRef.current, setIsSubmitting, language, testCases);
                return false;
            }
        };
        document.addEventListener('keydown', handleKeyPress, true);
        return () => document.removeEventListener('keydown', handleKeyPress, true);
    }, []);

    useEffect(() => {
        const handleRunCode = async (event: KeyboardEvent) => {
            if (isRunning) return;
            if (event.ctrlKey && event.key === "'") {
                if (!currentSlug) {
                    alert('Please select a problem to run code.');
                    return;
                }
                await runCode();
            }
        }

        document.addEventListener('keydown', handleRunCode);
        return () => document.removeEventListener('keydown', handleRunCode);
    }, [runCode]);

    useEffect(() => {
        if (monacoInstanceRef.current) {
            if (!currentSlug) {
                monacoInstanceRef.current.updateOptions({
                    readOnly: true
                });
            } else {
                monacoInstanceRef.current.updateOptions({
                    readOnly: false
                });
            }
        }
    }, [currentSlug, monacoInstanceRef.current]);

    useEffect(() => {
        const listener = (message: any, sender: any, sendResponse: (response: any) => void) => {
            return handleTabEvents(message, sender, sendResponse, monacoInstanceRef.current);
        };
        browserAPI.runtime.onMessage.addListener(listener);
        return () => {
            browserAPI.runtime.onMessage.removeListener(listener);
        };
    }, [currentSlug, testCases]);
    return (
        <div className='flex flex-col w-full justify-start items-center h-full dark:bg-[#111111]'>
            <ApiLimitAlert
                isOpen={showApiLimitAlert}
                setIsOpen={setShowApiLimitAlert}
            />
            <TopBar
                theme={theme as "light" | "dark"}
                handleClick={() => handleSubmission(monacoInstanceRef.current, setIsSubmitting, language, testCases)}
                setShowOptions={setShowOptions}
                language={language}
                handleLanguageChange={handleLanguageChange}
                fontSize={fontSize}
                handleFontSizeChange={handleFontSizeChange}
                handleResetCode={handleResetCode}
                handleRedirectToLatestSubmission={handleRedirectToLatestSubmission}
                currentSlug={currentSlug}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                runCode={runCode}
                testCases={testCases.testCases}
                isFormating={isFormating}
                handleFormatCode={() => formatCode(monacoInstanceRef, language, tabIndent, setIsFormating)}
            />

            <div className="w-full h-[calc(100vh-88px)]">
                <ResizablePanel
                    top={
                        <CodeEditor
                            monacoInstanceRef={monacoInstanceRef}
                            language={language}
                            fontSize={fontSize}
                            tabIndent={tabIndent}
                        />
                    }
                    bottom={<TestCases />}
                    initialHeight={70}
                />
            </div>
        </div>
    );
};
export default Main;
