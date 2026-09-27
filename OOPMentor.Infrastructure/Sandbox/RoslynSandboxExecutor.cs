using System.Diagnostics;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.Extensions.Configuration;
using OOPMentor.Application.Sandbox;

namespace OOPMentor.Infrastructure.Sandbox
{
    public class RoslynSandboxExecutor : ICodeSandBox
    {
        private readonly IConfiguration _configuration;

        public RoslynSandboxExecutor(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<SandboxExecutionResult> ExecuteAsync(string sourceCode, CancellationToken cancellationToken)
        {
            var stopwatch = Stopwatch.StartNew();

            int maxLength = _configuration.GetValue<int?>("Sandbox:MaxSourceCodeLength") ?? 20000;
            if (sourceCode.Length > maxLength)
            {
                return new SandboxExecutionResult(
                    Success: false,
                    ConsoleOutput: Array.Empty<string>(),
                    FinalState: Array.Empty<SandboxObjectState>(),
                    CompilationDiagnostics: new[] { $"Source code exceeds the maximum allowed length of {maxLength} characters." },
                    ExecutionTimeMs: 0);
            }

            var syntaxTree = CSharpSyntaxTree.ParseText(sourceCode);
            var violations = CodeSecurityAnalyzer.FindViolations(syntaxTree);
            if (violations.Count > 0)
            {
                return new SandboxExecutionResult(
                    Success: false,
                    ConsoleOutput: Array.Empty<string>(),
                    FinalState: Array.Empty<SandboxObjectState>(),
                    CompilationDiagnostics: violations,
                    ExecutionTimeMs: 0);
            }

            int maxMilliseconds = _configuration.GetValue<int?>("Sandbox:MaxExecutionMilliseconds") ?? 5000;
            using var timeoutCts = new CancellationTokenSource(maxMilliseconds);
            using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, timeoutCts.Token);

            var scriptOptions = ScriptOptions.Default
                .WithReferences(
                    typeof(object).Assembly,
                    typeof(Console).Assembly,
                    typeof(Enumerable).Assembly,
                    typeof(List<>).Assembly)
                .WithImports("System", "System.Collections.Generic", "System.Linq");

            var originalOut = Console.Out;
            var consoleWriter = new StringWriter();
            Console.SetOut(consoleWriter);

            try
            {
                ScriptState<object> state = await CSharpScript.RunAsync(
                    sourceCode,
                    scriptOptions,
                    cancellationToken: linkedCts.Token);

                stopwatch.Stop();

                return new SandboxExecutionResult(
                    Success: true,
                    ConsoleOutput: ReadConsoleLines(consoleWriter),
                    FinalState: ExtractObjectState(state),
                    CompilationDiagnostics: Array.Empty<string>(),
                    ExecutionTimeMs: stopwatch.ElapsedMilliseconds);
            }
            catch (CompilationErrorException ex)
            {
                stopwatch.Stop();
                return new SandboxExecutionResult(
                    Success: false,
                    ConsoleOutput: ReadConsoleLines(consoleWriter),
                    FinalState: Array.Empty<SandboxObjectState>(),
                    CompilationDiagnostics: ex.Diagnostics.Select(d => d.ToString()).ToList(),
                    ExecutionTimeMs: stopwatch.ElapsedMilliseconds);
            }
            catch (OperationCanceledException)
            {
                stopwatch.Stop();
                return new SandboxExecutionResult(
                    Success: false,
                    ConsoleOutput: ReadConsoleLines(consoleWriter),
                    FinalState: Array.Empty<SandboxObjectState>(),
                    CompilationDiagnostics: new[] { $"Execution exceeded the maximum allowed time of {maxMilliseconds}ms and was terminated." },
                    ExecutionTimeMs: stopwatch.ElapsedMilliseconds);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                return new SandboxExecutionResult(
                    Success: false,
                    ConsoleOutput: ReadConsoleLines(consoleWriter),
                    FinalState: Array.Empty<SandboxObjectState>(),
                    CompilationDiagnostics: new[] { ex.Message },
                    ExecutionTimeMs: stopwatch.ElapsedMilliseconds);
            }
            finally
            {
                Console.SetOut(originalOut);
            }
        }

        private static IReadOnlyList<string> ReadConsoleLines(StringWriter writer)
        {
            string text = writer.ToString();
            return text
                .Split(Environment.NewLine, StringSplitOptions.RemoveEmptyEntries)
                .ToList();
        }

        private static IReadOnlyList<SandboxObjectState> ExtractObjectState(ScriptState<object> state)
        {
            var objects = new List<SandboxObjectState>();

            foreach (var variable in state.Variables)
            {
                var type = variable.Type;
                if (type is null || type.IsPrimitive || type == typeof(string) || type == typeof(decimal))
                {
                    continue;
                }

                var properties = new Dictionary<string, string?>();
                foreach (var property in type.GetProperties())
                {
                    if (property.GetIndexParameters().Length > 0)
                    {
                        continue;
                    }

                    try
                    {
                        var value = property.GetValue(variable.Value);
                        properties[property.Name] = value?.ToString();
                    }
                    catch
                    {
                        properties[property.Name] = null;
                    }
                }

                objects.Add(new SandboxObjectState(variable.Name, type.Name, properties));
            }

            return objects;
        }
    }
}
