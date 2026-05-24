using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Domain.Entities
{
    public class WorkoutItem
    {
        public Guid Id { get; set; }

        public Guid WorkoutPlanId { get; set; }

        public Guid ExerciseId { get; set; }

        public int DurationMinutes { get; set; }

        public WorkoutPlan WorkoutPlan { get; set; }

        public Exercise Exercise { get; set; }
    }
}
