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
    public class ExercisesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ExercisesController(ApplicationDbContext db) 
        {
            _db = db;
        }

        // Gets a single exercise progress and detail for that user
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var exercise = await _db.Exercises.FirstOrDefaultAsync(e => e.Id == id);
            if(exercise is null)
            {
                return NotFound(Result<ExerciseDetailResponse>.Fail("Exercise not found.", "ExerciseNotFound"));                    
            }

            Guid userId = Guid.Parse(User.FindFirst(JwtRegisteredClaimNames.Sub)!.Value);

            var progress = await _db.UserProgress.FirstOrDefaultAsync(p => p.ExerciseId == id && p.UserId == userId);

            ExerciseProgressResponse? progressResponse = progress is null ? null : 
                new ExerciseProgressResponse(
                    progress.Status.ToString(),
                    progress.AttemptsCount, 
                    progress.HintsUsedCount,
                    progress.IsCompleted, 
                    progress.LastSubmittedCode
                    );

            var response = new ExerciseDetailResponse(
                exercise.Id,
                exercise.ModuleNumber,
                exercise.Title,
                exercise.Description,
                exercise.StarterCode,
                exercise.DifficultyLevel,
                progressResponse
                );
            return Ok(Result<ExerciseDetailResponse>.Ok(response));
        }

    }
}
