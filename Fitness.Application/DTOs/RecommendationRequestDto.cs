namespace Fitness.Application.DTOs
{
    public class RecommendationRequestDto
    {
        // "LoseWeight" | "Maintain" | "GainMuscle"
        public string Goal { get; set; }
    }
}