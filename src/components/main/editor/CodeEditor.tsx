import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';
import 'monaco-editor/esm/vs/language/css/monaco.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';
import { CodeEditorProps, EditorSettingsTypes } from '../../../types/types';
import themesJSON from '../../../../themes/themelist.json';
import { useEditorSettings } from '../../../utils/hooks/useEditorSettings';
import { useCFStore } from '../../../zustand/useCFStore';

const editorStyle: React.CSSProperties = {
    height: '250px',
    width: '100%',
    border: '1px solid #ccc',
    flexGrow: 1,
};

const CodeEditor = ({ monacoInstanceRef, language, fontSize, templateCode }: CodeEditorProps) => {
    const editorSettings = useCFStore((state) => state.editorSettings);
    const setEditorSettings = useCFStore((state) => state.setEditorSettings);
    const { getEditorSettings } = useEditorSettings(editorSettings, setEditorSettings);
    const editorRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const loadThemes = async () => {
            for (const [themeKey, themeName] of Object.entries(themesJSON)) {
                try {
                    const themeData = await import(`../../../../themes/${themeName}.json`);
                    if (monaco) {
                        monaco.editor.defineTheme(themeKey, themeData.default);
                        // console.log(`Theme ${themeKey} loaded.`);
                    }
                } catch (error) {
                    // console.error(`Failed to load theme ${themeKey}:`, error);
                }
            }

            if (editorRef.current && !monacoInstanceRef.current) {
                const editorSettings:EditorSettingsTypes = getEditorSettings();
                monacoInstanceRef.current = monaco.editor.create(editorRef.current, {
                    language: language,
                    theme: editorSettings.theme,
                    fontSize: fontSize,
                    tabSize: editorSettings.indentSize,
                    automaticLayout: true,
                    readOnly: false,
                    wordWrap: editorSettings.lineWrapping ? 'on' : 'off',
                    minimap: {
                        enabled: editorSettings.minimap
                    },
                    lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
                    suggestOnTriggerCharacters: editorSettings.autoSuggestions,
                    quickSuggestions: editorSettings.autoSuggestions,
                });

                if (templateCode) {
                    monacoInstanceRef.current.setValue(templateCode);
                }
            }
        };

        loadThemes();

        return () => {
            if (monacoInstanceRef.current) {
                monacoInstanceRef.current.dispose();
                monacoInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className={`flex flex-col h-full w-full`}>
            <div className='h-full w-full z-0' ref={editorRef} style={editorStyle}></div>
        </div>
    );
}

export default CodeEditor;