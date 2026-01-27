import { ExecutionParams, ExecutionResult } from './types';

async function checkLocalServer(port: number): Promise<boolean> {
    try {
        const res = await fetch(`http://localhost:${port}/health`, {
            method: 'GET',
        });
        return res.ok;
    } catch {
        return false;
    }
}

export async function executeLocal(
    params: ExecutionParams,
    signal?: AbortSignal
): Promise<ExecutionResult> {
    const port = Number(localStorage.getItem('localRunnerPort')) || 5000;

    const isAlive = await checkLocalServer(port);

    if (!isAlive) {
        return {
            errorMessage: `Local runner is not reachable on port ${port}.

Make sure the local server is running:
python3 server.py`,
            outputs: [],
        };
    }

    const res = await fetch(`http://localhost:${port}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal,
    });

    if (!res.ok) {
        return {
            errorMessage: `Local runner returned an error (HTTP ${res.status})`,
            outputs: [],
        };
    }

    const data = await res.json();

    if (data.compile_error) {
        return {
            errorMessage: data.compile_error,
            outputs: [],
        };
    }

    return {
        outputs: data.results.map((r: any) => r.stdout || r.stderr || ''),
        time: data.results.map((r: any) => r.time || '0'),
        memory: [],
    };
}
