using System;
using System.Collections.Generic;
using System.Text;

namespace OOPMentor.Application.Auth
{
    public sealed record RegisterRequest(string Email, string DisplayName, string Password);
}
