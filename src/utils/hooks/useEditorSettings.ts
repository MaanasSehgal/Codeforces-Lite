import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { EditorSettingsTypes } from '../../types/types';
import { DEFAULT_EDITOR_SETTINGS } from '../../data/constants';

export const useEditorSettings = (editorSettings: EditorSettingsTypes, setEditorSettings: (settings: EditorSettingsTypes) => void) => {

    const getEditorSettings = (): EditorSettingsTypes => {
        const storedSettings = localStorage.getItem('editorSettings');
        if (storedSettings) {
            try {
                return JSON.parse(storedSettings);
            } catch {
                console.error('Failed to parse editor settings');
            }
        }
        return DEFAULT_EDITOR_SETTINGS;
    };

    const handleToggle = (setting: keyof EditorSettingsTypes) => {
        if (typeof editorSettings[setting] === 'boolean') {
            setEditorSettings({
                ...editorSettings,
                [setting]: !editorSettings[setting as keyof EditorSettingsTypes]
            });
        }
    };

    const saveEditorSettings = () => {
        localStorage.setItem('editorSettings', JSON.stringify(editorSettings));
        applyEditorSettings();
    };

    const applyEditorSettings = (): void => {
        if (!monaco) return;

        monaco.editor.setTheme(editorSettings.theme);

        monaco.editor.getModels().forEach(model => {
            model.updateOptions({
                indentSize: editorSettings.indentSize,
                tabSize: editorSettings.indentSize,
            });
        });

        monaco.editor.getEditors().forEach(editor => {
            editor.updateOptions({
                wordWrap: editorSettings.lineWrapping ? 'on' : 'off',
                minimap: {
                    enabled: editorSettings.minimap
                },
                lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
                quickSuggestions: editorSettings.autoSuggestions,
                suggestOnTriggerCharacters: editorSettings.autoSuggestions
            });
        });
    }

    return {
        getEditorSettings,
        handleToggle,
        saveEditorSettings,
    }
}