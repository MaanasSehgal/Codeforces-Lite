import PopupModal from "./PopupModal";
import PopupBox from "./PopupBox";

interface ApiLimitAlertProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ApiLimitAlert: React.FC<ApiLimitAlertProps> = ({ isOpen, setIsOpen }: ApiLimitAlertProps) => {
  return (
    <PopupModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <PopupBox
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Daily Code Execution Limit Reached"
        customClass="font-bold text-xl text-gray-800 dark:text-gray-200"
        popupHeight="h-auto"
      >
        <div className="text-gray-700 dark:text-darkText-400 leading-relaxed text-sm">
          <p className="mb-4">
            You've reached your daily limit for code executions. Please try again tomorrow.
          </p>

          <p className="mb-4">
            We are working on options for users who require more frequent use. At this time, we do not support custom API keys or payment plans to increase this limit.
          </p>

          <p className="mt-4">
            If you have questions, feedback, or believe you've received this message in error, please{" "}
            <a
              href="https://github.com/MaanasSehgal/Codeforces-Lite/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              create an issue on GitHub
            </a>
            . We appreciate your understanding.
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
