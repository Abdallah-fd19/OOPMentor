using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OOPMentor.Application.Auth;
using OOPMentor.Application.Common;
using OOPMentor.Domain.Entities;
using OOPMentor.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace OOPMentor.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IJwtTokenGenerator _tokenGenerator;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public AuthController(ApplicationDbContext db, IJwtTokenGenerator tokenGenerator)
        {
            _db = db;
            _tokenGenerator = tokenGenerator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            bool emailTaken = _db.Users.Any(u => u.Email == request.Email);

            if (emailTaken)
            {
                return BadRequest(Result<AuthResponse>.Fail("Email already in use."));
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                DisplayName = request.DisplayName,
                CreatedAtUtc = DateTime.UtcNow,
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();          

            var response = await IssueTokensAsync(user);

            return Ok(Result<AuthResponse>.Ok(response, "Registered successfully."));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == request.Email);
            if(user is null)
            {
                return Unauthorized(Result<AuthResponse>.Fail("Invalid email."));
            }

            var verifyResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if(verifyResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized(Result<AuthResponse>.Fail("Invalid password."));
            }

            user.LastLoginAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            
            var response = await IssueTokensAsync(user);

            return Ok(Result<AuthResponse>.Ok(response, "Login successful."));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshTokenValue))
            {
                return Unauthorized(Result<AuthResponse>.Fail("No refresh token provided."));
            }

            var existingToken = await _db.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue);

            if (existingToken is null || existingToken.IsRevoked || existingToken.ExpiresAtUtc < DateTime.UtcNow)
            {
                return Unauthorized(Result<AuthResponse>.Fail("Invalid or expired refresh token."));
            }

            existingToken.IsRevoked = true;

            var response = await IssueTokensAsync(existingToken.User);
            return Ok(Result<AuthResponse>.Ok(response, "Token refreshed."));
        }

        private async Task<AuthResponse> IssueTokensAsync(User user)
        {
            string accessToken = _tokenGenerator.GenerateToken(user);

            var refreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                Token = GenerateSecureRandomToken(),
                UserId = user.Id,
                ExpiresAtUtc = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                CreatedAtUtc = DateTime.UtcNow
            };

            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = refreshToken.ExpiresAtUtc
            });

            return new AuthResponse(accessToken, user.Email, user.DisplayName);
        }

        private static string GenerateSecureRandomToken()
        {
            byte[] bytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytes);
        }

    }
}
