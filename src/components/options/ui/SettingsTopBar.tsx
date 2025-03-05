import { Settings, X } from 'lucide-react';
import React from 'react';

interface SettingsTopBarProps {
    setShowOptions: (show: boolean) => void;
    theme: 'light' | 'dark';
}

const SettingsTopBar: React.FC<SettingsTopBarProps> = ({ setShowOptions, theme }) => {
    return (
        <div role="banner" className="w-full flex border-b border-gray-500 justify-between text-xl text-black py-2 px-2">
            < nav aria-label="Settings navigation" />
            <div className="flex justify-center items-center text-base gap-1 dark:text-white">
                <Settings size={20} />
                <h2>Settings</h2>
            </div>
            <div className="cursor-pointer flex justify-center items-center" onClick={() => setShowOptions(false)}>
                <X color={theme === 'light' ? '#444444' : '#ffffff'} size={20} />
            </div>
        </div>
    );
};

export default SettingsTopBar;
