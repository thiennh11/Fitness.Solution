using Fitness.Application.DTOs;
using Fitness.Application.Interfaces;
using Fitness.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Fitness.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MealPlansController : ControllerBase
{
    private readonly IMealPlanRepository _repository;

    public MealPlansController(IMealPlanRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var mealPlans = await _repository.GetAllByUserAsync(userId.Value);

        var result = mealPlans.Select(x => new MealPlanResponseDto
        {
            Id = x.Id,
            Date = x.Date,
            TotalCalories = x.MealItems.Sum(mi => mi.Food.Calories * mi.Quantity),
            TotalProtein = x.MealItems.Sum(mi => mi.Food.Protein * mi.Quantity),
            TotalCarbs = x.MealItems.Sum(mi => mi.Food.Carbs * mi.Quantity),
            TotalFat = x.MealItems.Sum(mi => mi.Food.Fat * mi.Quantity),
            Foods = x.MealItems.Select(mi => new MealItemResponseDto
            {
                FoodName = mi.Food.Name,
                Quantity = mi.Quantity,
                Calories = mi.Food.Calories,
                Protein = mi.Food.Protein,
                Carbs = mi.Food.Carbs,
                Fat = mi.Food.Fat,
                TotalCalories = mi.Food.Calories * mi.Quantity
            }).ToList()
        });

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateMealPlanDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var existingMealPlan = await _repository.GetByUserAndDateAsync(userId.Value, dto.Date);
        if (existingMealPlan != null)
        {
            return BadRequest("Meal plan already exists for this date");
        }

        var mealPlan = new MealPlan
        {
            Id = Guid.NewGuid(),
            UserId = userId.Value,
            Date = dto.Date,
            MealItems = dto.Items.Select(x => new MealItem
            {
                Id = Guid.NewGuid(),
                FoodId = x.FoodId,
                Quantity = x.Quantity
            }).ToList()
        };

        await _repository.AddAsync(mealPlan);
        return Ok(mealPlan);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var mealPlan = await _repository.GetByIdAsync(id);
        if (mealPlan == null) return NotFound();

        if (mealPlan.UserId != userId.Value) return Forbid();

        await _repository.DeleteAsync(mealPlan);
        return NoContent();
    }

    // HELPER

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}