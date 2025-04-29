import { CodeEntry, TestCaseArray } from '../../types/types';
import { getCodeMap, getSlugQueue, getTestCaseMap, getTestCaseQueue } from '../helper';
import { MAX_PROBLEM_IO_SIZE, SINGLE_CODE_LIMIT_BYTES, STORAGE_LIMIT_BYTES } from '../../data/constants';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const saveCodeForSlug = async (
    slug: string, 
    editor: monaco.editor.IStandaloneCodeEditor | null,
    totalSize: number,
    setTotalSize: (size: number) => void
) => {
    if (editor) {
        const editorValue = editor.getValue();
        const size = editorValue?.length || 0;

        if (size > SINGLE_CODE_LIMIT_BYTES) {
            alert("Code size exceeds. Please reduce the size of your code.");
            return;
        }

        const codeMap = getCodeMap();
        const slugQueue = getSlugQueue();

        if (!codeMap.has(slug)) {
            slugQueue.add(slug);
        }

        const oldSize = codeMap.get(slug)?.size || 0;
        let newTotalSize = totalSize - oldSize + size;

        while (newTotalSize > STORAGE_LIMIT_BYTES) {
            const oldSlug = slugQueue.remove();
            if (oldSlug) {
                const removedSize = codeMap.get(oldSlug)?.size || 0;
                newTotalSize -= removedSize;
                codeMap.delete(oldSlug);
            }
        }

        setTotalSize(newTotalSize);
        const position = editor.getPosition();
        const cursorPos = position ? editor.getModel()?.getOffsetAt(position) : undefined;
        const codeWithCursor = editorValue.slice(0, cursorPos) + "$0" + editorValue.slice(cursorPos);

        const entry: CodeEntry = {
            code: codeWithCursor!,
            size
        };

        codeMap.set(slug, entry);

        localStorage.setItem('codeMap', JSON.stringify(Array.from(codeMap.entries())));
        localStorage.setItem('slugQueue', slugQueue.toJSON());
    }
};

export const saveTestCaseForSlug = async (slug: string, testCasesToSave: TestCaseArray) => {
    const testCaseMap = getTestCaseMap();
    const testCaseQueue = getTestCaseQueue();

    if (!testCaseMap.has(slug)) {
        testCaseQueue.add(slug);
    }

    testCaseMap.set(slug, testCasesToSave);

    if (testCaseQueue.size() > MAX_PROBLEM_IO_SIZE) {
        const slugToRemove = testCaseQueue.remove();
        if (slugToRemove) {
            testCaseMap.delete(slugToRemove);
        }
    }
};

export const initializeStorage = () => {
    const storedQueue = getCodeMap();
    let size = 0;
    storedQueue.forEach(entry => size += entry.size);
    return size;
};
