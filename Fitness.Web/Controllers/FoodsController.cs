using Fitness.Application.Interfaces;
using Fitness.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Fitness.API.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FoodsController : ControllerBase
    {
        private readonly IFoodRepository _repository;

        public FoodsController(IFoodRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var foods = await _repository.GetAllAsync();

            return Ok(foods);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var food = await _repository.GetByIdAsync(id);

            if (food == null)
            {
                return NotFound();
            }

            return Ok(food);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Food food)
        {
            food.Id = Guid.NewGuid();

            await _repository.AddAsync(food);

            return Ok(food);
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            Guid id,
            Food updatedFood)
        {
            var food = await _repository.GetByIdAsync(id);

            if (food == null)
            {
                return NotFound();
            }

            food.Name = updatedFood.Name;
            food.Calories = updatedFood.Calories;
            food.Protein = updatedFood.Protein;
            food.Carbs = updatedFood.Carbs;
            food.Fat = updatedFood.Fat;

            await _repository.UpdateAsync(food);

            return Ok(food);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var food = await _repository.GetByIdAsync(id);

            if (food == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(food);

            return Ok("Deleted successfully");
        }
    }
}
