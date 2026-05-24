using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Domain.Entities
{
    public class MealItem
    {
        public Guid Id { get; set; }

        public Guid MealPlanId { get; set; }

        public Guid FoodId { get; set; }

        public int Quantity { get; set; }

        public MealPlan MealPlan { get; set; }

        public Food Food { get; set; }
    }
}
