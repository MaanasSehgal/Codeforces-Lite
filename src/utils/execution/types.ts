export type ExecutionParams = {
    code: string;
    language: string;
    inputs: string[];
    timeLimit: number;
};

export type ExecutionResult = {
    outputs: string[];
    time?: string[];
    memory?: string[];
    errorMessage?: string;
};
