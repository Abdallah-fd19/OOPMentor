using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OOPMentor.Domain.Entities;

namespace OOPMentor.Infrastructure.Persistence.Configurations;

public sealed class UserProgressConfiguration : IEntityTypeConfiguration<UserProgress>
{
    public void Configure(EntityTypeBuilder<UserProgress> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(ProgressStatus.NotStarted);

        builder.Property(p => p.Score)
            .HasPrecision(5, 2);

        builder.Property(p => p.StartedAtUtc)
            .HasDefaultValueSql("SYSUTCDATETIME()");

        builder.HasIndex(p => new { p.UserId, p.ExerciseId })
            .IsUnique();

        builder.HasOne(p => p.User)
            .WithMany(u => u.ProgressRecords)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Exercise)
            .WithMany(e => e.ProgressRecords)
            .HasForeignKey(p => p.ExerciseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.ToTable(t => t.HasCheckConstraint(
            "CK_UserProgress_Status",
            "[Status] IN ('NotStarted', 'InProgress', 'Completed')"));
    }
}
