namespace OOPMentor.Domain.Entities;

public class AIChatMessage
{
    public Guid Id { get; set; }

    public Guid SessionId { get; set; }
    public AIChatSession Session { get; set; } = null!;

    public ChatRole Role { get; set; }
    public string Content { get; set; } = string.Empty;
    public int? HintLevel { get; set; }
    public int? TokensUsed { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
