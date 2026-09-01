using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OOPMentor.Domain.Entities;

namespace OOPMentor.Infrastructure.Persistence.Configurations;

public sealed class ExerciseConfiguration : IEntityTypeConfiguration<Exercise>
{
    public void Configure(EntityTypeBuilder<Exercise> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Description)
            .IsRequired();

        builder.Property(e => e.StarterCode)
            .IsRequired();

        builder.Property(e => e.SolutionCode)
            .IsRequired();

        builder.Property(e => e.DifficultyLevel)
            .HasDefaultValue((byte)1);

        builder.Property(e => e.CreatedAtUtc)
            .HasDefaultValueSql("SYSUTCDATETIME()");

        builder.ToTable(t => t.HasCheckConstraint(
            "CK_Exercises_Difficulty",
            "[DifficultyLevel] BETWEEN 1 AND 3"));
    }
}
