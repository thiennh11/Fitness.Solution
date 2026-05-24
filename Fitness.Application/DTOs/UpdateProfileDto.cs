using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class UpdateProfileDto
    {
        public double Weight { get; set; }
        public double Height { get; set; }
        public int Age { get; set; }
    }
}
