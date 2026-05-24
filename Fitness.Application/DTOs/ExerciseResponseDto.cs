using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class ExerciseResponseDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int CaloriesBurnPerMinute { get; set; }
    }
}
