import { useCFStore } from '../../zustand/useCFStore';
import { adjustCodeForJudge0 } from '../codeAdjustments';
import { EXECUTE_CODE_LIMIT } from '../../data/constants';
import { useState } from 'react';
import { usageDataHelper } from '../usageDataHelper';
import { getProblemName } from '../dom/getProblemName';
import { getUserId } from '../dom/getUserId';

const languageMap: { [key: string]: number } = {
    'java': 62,
    'javascript': 63,
    'cpp': 54,
    'python': 71,
    'kotlin': 78,
};

export const executionState = {
    abortController: null as AbortController | null,
    isExecuting: false,
    reset() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        this.isExecuting = false;
    },
    startNew() {
        this.reset();
        this.abortController = new AbortController();
        this.isExecuting = true;
        return this.abortController;
    }
};

// Status handler
const handleExecutionStatus = (result: any, testCase: any) => {
    const statusHandlers: any = {
        2: { message: 'Runtime Error', getOutput: () => result.description ? decodeURIComponent(escape(atob(result.description))) : 'In queue' },
        3: { message: null, getOutput: () => result.stdout ? decodeURIComponent(escape(atob(result.stdout))) : 'No output, please check your code and print something' },
        4: { message: 'Wrong Answer', getOutput: () => result.stdout ? decodeURIComponent(escape(atob(result.stdout))) : 'No output, please check your code and print something' },
        5: { message: 'Time Limit Exceeded', getOutput: () => 'Time Limit Exceeded' },
        6: { message: 'Compilation Error', getOutput: () => `Compilation Error: ${result.compile_output ? decodeURIComponent(escape(atob(result.compile_output))).trim() : 'Compilation Error'}` },
        7: { message: 'Memory Limit Exceeded', getOutput: () => 'Memory Limit Exceeded' },
        8: { message: 'Time Limit Exceeded', getOutput: () => 'Time Limit Exceeded' },
        9: { message: 'Output Limit Exceeded', getOutput: () => 'Output Limit Exceeded' },
        10: { message: 'Runtime Error', getOutput: () => `Runtime Error: ${result.stderr ? decodeURIComponent(escape(atob(result.stderr))).trim() : 'Runtime Error'}` },
        11: { message: 'Runtime Error', getOutput: () => decodeURIComponent(escape(atob(result.stderr))).trim() || 'Runtime Error' },
        12: { message: 'Execution Timed Out', getOutput: () => 'Execution Timed Out' },
    };

    const handler = statusHandlers[result.status_id] || { message: 'Runtime Error', getOutput: () => result.stderr ? decodeURIComponent(escape(atob(result.stderr))).trim() : 'Something went wrong' };
    testCase.ErrorMessage = handler.message;
    return handler.getOutput();
};

// Time and memory handler
const getTimeAndMemory = (result: any) => {
    if (result.status_id === 3) {
        return {
            Time: result.time || '0',
            Memory: (result.memory / 1024).toFixed(2) || '0'
        };
    }
    return { Time: '0', Memory: '0' };
};

export const useCodeExecution = (editor: React.RefObject<any>) => {
    const language = useCFStore(state => state.language);
    const testCases = useCFStore(state => state.testCases);
    const currentSlug = useCFStore(state => state.currentSlug);
    const setIsRunning = useCFStore(state => state.setIsRunning);
    const [showApiLimitAlert, setShowApiLimitAlert] = useState(false);

    const resetStates = () => {
        setIsRunning(false);
    };

    const setCatchError = (error: any) => {
        if (error.name === 'AbortError') {
            resetStates();
            return;
        }
        if (error.message.includes("Insufficie")) {
            setShowApiLimitAlert(true);
            testCases.ErrorMessage = "Rate Limit Exceeded";
            testCases.testCases.forEach((testCase: any) => {
                testCase.Output = "Rate Limit Exceeded";
                testCase.TimeAndMemory = { Time: '0', Memory: '0' };
            });
            return;
        }

        testCases.ErrorMessage = "Internal Error";
        testCases.testCases.forEach((testCase: any) => {
            testCase.Output = "Something went wrong. Please try again later or contact support.";
            testCase.TimeAndMemory = { Time: '0', Memory: '0' };
        });
    }

    const createSubmissionPayload = (code: string, input: string) => ({
        language_id: languageMap[language],
        source_code: btoa(adjustCodeForJudge0({ code, language })),
        stdin: btoa(input),
        cpu_time_limit: 2,
    });

    const processResults = async (tokens: string[], apiKey: string, region: string = 'AUTO') => {
        const controller = executionState.startNew();
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, (language === 'kotlin' ? 6000 : EXECUTE_CODE_LIMIT) * testCases.testCases.length);
            controller.signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        });

        const resultsResponse = await makeJudge0CERequest(
            `submissions/batch?base64_encoded=true&tokens=${tokens.join(',')}&fields=stdout,stderr,status,compile_output,status_id,time,memory`,
            { method: 'GET', headers: { 'X-Judge0-Region': region } },
            apiKey
        );
        return resultsResponse.json();
    };

    // Unified API handlers
    const makeJudge0CERequest = async (endpoint: string, options: any, apiKey: string) => {
        const controller = executionState.startNew();
        const baseUrl = options.method === 'GET' ? 'https://ce.judge0.com' : 'https://judge0-ce.p.sulu.sh';
        return fetch(`${baseUrl}/${endpoint}`, {
            ...options,
            headers: {
                'Accept': 'application/json',
                ...options.headers,
                'Authorization': apiKey ? `Bearer ${apiKey}` : ''
            },
            signal: controller.signal
        });
    };

    const executeCodeCE = async (code: string, apiKey: string) => {
        const submissions = testCases.testCases.map(testCase => createSubmissionPayload(code, testCase.Input));

        try {
            const submitResponse = await makeJudge0CERequest('submissions/batch?base64_encoded=true', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissions })
            }, apiKey);

            if (submitResponse.status === 429) {
                setShowApiLimitAlert(true);
                testCases.ErrorMessage = "Rate Limit Exceeded";
                testCases.testCases.forEach((testCase: any) => {
                    testCase.Output = "Rate Limit Exceeded";
                    testCase.TimeAndMemory = { Time: '0', Memory: '0' };
                });
                return;
            }

            const batchResponse = await submitResponse.json();

            if (!batchResponse || !Array.isArray(batchResponse)) {
                const errorDetail = batchResponse?.error || 'Unknown error';
                testCases.ErrorMessage = `Compilation Error`;
                testCases.testCases.forEach((testCase: any) => {
                    testCase.Output = errorDetail;
                });
                return;
            }

            const tokens = batchResponse.map(submission => submission.token);
            let results = await processResults(tokens, apiKey, submitResponse.headers.get('X-Judge0-Region') || 'AUTO');

            if (!results?.submissions) {
                testCases.ErrorMessage = `Compilation Error`;
                const errorDetail = decodeURIComponent(escape(atob(results?.error))) || 'Compilation Error';
                testCases.testCases.forEach((testCase: any) => {
                    testCase.Output = errorDetail;
                });
                return;
            }

            const outputResults: string[] = [];
            const timeMemoryResults: { Time: string; Memory: string }[] = [];

            for (const result of results.submissions) {
                if (!result) continue;

                if (result?.status_id === 2) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    results = await processResults(tokens, apiKey);
                }

                timeMemoryResults.push(getTimeAndMemory(result));
                outputResults.push(handleExecutionStatus(result, testCases));
            }

            testCases.testCases.forEach((testCase: any, index: number) => {
                testCase.Output = outputResults[index];
                testCase.TimeAndMemory = timeMemoryResults[index];
            });
        } catch (error: any) {
            setCatchError(error);
        }
    };


    const executeCode = async (code: string, apiKey: string) => {
        try {
            await executeCodeCE(code, apiKey);
        } catch (error: any) {
            setCatchError(error);
        }
    };

    const runCode = async () => {
        const problemName = await getProblemName();
        const userId = await getUserId();
        if(userId.includes("Unknown")) {
            alert("Please login to run code");
            return;
        }
        const slug = currentSlug || "";
        setIsRunning(true);
        testCases.ErrorMessage = '';
        testCases.testCases.forEach((testCase: any) => {
            testCase.Output = '';
            testCase.TimeAndMemory = { Time: '0', Memory: '0' };
        });

        const code = editor.current?.view?.state.doc.toString();
        const apiKey = localStorage.getItem('judge0CEApiKey');

        if (!code) {
            testCases.ErrorMessage = 'No code provided';
            setIsRunning(false);
            return;
        }

        await executeCode(code, apiKey || "");

        setIsRunning(false);

        await usageDataHelper(language, testCases, userId).handleUsageData(code, slug, "RUN", problemName);
    };

    return {
        runCode,
        showApiLimitAlert,
        setShowApiLimitAlert
    };
};
