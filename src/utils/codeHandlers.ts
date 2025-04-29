import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const loadCodeWithCursor = (editor: monaco.editor.IStandaloneCodeEditor | null, code: string) => {
    if (!editor) {
        // console.warn('Wait for the editor to be ready before loading code.');
        return;
    }

    const cursorPosition = code.indexOf('$0');
    
    let cleanedCode = code.replace(/\$0/g, '');

    editor.setValue(cleanedCode);

    if (cursorPosition !== -1) {
        const textBeforeCursor = code.substring(0, cursorPosition);
        const lines = textBeforeCursor.split('\n');
        const lineNumber = lines.length;
        const column = lines[lines.length - 1].length + 1;

        editor.setPosition({
            lineNumber: lineNumber,
            column: column
        });

        editor.focus();

        editor.revealPositionInCenter({
            lineNumber: lineNumber,
            column: column
        });
    }
};
