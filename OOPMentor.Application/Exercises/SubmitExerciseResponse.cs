namespace OOPMentor.Application.Exercises
{
    public sealed record SubmitExerciseRequest(string SourceCode);

    public sealed record SubmitExerciseResponse
    (
        bool IsCorrect,
        IReadOnlyList<string> ConsoleOutput,
        IReadOnlyList<string> CompilationDiagnostics,
        SubmitProgressResponse Progress
    );

    public sealed record SubmitProgressResponse
    (
        string Status,
        int AttemptsCount,
        bool IsCompleted,
        DateTime? CompletedAtUtc
    );
}
