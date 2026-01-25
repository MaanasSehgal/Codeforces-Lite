import React from "react";
import PopupModal from "./PopupModal";
import PopupBox from "./PopupBox";

interface ApiLimitAlertProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ApiInstructions = () => (
  <div className="text-sm text-left mt-4">
    <p className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200">
      How to Get Judge0 API Key
    </p>

    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-darkText-400 leading-relaxed">
      <li>
        Sign up or log in to{" "}
        <a
          href="https://rapidapi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          RapidAPI
        </a>
        .
      </li>

      <li>
        Open{" "}
        <a
          href="https://rapidapi.com/judge0-official/api/judge0-ce/playground/apiendpoint_70574edc-a45b-41f3-8960-3a652b81404a"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Judge0 CE on RapidAPI
        </a>
        .
      </li>

      <li>
        If you see <span className="text-black dark:text-white">Subscribe to Test</span>, click it and select a plan <span className="text-black dark:text-white">(free plan if available)</span>. If not, your API key is already active.
      </li>

      <li>
        Copy the{" "}
        <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
          X-RapidAPI-Key
        </span>{" "}
        from the header parameters.
      </li>

      <li>Paste the key in Codeforces Lite → API Settings.</li>
    </ol>
  </div>
);

const LocalRunnerInstructions = () => (
  <div className="text-sm text-left mt-6">
    <p className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">
      Alternative: Use Local Runner (No API Key Required)
    </p>
    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-darkText-400 leading-relaxed">
      <li>
        Open <span className="text-black dark:text-white">API Settings</span>.
      </li>
      <li>
        Enable{" "}
        <span className="text-black dark:text-white">
          Use Local Runner
        </span>
        .
      </li>
      <li>
        Set the port number{" "}
        <span className="text-black dark:text-white">(default: 5000)</span>.
      </li>
      <li>
        Start the local server on your machine.
      </li>
      <li>
        Click <span className="text-black dark:text-white">Run</span> again.
      </li>
    </ol>
    <p className="mt-2 text-xs opacity-70">
      Local Runner executes code on your own machine and does not require any
      external API or internet access.
    </p>
  </div>
);
const ApiLimitAlert: React.FC<ApiLimitAlertProps> = ({ isOpen, setIsOpen }) => {
  return (
    <PopupModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <PopupBox
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Execution Setup Required"
        customClass="font-bold text-xl text-gray-800 dark:text-gray-200"
        popupHeight="h-auto"
      >
        <div className="text-gray-700 dark:text-darkText-400 leading-relaxed text-sm">
          <p className="mb-4">
            You are currently using the{" "}
            <span className="font-medium text-black dark:text-white">
              Judge0 execution backend
            </span>
            , which requires an API key.
          </p>

          <ApiInstructions />

          <LocalRunnerInstructions />
          <p className="mt-6">
            For detailed documentation, click{" "}
            <a
              href="https://github.com/MaanasSehgal/Codeforces-Lite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              here
            </a>
            .
          </p>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
          >
            Close
          </button>
        </div>
      </PopupBox>
    </PopupModal>
  );
};

export default ApiLimitAlert;