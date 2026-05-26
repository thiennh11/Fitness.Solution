using Fitness.Application.DTOs;
using Fitness.Application.Interfaces;
using Fitness.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseRepository _repository;

    public ExercisesController(
        IExerciseRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var exercises =
            await _repository.GetAllAsync();

        var result = exercises.Select(x =>
        new ExerciseResponseDto
    {
        Id = x.Id,
        Name = x.Name,
        CaloriesBurnPerMinute =
            x.CaloriesBurnPerMinute
    });

        return Ok(result);
    }
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        Exercise exercise)
    {
        exercise.Id = Guid.NewGuid();

        await _repository.AddAsync(exercise);

        return Ok(exercise);
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        Exercise updatedExercise)
    {
        var exercise =
            await _repository.GetByIdAsync(id);

        if (exercise == null)
        {
            return NotFound();
        }

        exercise.Name = updatedExercise.Name;

        exercise.CaloriesBurnPerMinute =
            updatedExercise.CaloriesBurnPerMinute;

        await _repository.UpdateAsync(exercise);

        return Ok(exercise);
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var exercise =
            await _repository.GetByIdAsync(id);

        if (exercise == null)
        {
            return NotFound();
        }

        await _repository.DeleteAsync(exercise);

        return Ok("Deleted successfully");
    }
}