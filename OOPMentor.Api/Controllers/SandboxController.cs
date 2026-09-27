using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OOPMentor.Application.Common;
using OOPMentor.Application.Sandbox;

namespace OOPMentor.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SandboxController : ControllerBase
    {
        private readonly ICodeSandBox _codeSandbox;
        public SandboxController(ICodeSandBox codeSandbox)
        {
            _codeSandbox = codeSandbox;
        }

        [HttpPost("run")]
        public async Task<IActionResult> Run(SandboxRunRequest request, CancellationToken cancellationToken)
        {
            var result = await _codeSandbox.ExecuteAsync(request.SourceCode, cancellationToken);

            if (!result.Success)
            {
                return BadRequest(Result<SandboxExecutionResult>.Fail("Execution failed.", result.CompilationDiagnostics));
            }

            return Ok(Result<SandboxExecutionResult>.Ok(result, "Execution completed successfully."));
        }
    }
}
