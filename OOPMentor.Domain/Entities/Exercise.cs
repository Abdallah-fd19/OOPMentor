namespace OOPMentor.Domain.Entities;

public class Exercise
{
    public Guid Id { get; set; }
    public int ModuleNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string StarterCode { get; set; } = string.Empty;
    public string SolutionCode { get; set; } = string.Empty;
    public byte DifficultyLevel { get; set; } = 1;
    public int OrderIndex { get; set; }
    public DateTime CreatedAtUtc { get; set; }

    public ICollection<UserProgress> ProgressRecords { get; set; } = new List<UserProgress>();
    public ICollection<AIChatSession> ChatSessions { get; set; } = new List<AIChatSession>();
}
