using Fitness.Application.DTOs;
using Fitness.Application.Interfaces;
using Fitness.Application.Services;

namespace Fitness.Infrastructure.Services
{
    public class RecommendationService: IRecommendationService
    {
        private readonly IUserRepository
            _userRepository;

        private readonly IFoodRepository
            _foodRepository;

        private readonly IExerciseRepository
            _exerciseRepository;

        public RecommendationService(
            IUserRepository userRepository,
            IFoodRepository foodRepository,
            IExerciseRepository exerciseRepository)
        {
            _userRepository =
                userRepository;

            _foodRepository =
                foodRepository;

            _exerciseRepository =
                exerciseRepository;
        }

        public async Task<RecommendationResponseDto>
            GetRecommendationsAsync(
                Guid userId,
                string goal)
        {
            // USER

            var user =
                await _userRepository
                    .GetByIdAsync(userId);

            if (user == null)
                return null;

            // BMI

            var heightInMeters =
                user.Height / 100.0;

            var bmi =
                user.Weight /
                (heightInMeters * heightInMeters);

            // DATA

            var allFoods =
                await _foodRepository
                    .GetAllAsync();

            var allExercises =
                await _exerciseRepository
                    .GetAllAsync();

            // FILTER

            IEnumerable<Fitness.Domain.Entities.Food>
                filteredFoods;

            IEnumerable<Fitness.Domain.Entities.Exercise>
                filteredExercises;

            string reason;

            // LOSE WEIGHT

            if (goal == "LoseWeight")
            {
                filteredFoods =
                    allFoods
                        .Where(f =>
                            f.Calories < 200 &&
                            f.Fat < 8)
                        .OrderBy(f => f.Calories)
                        .Take(5);

                filteredExercises =
                    allExercises
                        .Where(e =>
                            e.CaloriesBurnPerMinute >= 8)
                        .OrderByDescending(e =>
                            e.CaloriesBurnPerMinute)
                        .Take(5);

                reason =
                    "Low calorie foods and cardio exercises recommended for weight loss.";
            }

            // GAIN MUSCLE

            else if (goal == "GainMuscle")
            {
                filteredFoods =
                    allFoods
                        .OrderByDescending(f =>
                            f.Protein)
                        .Take(5);

                filteredExercises =
                    allExercises
                        .Where(e =>
                            e.CaloriesBurnPerMinute <= 10)
                        .Take(5);

                reason =
                    "High protein foods and strength exercises recommended for muscle gain.";
            }

            // MAINTAIN

            else
            {
                filteredFoods =
                    allFoods
                        .Where(f =>
                            f.Calories >= 100 &&
                            f.Calories <= 300)
                        .Take(5);

                filteredExercises =
                    allExercises
                        .Take(5);

                reason =
                    "Balanced foods and exercises recommended for maintaining health.";
            }

            // RESPONSE

            return new RecommendationResponseDto
            {
                Goal = goal,

                Bmi = Math.Round(bmi, 2),

                Status = GetBmiStatus(bmi),

                Reason = reason,

                RecommendedFoods =
                    filteredFoods
                        .Select(f =>
                            new FoodRecommendationDto
                            {
                                Name = f.Name,
                                Calories = f.Calories,
                                Protein = f.Protein,
                                Carbs = f.Carbs,
                                Fat = f.Fat
                            })
                        .ToList(),

                RecommendedExercises =
                    filteredExercises
                        .Select(e =>
                            new ExerciseRecommendationDto
                            {
                                Name = e.Name,

                                CaloriesBurnPerMinute =
                                    e.CaloriesBurnPerMinute
                            })
                        .ToList()
            };
        }

        // BMI STATUS

        private string GetBmiStatus(
            double bmi)
        {
            if (bmi < 18.5)
                return "Underweight";

            if (bmi < 25)
                return "Normal";

            if (bmi < 30)
                return "Overweight";

            return "Obese";
        }
    }
}