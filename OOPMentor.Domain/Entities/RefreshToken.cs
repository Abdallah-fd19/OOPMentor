using System;
using System.Collections.Generic;
using System.Text;

namespace OOPMentor.Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public Guid UserId {  get; set; }
        public User User { get; set; } = null!;
        public DateTime ExpiresAtUtc { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAtUtc { get; set; }
    }
}
