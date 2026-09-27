export interface SandboxObjectState {
    instanceName: string;
    typeName: string;
    properties: Record<string, string | null>;
}

export interface SandboxExecutionResult {
    success: boolean;
    consoleOutput: string[];
    finalState: SandboxObjectState[];
    compilationDiagnostics: string[];
    executionTimeMs: number;
}

export interface SandboxRunRequest {
    sourceCode: string;
}
