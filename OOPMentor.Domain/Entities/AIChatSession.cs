namespace OOPMentor.Domain.Entities;

public class AIChatSession
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? ExerciseId { get; set; }
    public Exercise? Exercise { get; set; } 

    public string Title { get; set; } = "New Conversation";
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }

    public ICollection<AIChatMessage> Messages { get; set; } = new List<AIChatMessage>();
}
