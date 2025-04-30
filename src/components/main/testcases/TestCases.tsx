import { useEffect, useRef, useState } from 'react';
import { TestCase } from '../../../types/types';
import { MAX_TEST_CASES } from '../../../data/constants';
import { useCFStore } from '../../../zustand/useCFStore';
import { CircleX, Plus, Copy, Check, RotateCcw, Terminal, LoaderCircle } from 'lucide-react';
import TestCaseNotAccess from './TestCaseNotAccess';
import { browserAPI } from '../../../utils/browser/browserDetect';

const TestCases = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const currentSlug = useCFStore((state) => state.currentSlug);
    const testCases = useCFStore((state) => state.testCases);
    const setTestCases = useCFStore((state) => state.setTestCases);
    const isRunning = useCFStore((state) => state.isRunning);
    const [copied, setCopied] = useState<{ input: boolean, expectedOutput: boolean, output: boolean }>({ input: false, expectedOutput: false, output: false });

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const outputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
        }
        if (outputRef.current) {
            outputRef.current.style.height = 'auto';
            outputRef.current.style.height = outputRef.current.scrollHeight + 'px';
        }
    }, [currentSlug, testCases, selectedTab]);

    const isAllTestCasesPassed = () => {
        if (!testCases.testCases[selectedTab]?.Output) return false;
        return testCases.testCases.length > 0 && testCases.testCases.every((testCase) =>
            testCase.ExpectedOutput?.trim() === testCase.Output?.trim()
        )
    };

    const getInputBorderColor = (testCase: TestCase) => {
        if (!testCase.Output) return 'border-gray-300 dark:border-gray-700';
        return testCase.Output.trim() === testCase.ExpectedOutput.trim()
            ? 'border-green-500 dark:border-green-500'
            : 'border-red-500 dark:border-red-500';
    };


    const getStatusMessage = () => {
        if (isAllTestCasesPassed()) {
            return (
                <div className="flex items-center gap-2">
                    <div className="text-base font-medium text-green-500">Accepted</div>
                    {testCases.testCases[selectedTab]?.TimeAndMemory && (
                        <div className="text-xs text-gray-500">
                            Used: {testCases.testCases[selectedTab]?.TimeAndMemory?.Time}ms, {testCases.testCases[selectedTab]?.TimeAndMemory?.Memory}KB
                        </div>
                    )}
                </div>
            );
        } else if (testCases.ErrorMessage) {
            return (
                <div className="text-base font-medium text-red-500">
                    {testCases.ErrorMessage.includes('Compilation Error') ? 'Compilation Error' :
                        testCases.ErrorMessage.includes('Time Limit') ? 'Time Limit Exceeded' :
                            testCases.ErrorMessage.includes('Memory Limit') ? 'Memory Limit Exceeded' :
                                testCases.ErrorMessage.includes('Runtime Error') ? 'Runtime Error' :
                                    testCases.ErrorMessage.includes('Rate Limit Exceeded') ? 'Rate Limit Exceeded' :
                                        testCases.ErrorMessage.includes('Internal Error') ? 'Internal Error' :
                                            'Wrong Answer'}
                </div>
            );
        } else if (testCases.testCases[selectedTab]?.Output) {
            return (
                <div className="flex items-center gap-2">
                    <div className="text-base font-medium text-red-500">Wrong Answer</div>
                    {testCases.testCases[selectedTab].TimeAndMemory && (
                        <div className="text-xs text-gray-500">
                            Used: {testCases.testCases[selectedTab].TimeAndMemory?.Time}ms, {testCases.testCases[selectedTab].TimeAndMemory?.Memory}KB
                        </div>
                    )}
                </div>
            )
        }
        return;
    };

    const getTabStyle = (index: number) => {
        const baseStyle = "w-24 px-2 py-1 text-base font-medium rounded-lg transition-colors duration-200 border-b-2";

        const selectedStyle = selectedTab === index
            ? 'bg-gray-300 dark:bg-zinc-800'
            : 'bg-transparent';

        let borderStyle = 'border-transparent';
        if (testCases?.testCases?.[index]?.Output) {
            borderStyle = testCases.testCases[index].Output.trim() === testCases.testCases[index].ExpectedOutput.trim()
                ? 'border-green-500'
                : 'border-red-500';
        }

        return `${baseStyle} ${selectedStyle} ${borderStyle} text-gray-700 dark:text-gray-300`;
    };

    const handleCopy = async (text: string, type: 'input' | 'expectedOutput' | 'output') => {
        await navigator.clipboard.writeText(text);
        setCopied(prev => ({ ...prev, [type]: true }));
        setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    };

    useEffect(() => {
        if (selectedTab >= testCases.testCases.length) {
            setSelectedTab(Math.max(0, testCases.testCases.length - 1));
        }
    }, [testCases.testCases.length]);

    const handleInputChange = (index: number, newInput: string) => {
        if (isRunning) return;
        const updatedTestCases = [...testCases.testCases];
        updatedTestCases[index].Input = newInput;
        setTestCases({ testCases: updatedTestCases });
    };

    const handleExpectedOutputChange = (index: number, newOutput: string) => {
        if (isRunning) return;
        const updatedTestCases = [...testCases.testCases];
        updatedTestCases[index].ExpectedOutput = newOutput;
        setTestCases({ testCases: updatedTestCases });
    };

    const addTestCase = () => {
        if (testCases.testCases.length < MAX_TEST_CASES) {
            const newTestCase: TestCase = {
                Input: '', ExpectedOutput: '',
                Testcase: testCases.testCases.length + 1,
                TimeAndMemory: { Time: '', Memory: '' },
                Output: ''
            };

            setTestCases({ testCases: [...testCases.testCases.map(testCase => ({ ...testCase, Output: '' })), newTestCase], ErrorMessage: '' }); setSelectedTab(testCases.testCases.length);
        }
    };

    const removeTestCase = (index: number) => {
        const updatedTestCases = testCases.testCases.filter((_, i) => i !== index);
        setTestCases({ testCases: updatedTestCases });

        setSelectedTab((prev) => Math.max(0, prev > index ? prev - 1 : prev));
    };

    const resetTestCases = () => {
        browserAPI.runtime.sendMessage({ requestTestCases: true });
        setSelectedTab(0);
    };

    return (
        <>
            {!currentSlug ? (
                <TestCaseNotAccess />
            ) : (
                <div className="w-full dark:bg-[#111111] p-4 rounded-md overflow-auto">
                    <div className='w-full flex flex-col gap-2 border-b border-gray-500 text-xl text-black dark:text-white py-2 px-2'>
                        <h2 className="flex justify-between items-center font-[600]">
                            <div className="flex items-center justify-center gap-2">
                                {isRunning ?
                                    <LoaderCircle className="animate-spin w-4 h-4" /> :
                                    <Terminal size={20} color='#227935' />
                                }
                                Test Cases
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={resetTestCases}
                                    className={`text-gray-500 hover:text-gray-600 ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                                    title="Reset test cases"
                                    disabled={isRunning}
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    onClick={addTestCase}
                                    className={`text-gray-500 hover:text-gray-600 ${testCases.testCases.length >= MAX_TEST_CASES || isRunning ? "cursor-not-allowed opacity-50" : ""
                                        }`}
                                    disabled={testCases.testCases.length >= MAX_TEST_CASES || isRunning}
                                    title="Add test case"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </h2>
                        {getStatusMessage()}
                    </div>

                    {testCases.ErrorMessage ? (
                        <div className='mt-3'>
                            <div className="relative">
                                <div className={`p-2 rounded-md whitespace-pre-wrap ${testCases.testCases[selectedTab]?.Output?.trim() === testCases.testCases[selectedTab]?.ExpectedOutput.trim()
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    }`}>
                                    {testCases.testCases[selectedTab]?.Output}
                                </div>
                                <button
                                    onClick={() => handleCopy(testCases.testCases[selectedTab]?.Output || '', 'output')}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                >
                                    {copied.output ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-2 mb-2 pr-3 py-3 overflow-x-auto whitespace-nowrap">
                                {testCases.testCases.map((_, index) => (
                                    <div key={index} className="relative group">
                                        <button
                                            onClick={() => setSelectedTab(index)}
                                            className={`w-24 px-2 py-1 text-base font-medium rounded-lg transition-colors duration-200 border-b-2 ${getTabStyle(index)}`}
                                        >
                                            Case {index + 1}
                                        </button>
                                        <button
                                            onClick={() => removeTestCase(index)}
                                            className={`absolute hidden group-hover:flex -top-1.5 -right-1.5 text-xs text-gray-400 hover:text-gray-600 rounded-full w-4 h-4 items-center justify-center ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={isRunning}
                                        >
                                            <CircleX />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {testCases.testCases.length > 0 && selectedTab < testCases.testCases.length && (
                                <div className="flex flex-col p-2">
                                    <div>
                                        <div className="relative">
                                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                                <h2 className="text-base font-[600] pb-1">Input</h2>
                                                <textarea
                                                    ref={inputRef}
                                                    value={testCases.testCases[selectedTab].Input}
                                                    onChange={(e) => handleInputChange(selectedTab, e.target.value)}
                                                    className={`mono-font w-full p-2 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors duration-200 ${testCases.testCases[selectedTab].Output
                                                        ? getInputBorderColor(testCases.testCases[selectedTab])
                                                        : 'border-gray-300 dark:border-gray-700'
                                                        }`}
                                                />
                                            </label>
                                            <button
                                                onClick={() => handleCopy(testCases.testCases[selectedTab].Input, 'input')}
                                                className="absolute top-8 right-2 text-gray-400 hover:text-gray-600"
                                            >
                                                {copied.input ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                        </div>

                                        <div className="relative mt-4">
                                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                                <h2 className="text-base font-[600] pb-1">Expected Output</h2>
                                                <textarea
                                                    ref={outputRef}
                                                    value={testCases.testCases[selectedTab].ExpectedOutput}
                                                    onChange={(e) => handleExpectedOutputChange(selectedTab, e.target.value)}
                                                    className={`mono-font w-full p-2 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors duration-200 ${testCases.testCases[selectedTab].Output
                                                        ? getInputBorderColor(testCases.testCases[selectedTab])
                                                        : 'border-gray-300 dark:border-gray-700'
                                                        }`}
                                                />
                                            </label>
                                            <button
                                                onClick={() => handleCopy(testCases.testCases[selectedTab].ExpectedOutput, 'expectedOutput')}
                                                className="absolute top-8 right-2 text-gray-400 hover:text-gray-600"
                                            >
                                                {copied.expectedOutput ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {testCases.testCases.length > 0 && testCases.testCases[selectedTab]?.Output && (
                                        <div className="mt-4">
                                            <h2 className="text-base font-[600] pb-1 text-zinc-500">Output</h2>
                                            <div className="relative">
                                                <div className={`p-2 rounded-md whitespace-pre-wrap ${testCases.testCases[selectedTab]?.Output.trim() === testCases.testCases[selectedTab].ExpectedOutput.trim()
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                    }`}>
                                                    {testCases.testCases[selectedTab]?.Output}
                                                </div>

                                                <button
                                                    onClick={() => handleCopy(testCases.testCases[selectedTab]?.Output || '', 'output')}
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {copied.output ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}


                </div>
            )}
        </>
    );
};

export default TestCases;
