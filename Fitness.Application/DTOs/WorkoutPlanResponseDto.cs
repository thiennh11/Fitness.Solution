using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class WorkoutPlanResponseDto
    {
        public Guid Id { get; set; }

        public DateTime Date { get; set; }

        public int TotalCaloriesBurned
        { get; set; }

        public List<WorkoutItemResponseDto> Exercises
        { get; set; }
            = new();
    }
}
