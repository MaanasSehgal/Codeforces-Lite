if (typeof isFirefox === 'undefined') {
    let isFirefox = typeof browser !== 'undefined';
    let browserAPI = isFirefox ? browser : chrome;
}

const extractTestCases = async (tab) => {
    try {
        const match = tab.url.match(/\/problemset\/problem\/([0-9]+)\/([^\/]+)|\/contest\/([0-9]+)\/problem\/([^\/]+)|\/gym\/([0-9]+)\/problem\/([^\/]+)/);
        if (!match) {
            return;
        }

        const [result] = await browserAPI.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const sampleTests = document.querySelectorAll(".sample-test");
                const testCases = [];
                let caseNumber = 1;

                sampleTests.forEach((sampleTestDiv) => {
                    const inputs = sampleTestDiv.querySelectorAll(".input pre");
                    const outputs = sampleTestDiv.querySelectorAll(".output pre");

                    if (inputs.length !== outputs.length) {
                        return;
                    }

                    inputs.forEach((inputElement, index) => {
                        const inputValue = inputElement.innerText.trim();
                        const outputValue = outputs[index].innerText.trim();
                        testCases.push({
                            Testcase: caseNumber++,
                            Input: inputValue,
                            ExpectedOutput: outputValue,
                            Output: "",
                        });
                    });
                });

                return testCases;
            },
        });

        if (result && result.result) {
            browserAPI.runtime.sendMessage({ testCase: result.result }).catch(err => {
                console.log("Error sending test cases:", err);
            });
        }
    } catch (error) {
        console.error("Error extracting test cases:", error);
    }
};

browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.requestTestCases) {
        browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                extractTestCases(activeTab);
                sendResponse({ status: "extracting" });
            }
        });
        return true;
    }
});
