import { toast } from "sonner";
import { clearSavedCode } from "./storage/codeStorage";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { CPP_BOILERPLATES, DEFAULT_CPP_BOILERPLATE_ID, getCppBoilerplateById } from "src/data/constants";

export const deleteCodesFromLocalStorage = () => {
  try {
    clearSavedCode();
    toast.success("Codes deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete codes! Please try again later.");
  }
};

export const getSelectedBoilerplateId = () => {
  const saved = localStorage.getItem("selectedBoilerplateId");
  return saved && CPP_BOILERPLATES.some((template) => template.id === saved)
    ? saved
    : DEFAULT_CPP_BOILERPLATE_ID;
};

export const applyBoilerplateToEditor = (
  editor: monaco.editor.IStandaloneCodeEditor | null,
  boilerplateId?: string
) => {
  if (!editor) {
    toast.error("Editor not found!");
    return;
  }

  const templateId = boilerplateId ?? getSelectedBoilerplateId();
  const selectedTemplate = getCppBoilerplateById(templateId);

  localStorage.setItem("selectedBoilerplateId", selectedTemplate.id);
  localStorage.setItem("template", selectedTemplate.code);
  editor.setValue(selectedTemplate.code);
  toast.success(`Applied boilerplate: ${selectedTemplate.label}`);
};

export const handleSaveTemplate = (editor: monaco.editor.IStandaloneCodeEditor | null) => {
  if (!editor) {
    toast.error("Editor not found!");
    return;
  }
  const editorValue = editor.getValue();
  localStorage.setItem("template", editorValue);
  localStorage.setItem("selectedBoilerplateId", "custom");
  toast.success("Saved successfully!");
};
