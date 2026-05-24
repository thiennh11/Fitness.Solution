using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class CreateWorkoutItemDto
    {
        public Guid ExerciseId { get; set; }

        public int DurationMinutes { get; set; }
    }
}
