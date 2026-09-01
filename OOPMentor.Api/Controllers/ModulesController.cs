using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OOPMentor.Application.Common;
using OOPMentor.Application.Exercises;
using OOPMentor.Infrastructure.Persistence;

namespace OOPMentor.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ModulesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ModulesController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetModules()
        {
            Guid userId = Guid.Parse(User.FindFirst(JwtRegisteredClaimNames.Sub)!.Value);

            var exerciseCounts = await _db.Exercises
                .GroupBy(e => e.ModuleNumber)
                .Select(g => new { ModuleNumber = g.Key, ExerciseCount = g.Count() })
                .ToListAsync();
            

            var completedCounts = await _db.UserProgress
                .Where(p => p.UserId == userId && p.IsCompleted)
                .GroupBy(p => p.Exercise.ModuleNumber)
                .Select(g => new { ModuleNumber = g.Key, CompletedCount = g.Count() })
                .ToListAsync();

            var modules = exerciseCounts
                .Select(m => new ModuleSummaryResponse(
                    m.ModuleNumber,
                    m.ExerciseCount,
                    completedCounts.FirstOrDefault(c => c.ModuleNumber == m.ModuleNumber)?.CompletedCount ?? 0))
                .OrderBy(m => m.ModuleNumber)
                .ToList();            
            
            return Ok(Result<List<ModuleSummaryResponse>>.Ok(modules));
        }
    }
}
