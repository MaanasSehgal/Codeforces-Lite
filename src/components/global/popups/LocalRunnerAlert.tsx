import React from "react";
import PopupModal from "./PopupModal";
import PopupBox from "./PopupBox";

interface LocalRunnerAlertProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  port: number;
}

const LocalRunnerAlert: React.FC<LocalRunnerAlertProps> = ({ isOpen, setIsOpen, port }) => {
  return (
    <PopupModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <PopupBox
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Local Runner Not Running"
        customClass="font-bold text-xl text-gray-800 dark:text-gray-200"
        popupHeight="h-auto"
      >
        <div className="text-gray-700 dark:text-darkText-400 leading-relaxed text-sm">
          <p className="mb-3">
            The local execution server could not be reached on port{" "}
            <strong className="text-black dark:text-white">{port}</strong>.
          </p>
          <p className="mb-2">To fix this:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open a terminal</li>
            <li>Navigate to the local runner directory</li>
            <li>
              Run:{" "}
              <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
                python3 start.py
              </code>
            </li>
            <li>Try running your code again</li>
          </ol>
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

export default LocalRunnerAlert;
