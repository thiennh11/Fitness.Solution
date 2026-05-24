using Fitness.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Fitness.API.Controllers
{
    [ApiController]
    [Route("api/recommendations")]
    [Authorize]
    public class RecommendationController : ControllerBase
    {
        private readonly IRecommendationService _recommendationService;

        public RecommendationController(
            IRecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }

        // GET /api/recommendations/meals?goal=LoseWeight
        [HttpGet("meals")]
        public async Task<IActionResult> GetMealRecommendations(
            [FromQuery] string goal = "Maintain")
        {
            // Validate goal
            var validGoals = new[] { "LoseWeight", "Maintain", "GainMuscle" };
            if (!validGoals.Contains(goal))
                return BadRequest("Goal không hợp lệ. Chọn: LoseWeight | Maintain | GainMuscle");

            // Lấy userId từ JWT token
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            var userId = Guid.Parse(userIdStr);

            var result = await _recommendationService
                .GetRecommendationsAsync(userId, goal);

            if (result == null)
                return NotFound("Không tìm thấy thực phẩm phù hợp. Hãy thêm foods vào hệ thống.");

            return Ok(result);
        }
    }
}