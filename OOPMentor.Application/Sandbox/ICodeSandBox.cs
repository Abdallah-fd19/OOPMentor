namespace OOPMentor.Application.Sandbox 
{
    public interface ICodeSandBox
    {
        Task<SandboxExecutionResult> ExecuteAsync(string sourceCode, CancellationToken  cancellationToken);
    }
}
