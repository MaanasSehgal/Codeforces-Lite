// Function to extract test cases from the active tab
const extractTestCases = async (tab) => {
    const match = tab.url.match(/\/problemset\/problem\/([0-9]+)\/([^\/]+)|\/contest\/([0-9]+)\/problem\/([^\/]+)/);
    if (!match) {
        console.log("Invalid URL format.");
        return;
    }

    const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const sampleTests = document.querySelectorAll(".sample-test");
            const testCases = [];
            let caseNumber = 1;

            sampleTests.forEach((sampleTestDiv) => {
                const inputs = sampleTestDiv.querySelectorAll(".input pre");
                const outputs = sampleTestDiv.querySelectorAll(".output pre");

                if (inputs.length !== outputs.length) {
                    console.error("Mismatch between input and output elements.");
                    return;
                }

                inputs.forEach((inputElement, index) => {
                    const inputValue = inputElement.innerText.trim();
                    const outputValue = outputs[index].innerText.trim();
                    testCases.push({
                        Testcase: caseNumber++,
                        Input: inputValue,
                        ExpectedOutput: outputValue,
                    });
                });
            });

            return testCases;
        },
    });

    // Send extracted test cases in response
    if (result && result.result) {
        chrome.runtime.sendMessage({ testCase: result.result });
    }
};

// Listen for messages from the content script or React component
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.requestTestCases) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                extractTestCases(activeTab);
            }
        });
    }
});
