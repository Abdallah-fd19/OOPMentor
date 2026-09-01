using System;
using System.Collections.Generic;
using System.Text;

namespace OOPMentor.Application.Auth
{
    public sealed record AuthResponse(string AccessToken, string RefreshToken, string Email, string DisplayName);
    
}
