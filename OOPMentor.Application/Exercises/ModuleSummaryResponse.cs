namespace OOPMentor.Application.Exercises;

public sealed record ModuleSummaryResponse(
    int ModuleNumber,
    int ExerciseCount,
    int CompletedCount);
