import { OptionProps } from "../../../types/types";

const Option: React.FC<OptionProps> = ({ title, children }) => {
    return (
        <div className="w-full max-w-[400px] flex justify-between items-center p-2 mb-4 dark:bg-[#1a1a1a] bg-zinc-200 rounded-full">
            <div className="w-48">
                <span className="text-lg font-semibold dark:text-zinc-200 text-zinc-800">{title}</span>
            </div>
            <div className="flex justify-center items-center">
                {children}
            </div>
        </div>
    );
}

export default Option;
