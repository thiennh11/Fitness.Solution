using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Domain.Entities
{
    public class WorkoutPlan
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public DateTime Date { get; set; }

        public ICollection<WorkoutItem> WorkoutItems
        { get; set; }
            = new List<WorkoutItem>();
    }
}
