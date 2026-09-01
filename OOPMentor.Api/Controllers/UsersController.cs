using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OOPMentor.Application.Common;

namespace OOPMentor.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        [HttpGet("me")]
        public IActionResult Me()
        {
            string? userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            string? email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
            string? role = User.FindFirst(ClaimTypes.Role)?.Value;

            var data = new { userId, email, role };
            return Ok(Result<object>.Ok(data));
        }
    }
}
