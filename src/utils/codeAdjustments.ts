interface LanguageCodeFixProps {
    code: string;
    language: string;
}
export function adjustCodeForJudge0({ code, language }: LanguageCodeFixProps): string {
    switch (language) {
        case 'java':
            return adjustJavaCode(code);
        case 'cpp':
        case 'c':
            return code;
        case 'python':
            return adjustPythonCode(code);
        case 'javascript':
            return code;
        case 'kotlin':
            return code;
        case 'go':
            return code;
        case 'rust':
            return code;
        case 'ruby':
            return code;
        default:
            return code;
    }
}

function adjustJavaCode(code: string): string {
    const mainClassRegex = /class\s+\w+/;
    const modifiedCode = code.replace(mainClassRegex, 'class Main');

    return modifiedCode;
}
function adjustPythonCode(code: string): string {
    const mainGuardRegex = /if\s+__name__\s*==\s*['"]__main__['"]\s*:/;
    if (!mainGuardRegex.test(code)) {
        if (!/def\s+main\s*\(/.test(code)) {
            code = `def main():\n    ${code.replace(/\n/g, '\n    ')}`;
        }
        return `${code}\n\nif __name__ == "__main__":\n    main()`;
    }
    return code;
}

