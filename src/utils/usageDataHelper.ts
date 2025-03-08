import { TestCaseArray } from "../types/types";

export const usageDataHelper = (language: string, testCases: TestCaseArray, userId: string) => {

    const isAllTestCasesPassed = () => {
        return testCases.testCases.length > 0 && testCases.testCases.every((testCase) =>
            testCase.ExpectedOutput?.trim() === testCase.Output?.trim()
        )
    };

    const saveUsageData = async (code: string, problemUrl: string, useType: string, problemName: string) => {
        try {
            const ui = localStorage.getItem('changeUI');

            const errorMessage = useType === "RUN"
                ? testCases.ErrorMessage !== null
                    ? testCases.ErrorMessage
                    : isAllTestCasesPassed() ? "Accepted" : "Wrong Answer"
                : "Submitted";

            const response = await fetch('https://codeforces-lite-dashboard.vercel.app/api/usage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userData: {
                        handle: userId,
                        browser: navigator.userAgent,
                        theme: localStorage.getItem('theme'),
                        ui: ui,
                    },
                    codeInfo: {
                        status: errorMessage,
                        problemName: problemName,
                        problemUrl: problemUrl,
                        code: code,
                        codeLanguage: language,
                    }
                })
            });

            return response.json();
        } catch {
            return null;
        }
    }


    const handleUsageData = async (code: string, problemUrl: string, useType: string, problemName: string) => {
        try {
            await saveUsageData(code, problemUrl, useType, problemName);
        } catch (error) {
            return null;
        }
    }

    return { handleUsageData };
}