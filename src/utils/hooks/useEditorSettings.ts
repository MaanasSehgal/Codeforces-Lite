import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { EditorSettingsTypes, IVimEditor } from '../../types/types';
import { DEFAULT_EDITOR_SETTINGS } from '../../data/constants';
import { initVimMode } from 'monaco-vim';

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
                lineNumbers: editorSettings.lineNumbers,
                quickSuggestions: editorSettings.autoSuggestions,
                suggestOnTriggerCharacters: editorSettings.autoSuggestions,
                cursorSmoothCaretAnimation: editorSettings.cursorSmoothCaretAnimation,
                cursorStyle: editorSettings.cursorStyle || 'line',
            });

            const vimEditor = editor as IVimEditor;

            if(editorSettings.keyBinding == "vim") {
                if(!vimEditor.vimMode) {
                    vimEditor.vimMode = initVimMode(editor, vimEditor.vimStatusRef.current);
                }
            } else {
                if (vimEditor.vimMode) {
                    vimEditor.vimMode.dispose();
                    vimEditor.vimMode = null;
                }
            }
        });
    }

    return {
        getEditorSettings,
        handleToggle,
        saveEditorSettings,
    }
}