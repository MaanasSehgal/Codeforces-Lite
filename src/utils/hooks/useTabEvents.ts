import { useCFStore } from '../../zustand/useCFStore';
import { getSlug, getCodeMap } from '../helper';
import { saveCodeForSlug, saveTestCaseForSlug } from '../services/storageService';
import { loadCodeWithCursor } from '../codeHandlers';
import { accessRestrictionMessage } from '../../data/constants';
import { useTestCases } from './useTestCases';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const useTabEvents = () => {
    const setCurrentUrl = useCFStore(state => state.setCurrentUrl);
    const currentSlug = useCFStore(state => state.currentSlug);
    const setCurrentSlug = useCFStore(state => state.setCurrentSlug);
    const testCases = useCFStore(state => state.testCases);
    const { loadTestCases } = useTestCases();

    const handleTabEvents = async (
        message: any,
        _sender: any,
        sendResponse: (response: any) => void,
        editor: monaco.editor.IStandaloneCodeEditor | null
    ) => {
        try {
            if (
                message.type === 'TAB_SWITCH' ||
                message.type === 'TAB_UPDATED' ||
                message.type === 'WINDOW_FOCUSED' ||
                message.type === 'USER_RETURNED'
            ) {
                const newUrl = message.url;
                setCurrentUrl(newUrl);

                if (currentSlug) {
                    await saveCodeForSlug(currentSlug, editor, useCFStore.getState().totalSize, useCFStore.getState().setTotalSize);
                    if (testCases && testCases.testCases.length > 0) {
                        await saveTestCaseForSlug(currentSlug, testCases);
                    }
                }

                const newSlug = getSlug(newUrl);
                setCurrentSlug(newSlug);

                if (newSlug) {
                    let codeForUrl = getCodeMap().get(newSlug)?.code || '';
                    codeForUrl = codeForUrl === '' ? localStorage.getItem('template') || '' : codeForUrl;

                    if (editor) {
                        // console.log('Loading code with cursor:', codeForUrl);
                        loadCodeWithCursor(editor, codeForUrl);
                    }
                    loadTestCases({ slug: newSlug });
                } else if (editor) {
                    loadCodeWithCursor(editor, accessRestrictionMessage);
                }

                sendResponse({ status: 'success', message: 'Tab event handled successfully' });
            } else {
                sendResponse({ status: 'error', message: 'Unhandled message type' });
            }
        } catch (error) {
            sendResponse({ status: 'error', message: 'Error handling tab event' });
        }
        return true;
    };
    return { handleTabEvents };
};
