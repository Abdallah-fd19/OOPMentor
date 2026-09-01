using OOPMentor.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace OOPMentor.Application.Auth
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }
}
