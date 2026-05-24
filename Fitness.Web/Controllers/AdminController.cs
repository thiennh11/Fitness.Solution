using Fitness.Persistence.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/admin/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var users = await _context.Users.ToListAsync();

            double averageBmi = 0;
            if (users.Any(x => x.Height > 0))
            {
                averageBmi = users
                    .Where(x => x.Height > 0)
                    .Average(x => x.Weight / Math.Pow(x.Height / 100.0, 2));
            }

            return Ok(new
            {
                totalUsers = users.Count,
                totalMealPlans = await _context.MealPlans.CountAsync(),
                totalWorkoutPlans = await _context.WorkoutPlans.CountAsync(),
                averageBMI = Math.Round(averageBmi, 2)
            });
        }

        // GET /api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Weight,
                    u.Height,
                    u.Age,
                    u.Role,
                    bmi = u.Height > 0
                        ? Math.Round(u.Weight / Math.Pow(u.Height / 100.0, 2), 2)
                        : 0
                })
                .ToListAsync();

            return Ok(users);
        }

        // DELETE /api/admin/users/{id}
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}