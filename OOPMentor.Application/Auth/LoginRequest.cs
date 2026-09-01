using System;
using System.Collections.Generic;
using System.Text;

namespace OOPMentor.Application.Auth
{
    public sealed record LoginRequest(string Email, string Password);
    
}
