import { useCFStore } from '../../zustand/useCFStore';
import { getValueFromLanguage } from '../helper';
import { loadCodeWithCursor } from '../codeHandlers';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { browserAPI } from '../browser/browserDetect';

export const useCodeManagement = (monacoInstanceRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>) => {
    const setLanguage = useCFStore(state => state.setLanguage);
    const setFontSize = useCFStore(state => state.setFontSize);
    const currentSlug = useCFStore(state => state.currentSlug);

    const handleResetCode = () => {
        if (!currentSlug) {
            return;
        }
        const temmplateCode = localStorage.getItem('template') || '';
        loadCodeWithCursor(monacoInstanceRef.current, temmplateCode);
    };

    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        localStorage.setItem('preferredLanguage', selectedLanguage);
        const languageValue = getValueFromLanguage(selectedLanguage);

        let [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
        browserAPI.scripting.executeScript(
            {
                target: { tabId: tab.id! },
                func: (languageValue) => {
                    const languageSelect = document.querySelector('select[name="programTypeId"]') as HTMLSelectElement;
                    if (languageSelect) {
                        languageSelect.value = languageValue;
                        const event = new Event('change', { bubbles: true });
                        languageSelect.dispatchEvent(event);
                    }
                },
                args: [languageValue],
            },
            () => browserAPI.runtime.lastError
        );
        if (monaco) {
            monaco.editor.getEditors().forEach(editor => {
                const model = editor.getModel();
                if (model) {
                    monaco.editor.setModelLanguage(model, selectedLanguage);
                }
            });
        }

    };

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFontSize = parseInt(e.target.value, 10);
        setFontSize(selectedFontSize);
        localStorage.setItem('preferredFontSize', selectedFontSize.toString());
        if (monaco) {
            monaco.editor.getEditors().forEach(editor => {
                editor.updateOptions({
                    fontSize: selectedFontSize,
                });
            });
        }
    };

    const handleRedirectToLatestSubmission = async () => {
        if (!currentSlug) {
            return;
        }
        let [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });

        browserAPI.scripting.executeScript(
            {
                target: { tabId: tab.id! },
                func: () => {
                    const anchor = document.querySelector('.roundbox.sidebox .rtable tbody tr td a') as HTMLAnchorElement;
                    if (!anchor) {
                        alert('No submission found');
                        return;
                    }
                    if (anchor) {
                        window.location.href = anchor.href;
                    }
                },
            },
            () => {
                if (browserAPI.runtime.lastError) {
                    console.error(browserAPI.runtime.lastError.message);
                }
            }
        );
    };


    return {
        handleResetCode,
        handleLanguageChange,
        handleFontSizeChange,
        handleRedirectToLatestSubmission
    };
};