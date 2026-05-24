using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class MealItemResponseDto
    {
        public string FoodName { get; set; }

        public int Quantity { get; set; }

        public int Calories { get; set; }

        public double Protein { get; set; }

        public double Carbs { get; set; }

        public double Fat { get; set; }

        public int TotalCalories { get; set; }
    }
}
