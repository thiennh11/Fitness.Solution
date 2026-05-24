using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Domain.Entities
{
    public class Exercise
    {
        public Guid Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public int CaloriesBurnPerMinute { get; set; }

        public ICollection<WorkoutItem> WorkoutItems
        { get; set; }
            = new List<WorkoutItem>();
    }
}
