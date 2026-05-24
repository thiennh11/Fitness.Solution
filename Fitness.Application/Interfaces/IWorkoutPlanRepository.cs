using Fitness.Domain.Entities;

namespace Fitness.Application.Interfaces
{
    public interface IWorkoutPlanRepository
    {
        Task<List<WorkoutPlan>> GetAllAsync();
        Task<List<WorkoutPlan>> GetAllByUserAsync(Guid userId);
        Task<WorkoutPlan?> GetByIdAsync(Guid id);
        Task AddAsync(WorkoutPlan workoutPlan);
        Task DeleteAsync(WorkoutPlan workoutPlan);
        Task<WorkoutPlan?> GetByUserAndDateAsync(Guid userId, DateTime date);
    }
}