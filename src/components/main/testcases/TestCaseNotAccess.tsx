import { useCFStore } from "../../../zustand/useCFStore";
import ApiSettings from "../../global/ApiSettings";
import { Code2, ExternalLink, FileWarning } from "lucide-react";

const TestCaseNotAccess: React.FC = () => {
    const currentSlug = useCFStore((state) => state.currentSlug);

    return (
        <div className="flex justify-center items-center h-full rounded-lg">
            {!currentSlug ? (
                <div className="text-center h-full flex flex-col justify-center items-center">
                    <div className="flex flex-col items-center justify-center gap-2 h-full">
                        <FileWarning size={48} className="text-yellow-500" />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            No Problem Selected
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md flex flex-col items-center">
                            <a
                                href="https://codeforces.com/problemset"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 mt-2"
                            >
                                Go to Problemset <ExternalLink size={14} />
                            </a>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-2xl p-6 h-full">
                    <div className="flex items-center justify-center mb-6">
                        <Code2 size={32} className="text-blue-500 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Configure Judge0 API
                        </h2>
                    </div>
                    <ApiSettings />
                    <div className="text-center mb-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Judge0 API is required to run and test your code directly in the extension.
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 list-disc text-left max-w-md mx-auto pl-4 pb-2">
                            <li>Real-time code execution</li>
                            <li>Test case validation</li>
                            <li>Performance metrics (runtime & memory usage)</li>
                            <li>Multiple programming language support</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestCaseNotAccess;
