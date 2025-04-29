import React from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeSettings } from '../../../utils/themeUtils';

interface ThemePreset {
    name: string;
    settings: ThemeSettings;
}

interface ThemePresetsProps {
    onSelectPreset: (preset: ThemePreset) => void;
    currentSettings: ThemeSettings;
}

const ThemePresets: React.FC<ThemePresetsProps> = ({ onSelectPreset, currentSettings }) => {
    const presets: ThemePreset[] = [
        {
            name: 'Default Dark',
            settings: { brightness: 100, contrast: 100, sepia: 0, grayscale: 0, invert: 0 }
        },
        {
            name: 'High Contrast',
            settings: { brightness: 110, contrast: 130, sepia: 0, grayscale: 0, invert: 0 }
        },
        {
            name: 'Sepia',
            settings: { brightness: 105, contrast: 105, sepia: 50, grayscale: 0, invert: 0 }
        },
        {
            name: 'Night Mode',
            settings: { brightness: 70, contrast: 120, sepia: 20, grayscale: 0, invert: 0 }
        }
    ];

    const isCurrentPreset = (preset: ThemePreset) => {
        return (
            preset.settings.brightness === currentSettings.brightness &&
            preset.settings.contrast === currentSettings.contrast &&
            preset.settings.sepia === currentSettings.sepia &&
            preset.settings.grayscale === currentSettings.grayscale &&
            preset.settings.invert === currentSettings.invert
        );
    };

    const handlePresetClick = (preset: ThemePreset) => {
        onSelectPreset(preset);
    };

    return (
        <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Presets</h3>
            <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => handlePresetClick(preset)}
                        className={`px-3 py-2 text-sm rounded-md flex items-center justify-between ${isCurrentPreset(preset)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {preset.name}
                        {isCurrentPreset(preset) && <Check size={16} className="ml-1" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThemePresets;