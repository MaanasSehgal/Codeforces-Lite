import { Check, RotateCcw } from "lucide-react";
import React, { useState, useEffect } from "react";

type RowId = "run" | "submit" | "reset" | "format";

interface ShortcutRowProps {
  id: RowId;
  label: string;
  value: string;
  isRecording: boolean;
  onStartRecording: (id: RowId) => void;
  onReset: (id: RowId) => void;
  description?: string;
}

const ShortcutRowComponent: React.FC<ShortcutRowProps> = ({
  id,
  label,
  value,
  isRecording,
  onStartRecording,
  onReset,
  description,
}) => {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (!showCheck) return;
    const t = window.setTimeout(() => setShowCheck(false), 600);
    return () => clearTimeout(t);
  }, [showCheck]);

  const handleReset = () => {
    onReset(id);
    setShowCheck(true);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div className="w-full flex items-center gap-2">
        <div
          tabIndex={0}
          onClick={() => onStartRecording(id)}
          className={`shortcut-input cursor-pointer flex-1 px-3 py-2 font-mono text-gray-700 dark:text-zinc-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-150
            ${isRecording ? "ring-2 ring-blue-500 bg-white dark:bg-[#111]" : "bg-gray-100 dark:bg-[#2a2a2a]"}`}
          role="button"
          aria-pressed={isRecording}
        >
          {isRecording ? "Press keys..." : value}
        </div>

        <button
          onClick={handleReset}
          className="relative p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#3a3a3a] transition-colors duration-150 flex items-center justify-center w-9 h-9"
          aria-label={`Reset ${label}`}
          type="button"
        >
          <span className="absolute inset-0 flex items-center justify-center">
            {showCheck ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <RotateCcw size={18} className="text-gray-700 dark:text-gray-300" />
            )}
          </span>
        </button>
      </div>

      {description ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      ) : null}
    </div>
  );
};

export default React.memo(ShortcutRowComponent);
