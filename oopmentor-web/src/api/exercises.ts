import type { SandboxObjectState } from "./sandbox";

export interface ExerciseSummary{
    id: string;
    title: string;
    difficultyLevel: number;
    orderIndex: number;
    isCompleted: boolean;
}

export interface ExerciseProgress{
    status: string;
    attemptsCount: number;
    hintsUsedCount: number;
    isCompleted: boolean;
    lastSubmittedCode: string | null;
}


export interface ExerciseDetail{
    id: string;
    moduleNumber: number;
    title: string;
    description: string;
    starterCode: string;
    difficultyLevel: number;
    exerciseProgress: ExerciseProgress | null;
}

// api/exercises/exercise:id/submit

export interface SubmitProgress {
    status: string;
    attemptsCount: number;
    isCompleted: boolean;
    completedAtUtc: string | null;
}

export interface SubmitExerciseResponse {
    isCorrect: boolean;
    consoleOutput: string[];
    compilationDiagnostics: string[];
    progress: SubmitProgress;
    finalState: SandboxObjectState[];
}
