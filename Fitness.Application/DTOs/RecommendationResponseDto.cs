using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.DTOs
{
    public class RecommendationResponseDto
    {
        public string Goal { get; set; }

        public double Bmi { get; set; }

        public string Status { get; set; }

        public string Reason { get; set; }

        public List<FoodRecommendationDto>
            RecommendedFoods
        { get; set; }

        public List<ExerciseRecommendationDto>
            RecommendedExercises
        { get; set; }
    }
}
