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
    lastSubmittedCode: string;
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