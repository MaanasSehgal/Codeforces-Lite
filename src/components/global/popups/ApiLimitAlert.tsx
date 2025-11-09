import React from "react";
import PopupModal from "./PopupModal";
import PopupBox from "./PopupBox";

interface ApiLimitAlertProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ApiLimitAlert: React.FC<ApiLimitAlertProps> = ({ isOpen, setIsOpen }) => {
  const apiKey = localStorage.getItem("judge0CEApiKey");

  const removeAPIKey = () => {
    localStorage.removeItem("judge0CEApiKey");
    setIsOpen(false);
  };

  return (
    <PopupModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <PopupBox
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Sulu Service Unavailable"
        customClass="max-w-xs"
        popupHeight="h-auto"
      >
        <div className="text-gray-700 dark:text-darkText-400">
          <p className="mb-4 text-sm">
            Sorry for the inconvenience. The Judge0 Sulu API edition is
            currently down. We've now moved our integration to RapidAPI. Please
            generate your own RapidAPI key to continue using the service without
            interruptions.
          </p>
          <div className="mb-6 text-sm">
            {apiKey ? (
              <>
                <button
                  onClick={removeAPIKey}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Switch to IP-based limit
                </button>
                <span className="text-gray-600 dark:text-gray-300"> or </span>
                <a
                  href="https://github.com/MaanasSehgal/Codeforces-Lite?tab=readme-ov-file#how-to-get-api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  upgrade plan
                </a>
              </>
            ) : (
              <>
                <a
                  href="https://github.com/MaanasSehgal/Codeforces-Lite?tab=readme-ov-file#how-to-get-api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Get API key
                </a>
                <span className="text-gray-600 dark:text-gray-300">
                  {" "}
                  for higher limits
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
          >
            Close
          </button>
        </div>
      </PopupBox>
    </PopupModal>
  );
};

export default ApiLimitAlert;
