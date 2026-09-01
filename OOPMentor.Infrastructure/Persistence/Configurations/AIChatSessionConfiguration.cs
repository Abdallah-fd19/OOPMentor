using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OOPMentor.Domain.Entities;

namespace OOPMentor.Infrastructure.Persistence.Configurations;

public sealed class AIChatSessionConfiguration : IEntityTypeConfiguration<AIChatSession>
{
    public void Configure(EntityTypeBuilder<AIChatSession> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Title)
            .HasMaxLength(200)
            .HasDefaultValue("New Conversation");

        builder.Property(s => s.CreatedAtUtc)
            .HasDefaultValueSql("SYSUTCDATETIME()");

        builder.Property(s => s.UpdatedAtUtc)
            .HasDefaultValueSql("SYSUTCDATETIME()");

        builder.HasOne(s => s.User)
            .WithMany(u => u.ChatSessions)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.Exercise)
            .WithMany(e => e.ChatSessions)
            .HasForeignKey(s => s.ExerciseId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);
    }
}
