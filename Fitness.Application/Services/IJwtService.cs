using Fitness.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
