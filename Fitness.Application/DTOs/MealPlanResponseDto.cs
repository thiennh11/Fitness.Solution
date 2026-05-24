using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class MealPlanResponseDto
    {
        public Guid Id { get; set; }

        public DateTime Date { get; set; }

        public List<MealItemResponseDto> Foods { get; set; }
            = new();
        public int TotalCalories { get; set; }

        public double TotalProtein { get; set; }

        public double TotalCarbs { get; set; }

        public double TotalFat { get; set; }
    }
}
