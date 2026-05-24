using Fitness.Application.Interfaces;
using Fitness.Domain.Entities;
using Fitness.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Persistence.Repositories
{
    public class WorkoutPlanRepository : IWorkoutPlanRepository
    {
        private readonly AppDbContext _context;

        public WorkoutPlanRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<WorkoutPlan>> GetAllAsync()
        {
            return await _context.WorkoutPlans
                .Include(x => x.WorkoutItems)
                .ThenInclude(x => x.Exercise)
                .ToListAsync();
        }

        public async Task<List<WorkoutPlan>> GetAllByUserAsync(Guid userId)
        {
            return await _context.WorkoutPlans
                .Where(x => x.UserId == userId)
                .Include(x => x.WorkoutItems)
                .ThenInclude(x => x.Exercise)
                .ToListAsync();
        }

        public async Task<WorkoutPlan?> GetByIdAsync(Guid id)
        {
            return await _context.WorkoutPlans
                .Include(x => x.WorkoutItems)
                .ThenInclude(x => x.Exercise)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task AddAsync(WorkoutPlan workoutPlan)
        {
            await _context.WorkoutPlans.AddAsync(workoutPlan);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(WorkoutPlan workoutPlan)
        {
            _context.WorkoutPlans.Remove(workoutPlan);
            await _context.SaveChangesAsync();
        }

        public async Task<WorkoutPlan?> GetByUserAndDateAsync(Guid userId, DateTime date)
        {
            return await _context.WorkoutPlans
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.Date.Date == date.Date);
        }
    }
}