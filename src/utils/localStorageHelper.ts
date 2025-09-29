import {toast} from "sonner";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const deleteCodesFromLocalStorage = () => {
    try {
        localStorage.removeItem("slugQueue");
        localStorage.removeItem("codeMap");
        toast.success("Codes deleted successfully!");
    } catch (error) {
        toast.error("Failed to delete codes! Please try again later.");
    }
};

export const handleSaveTemplate = (editor: monaco.editor.IStandaloneCodeEditor | null) => {
    if (!editor) {
        toast.error("Editor not found!");
        return;
    }
    const editorValue = editor.getValue();
    localStorage.setItem("template", editorValue);
    toast.success("Saved successfully!");
};
