using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class WorkoutItemResponseDto
    {
        public string ExerciseName { get; set; }

        public int DurationMinutes { get; set; }

        public int CaloriesBurnPerMinute
        { get; set; }

        public int TotalCaloriesBurned
        { get; set; }
    }
}
