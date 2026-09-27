using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace OOPMentor.Infrastructure.Sandbox
{
    // Reads student code and finds anything from a list of forbidden
    // namespaces, before that code is ever compiled or run.
    public static class CodeSecurityAnalyzer
    {
        private static readonly string[] DeniedNamespaces =
        {
            "System.IO",
            "System.Net",
            "System.Diagnostics",
            "System.Reflection",
            "System.Runtime.InteropServices",
            "System.Threading",
            "Microsoft.Win32",
        };

        public static IReadOnlyList<string> FindViolations(SyntaxTree syntaxTree)
        {
            var violations = new List<string>();
            var root = syntaxTree.GetRoot();

            foreach (var usingDirective in root.DescendantNodes().OfType<UsingDirectiveSyntax>())
            {
                string name = usingDirective.Name?.ToString() ?? string.Empty;
                if (IsDenied(name))
                {
                    violations.Add($"The namespace '{name}' is not allowed.");
                }
            }

            foreach (var memberAccess in root.DescendantNodes().OfType<MemberAccessExpressionSyntax>())
            {
                string text = memberAccess.ToString();
                foreach (var denied in DeniedNamespaces)
                {
                    if (text.StartsWith(denied + ".", StringComparison.Ordinal))
                    {
                        violations.Add($"Using '{denied}' directly is not allowed.");
                    }
                }
            }

            if (root.DescendantTokens().Any(token => token.IsKind(SyntaxKind.UnsafeKeyword)))
            {
                violations.Add("Unsafe code is not allowed.");
            }

            return  violations.Distinct().ToList();
        }

        private static bool IsDenied(string namespaceName)
        {
            foreach (var denied in DeniedNamespaces)
            {
                if (namespaceName == denied || namespaceName.StartsWith(denied + ".", StringComparison.Ordinal))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
