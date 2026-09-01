using Microsoft.EntityFrameworkCore;
using OOPMentor.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace OOPMentor.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Exercise> Exercises => Set<Exercise>();
        public DbSet<UserProgress> UserProgress => Set<UserProgress>();
        public DbSet<AIChatSession> AIChatSessions => Set<AIChatSession>();
        public DbSet<AIChatMessage> AIChatMessages => Set<AIChatMessage>();

        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}
