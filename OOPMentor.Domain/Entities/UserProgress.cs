namespace OOPMentor.Domain.Entities;

public class UserProgress
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    public ProgressStatus Status { get; set; } = ProgressStatus.NotStarted;
    public int AttemptsCount { get; set; }
    public int HintsUsedCount { get; set; }
    public bool IsCompleted { get; set; }
    public decimal? Score { get; set; }
    public string? LastSubmittedCode { get; set; }
    public DateTime StartedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
}
