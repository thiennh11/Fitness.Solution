using Fitness.Application.Interfaces;
using Fitness.Domain.Entities;
using Fitness.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Persistence.Repositories
{
    public class MealPlanRepository : IMealPlanRepository
    {
        private readonly AppDbContext _context;

        public MealPlanRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MealPlan>> GetAllAsync()
        {
            return await _context.MealPlans
                .Include(x => x.MealItems)
                .ThenInclude(x => x.Food)
                .ToListAsync();
        }

        public async Task<List<MealPlan>> GetAllByUserAsync(Guid userId)
        {
            return await _context.MealPlans
                .Where(x => x.UserId == userId)
                .Include(x => x.MealItems)
                .ThenInclude(x => x.Food)
                .ToListAsync();
        }

        public async Task<MealPlan?> GetByIdAsync(Guid id)
        {
            return await _context.MealPlans
                .Include(x => x.MealItems)
                .ThenInclude(x => x.Food)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task AddAsync(MealPlan mealPlan)
        {
            await _context.MealPlans.AddAsync(mealPlan);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(MealPlan mealPlan)
        {
            _context.MealPlans.Remove(mealPlan);
            await _context.SaveChangesAsync();
        }

        public async Task<MealPlan?> GetByUserAndDateAsync(Guid userId, DateTime date)
        {
            return await _context.MealPlans
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.Date.Date == date.Date);
        }
    }
}