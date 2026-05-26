using Fitness.Application.DTOs;
using Fitness.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Fitness.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repository;
        public UsersController(IUserRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _repository.GetAllAsync();
            var normalUsers = users
                .Where(u => u.Role != "Admin")
                .ToList();
            return Ok(normalUsers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId != id.ToString())
                return Forbid();

            var user = await _repository.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateProfileDto dto)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId != id.ToString())
                return Forbid();

            var user = await _repository.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            user.Weight = dto.Weight;
            user.Height = dto.Height;
            user.Age = dto.Age;
            await _repository.UpdateAsync(user);
            return Ok(user);
        }

        [HttpGet("{id}/bmi")]
        public async Task<IActionResult> CalculateBmi(Guid id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId != id.ToString())
                return Forbid();

            var user = await _repository.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            var heightInMeters = user.Height / 100.0;
            var bmi = user.Weight / (heightInMeters * heightInMeters);

            string status;
            if (bmi < 18.5)
                status = "Underweight";
            else if (bmi < 25)
                status = "Normal";
            else if (bmi < 30)
                status = "Overweight";
            else
                status = "Obese";

            var result = new BmiResponseDto
            {
                BMI = Math.Round(bmi, 2),
                Status = status
            };
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            await _repository.DeleteAsync(user);
            return NoContent();
        }
    }
}