import { useCFStore } from '../../zustand/useCFStore';
import { getTestCaseMap } from '../helper';
import { TestCaseArray } from '../../types/types';
import { browserAPI } from '../browser/browserDetect';

export const useTestCases = () => {
    const setTestCases = useCFStore(state => state.setTestCases);

    const requestTestCases = () => {
        try {
            browserAPI.runtime.sendMessage({ requestTestCases: true })
                .catch(error => {
                    console.error("Error requesting test cases:", error);
                });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const loadTestCases = ({ slug }: { slug: string }) => {
        const testCaseMap = getTestCaseMap();
        const oldTestCase: TestCaseArray = testCaseMap.get(slug) || { ErrorMessage: '', testCases: [] };

        if (!oldTestCase.testCases || oldTestCase.testCases.length === 0) {
            requestTestCases();
            return;
        }

        const allEmpty = oldTestCase.testCases.every(testCase =>
            !testCase.Input.trim() && !testCase.ExpectedOutput.trim()
        );

        if (allEmpty) {
            requestTestCases();
            return;
        }

        setTestCases(oldTestCase);
    };

    const setupTestCaseListener = () => {
        const messageListener = (message: any) => {
            if (message.testCase) {
                setTestCases({ ErrorMessage: '', testCases: message.testCase });
            }
        };

        try {
            browserAPI.runtime.onMessage.addListener(messageListener);

            return () => {
                try {
                    browserAPI.runtime.onMessage.removeListener(messageListener);
                } catch (error) {
                    console.error("Error removing message listener:", error);
                }
            };
        } catch (error) {
            console.error("Error setting up message listener:", error);
            return () => { };
        }
    };

    return {
        loadTestCases,
        requestTestCases,
        setupTestCaseListener
    };
};
