using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OOPMentor.Application.Common;
using OOPMentor.Application.Exercises;
using OOPMentor.Application.Sandbox;
using OOPMentor.Infrastructure.Persistence;
using OOPMentor.Domain.Entities;

namespace OOPMentor.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExercisesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ICodeSandBox _codeSandbox;

        public ExercisesController(ApplicationDbContext db, ICodeSandBox codeSandbox) 
        {
            _db = db;
            _codeSandbox = codeSandbox;
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

        [HttpPost("{id:guid}/submit")]
        public async Task<IActionResult> Submit(Guid id, SubmitExerciseRequest request, CancellationToken cancellationToken)
        {
            var exercise = await _db.Exercises.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
            if (exercise is null)
            {
                return NotFound(Result<SubmitExerciseResponse>.Fail("Exercise not found.", "ExerciseNotFound"));
            }

            Guid userId = Guid.Parse(User.FindFirst(JwtRegisteredClaimNames.Sub)!.Value);

            var sandboxResult = await _codeSandbox.ExecuteAsync(request.SourceCode, cancellationToken);

            var progress = await _db.UserProgress.FirstOrDefaultAsync(p => p.ExerciseId == id && p.UserId == userId, cancellationToken);
            if (progress is null)
            {
                progress = new UserProgress
                {
                    UserId = userId,
                    ExerciseId = id,
                    StartedAtUtc = DateTime.UtcNow,
                };
                _db.UserProgress.Add(progress);
            }

            progress.AttemptsCount++;
            progress.LastSubmittedCode = request.SourceCode;
            progress.IsCompleted = sandboxResult.Success;
            progress.Status = sandboxResult.Success ? ProgressStatus.Completed : ProgressStatus.InProgress;
            progress.CompletedAtUtc = sandboxResult.Success ? DateTime.UtcNow : progress.CompletedAtUtc;

            await _db.SaveChangesAsync(cancellationToken);

            var response = new SubmitExerciseResponse(
                sandboxResult.Success,
                sandboxResult.ConsoleOutput,
                sandboxResult.FinalState,
                sandboxResult.CompilationDiagnostics,
                new SubmitProgressResponse(
                    progress.Status.ToString(),
                    progress.AttemptsCount,
                    progress.IsCompleted,
                    progress.CompletedAtUtc));

            return Ok(Result<SubmitExerciseResponse>.Ok(response, "Submission graded."));
        }


    }
}
