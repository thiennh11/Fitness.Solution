using Fitness.Application.DTOs;
using Fitness.Application.Interfaces;
using Fitness.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Fitness.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutPlansController : ControllerBase
    {
        private readonly IWorkoutPlanRepository _repository;

        public WorkoutPlansController(IWorkoutPlanRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var workoutPlans = await _repository.GetAllByUserAsync(userId.Value);

            var result = workoutPlans.Select(x => new WorkoutPlanResponseDto
            {
                Id = x.Id,
                Date = x.Date,
                TotalCaloriesBurned = x.WorkoutItems.Sum(wi =>
                    wi.Exercise.CaloriesBurnPerMinute * wi.DurationMinutes),
                Exercises = x.WorkoutItems.Select(wi => new WorkoutItemResponseDto
                {
                    ExerciseName = wi.Exercise.Name,
                    DurationMinutes = wi.DurationMinutes,
                    CaloriesBurnPerMinute = wi.Exercise.CaloriesBurnPerMinute,
                    TotalCaloriesBurned = wi.Exercise.CaloriesBurnPerMinute * wi.DurationMinutes
                }).ToList()
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateWorkoutPlanDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var existingWorkoutPlan = await _repository.GetByUserAndDateAsync(userId.Value, dto.Date);
            if (existingWorkoutPlan != null)
            {
                return BadRequest("Workout plan already exists for this date");
            }

            var workoutPlan = new WorkoutPlan
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                Date = dto.Date,
                WorkoutItems = dto.Items.Select(x => new WorkoutItem
                {
                    Id = Guid.NewGuid(),
                    ExerciseId = x.ExerciseId,
                    DurationMinutes = x.DurationMinutes
                }).ToList()
            };

            await _repository.AddAsync(workoutPlan);
            return Ok(workoutPlan);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var workoutPlan = await _repository.GetByIdAsync(id);
            if (workoutPlan == null) return NotFound();

            if (workoutPlan.UserId != userId.Value) return Forbid();

            await _repository.DeleteAsync(workoutPlan);
            return NoContent();
        }

        // HELPER

        private Guid? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(claim, out var id) ? id : null;
        }
    }
}