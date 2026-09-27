
namespace OOPMentor.Application.Sandbox
{

    public sealed record SandboxExecutionResult
    (
        // did the code run without errors
        bool Success,
        IReadOnlyList<string> ConsoleOutput,
        // every line printed with Console.WriteLine
        IReadOnlyList<SandboxObjectState> FinalState,
        // error messages, if something went wrong
        IReadOnlyList<string> CompilationDiagnostics,
        // how long it took to execute the code
        long ExecutionTimeMs
    );

    public sealed record SandboxObjectState
    (
        string InstanceName,
        string TypeName,
        IReadOnlyDictionary<string, string?> Properties
    );

    

}