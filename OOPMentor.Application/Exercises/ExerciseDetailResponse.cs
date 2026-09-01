using System;
using System.Collections.Generic;
using System.Text;

namespace OOPMentor.Application.Exercises
{
    public sealed record ExerciseDetailResponse
    (
        Guid Id,
        int ModuleNumber,
        string Title,
        string Description,
        string StarterCode,
        byte DifficultyLevel,
        ExerciseProgressResponse? Progress
    );

    public sealed record ExerciseProgressResponse
    (
    string Status,
    int AttemptsCount,
    int HintsUsedCount,
    bool IsCompleted,
    string? LastSubmittedCode
    );

}
