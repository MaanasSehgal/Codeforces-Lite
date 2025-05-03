import { OptionProps } from "../../../types/types";
import { getCodeMap } from "../../../utils/helper";

const Option: React.FC<OptionProps> = ({ title, children }) => {
    const totalSavedCodes = getCodeMap().size;
    return (
        <div className="w-full flex justify-between items-center p-3 dark:bg-[#1a1a1a] bg-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex-1">
                <span className="text-base md:text-lg font-medium dark:text-zinc-200 text-zinc-800">{title}</span>
                {title === 'Delete Saved Codes' && (
                    <>
                        <br />
                        <span className="text-xs md:text-sm text-zinc-400">{totalSavedCodes} saved codes</span>
                    </>
                )}
            </div>
            <div className="flex justify-center items-center">
                {children}
            </div>
        </div>
    );
}

export default Option;
