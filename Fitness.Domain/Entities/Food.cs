using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Domain.Entities
{
    public class Food
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Calories { get; set; }

        public double Protein { get; set; }

        public double Carbs { get; set; }

        public double Fat { get; set; }
        public ICollection<MealItem> MealItems { get; set; }
            = new List<MealItem>();
    }
}
