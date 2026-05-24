using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class CreateWorkoutPlanDto
    {
        public Guid UserId { get; set; }

        public DateTime Date { get; set; }

        public List<CreateWorkoutItemDto> Items { get; set; }
            = new();
    }
}
