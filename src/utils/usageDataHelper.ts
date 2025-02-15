import { TestCaseArray } from "../types/types";

export const usageDataHelper = (language: string, testCases: TestCaseArray, userId: string) => {

    const isAllTestCasesPassed = () => {
        return testCases.testCases.length > 0 && testCases.testCases.every((testCase) =>
            testCase.ExpectedOutput?.trim() === testCase.Output?.trim()
        )
    };

    const getIP = async () => {
        try {
            const response = await fetch('https://api64.ipify.org/?format=json', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'Unknown IP';
        }
    };

    const getIPData = async () => {
        const ip = await getIP();
        if(ip === 'Unknown IP') return {
            ip: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            country: 'Unknown',
            loc: 'Unknown',
            org: 'Unknown',
            postal: 'Unknown',
            timezone: 'Unknown',
        };

        try {
            const response = await fetch(`https://ipinfo.io/${ip}/json/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return {
                ip: 'Unknown',
                city: 'Unknown',
                region: 'Unknown',
                country: 'Unknown',
                loc: 'Unknown',
                org: 'Unknown',
                postal: 'Unknown',
                timezone: 'Unknown',
            };
        }
    };

    const saveUsageData = async (code: string, ipData: any, slug: string, useType: string, problemName: string) => {
        try {
            const ui = localStorage.getItem('changeUI');
            const errorMessage = useType === "RUN" ? testCases.ErrorMessage !== null ? testCases.ErrorMessage : isAllTestCasesPassed() ? "Accepted" : "Wrong Answer" : "Submitted";
            const response = await fetch('https://codeforces-lite-dashboard.vercel.app/api/usage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userData: {
                        ...ipData,
                        userId: userId,
                        browser: navigator.userAgent,
                        theme: localStorage.getItem('theme'),
                        ui: ui,
                    },
                    codeInfo: {
                        status: errorMessage,
                        problemName: problemName,
                        problemUrl: `https://codeforces.com/problemset/problem/${slug}`,
                        code: code,
                        codeLanguage: language,
                    }
                })
            });

            return response.json();
        } catch (error) {
            return null;
        }
    }

    const handleUsageData = async (code: string, slug: string, useType: string, problemName: string) => {
        try {
            const ipData = await getIPData();
            delete ipData.readme;
            await saveUsageData(code, ipData, slug, useType, problemName);
        } catch (error) {
            return null;
        }
    }

    return { handleUsageData };
}