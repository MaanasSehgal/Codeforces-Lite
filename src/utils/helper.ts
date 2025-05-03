import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useEditorSettings } from './hooks/useEditorSettings';
const { getEditorSettings } = useEditorSettings(useCFStore.getState().editorSettings, useCFStore.getState().setEditorSettings);

import { CodeEntry, TestCaseArray } from "../types/types";
import { Queue } from "./Queue";
import { toast } from 'sonner';
import { useCFStore } from '../zustand/useCFStore';

// In-memory storage for Map and Queue
let testCaseMap: Map<string, TestCaseArray> = new Map<string, TestCaseArray>();
let testCaseQueue: Queue<string> = new Queue<string>();

export const getTestCaseMap = (): Map<string, TestCaseArray> => {
    return testCaseMap;
};

export const getTestCaseQueue = (): Queue<string> => {
    return testCaseQueue;
};


export const getCodeMap = (): Map<string, CodeEntry> => {
    const storedCodeMap = localStorage.getItem("codeMap");
    return storedCodeMap ? new Map<string, CodeEntry>(JSON.parse(storedCodeMap)) : new Map<string, CodeEntry>();
};

export const getSlugQueue = (): Queue<string> => {
    const storedQueue = localStorage.getItem("slugQueue");
    return storedQueue ? Queue.fromJSON<string>(JSON.parse(storedQueue)) : new Queue<string>();
};

export const getValueFromLanguage = (language: string) => {
    switch (language) {
        case "cpp":
            return "89";
        case "java":
            return "87";
        case "python":
            return "31";
        case "javascript":
            return "34";
        case "kotlin":
            return "88";
        case 'go':
            return "32";
        case 'rust':
            return "75";
        case 'ruby':
            return "67";
        default:
            return "89";
    }
};

export const getLanguageExtension = (language: string) => {
    if(language) return '.' + language;
    // switch (language) {
    //     case "javascript":
    //         return javascript({ jsx: true });
    //     case "python":
    //         return python();
    //     case "java":
    //         return java();
    //     case "cpp":
    //         return cpp();
    //     default:
    //         return cpp();
    // }
};

export const getSlug = (problemUrl: string): string | null => {
    try {
        const url = new URL(problemUrl);
        url.search = "";
        const hostname = url.hostname;
        let match: RegExpMatchArray | null;

        switch (hostname) {
            case "codeforces.com":
            case "www.codeforces.com":
                match = url.toString().match(/\/problemset\/problem\/([0-9]+)\/([^\/]+)|\/contest\/([0-9]+)\/problem\/([^\/]+)|\/gym\/([0-9]+)\/problem\/([^\/]+)/);

                if (match) {
                    if (match[1] && match[2]) {
                        // /problemset/problem/2030/A
                        return `${match[1]}/${match[2]}`;
                    } else if (match[3] && match[4]) {
                        // /contest/2030/problem/A
                        return `${match[3]}/${match[4]}`;
                    } else if (match[5] && match[6]) {
                        // /gym/105846/problem/A
                        return `${match[5]}/${match[6]}`;
                    }
                }
                return null;
            default:
                return null;
        }
    } catch (error) {
        return null;
    }
};

const getLangForBeautify = (language: string) => {
    switch (language) {
        case "cpp":
            return "c++";
        case "java":
            return "java";
        case "python":
            return "python";
        case "javascript":
            return "js_node";
        case "kotlin":
            return "kotlin";
        case 'go':
            return 'go';
        case 'rust':
            return 'rust';
        case 'ruby':
            return 'ruby';
        default:
            return "c++";
    }
}

export const formatCode = async (monacoInstanceRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>, language: string, setIsFormatting?: (isFormatting: boolean) => void) => {
    if (!monacoInstanceRef.current) return;
    const editorSettings = getEditorSettings();
    
    try {
        setIsFormatting && setIsFormatting(true);
        const currentCode = monacoInstanceRef.current.getValue();
        
        const response = await fetch('https://www.onlinegdb.com/beautify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                src: currentCode,
                lang: getLangForBeautify(language),
                ts: editorSettings.indentSize,
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to format code: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.src) {
            monacoInstanceRef.current.setValue(result.src);
        }
    } catch (error) {
        toast.error(`Something went wrong. Please try again later.`);
    } finally {
        setIsFormatting && setIsFormatting(false);
    }
};
