using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; }

        public string Email { get; set; }
        public string Gender { get; set; }

        public string Password { get; set; }

        public double Weight { get; set; }

        public double Height { get; set; }

        public int Age { get; set; }
        public string Role { get; set; } = "User";
    }
}
