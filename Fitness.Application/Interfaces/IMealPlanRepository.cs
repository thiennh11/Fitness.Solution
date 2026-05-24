using Fitness.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Application.Interfaces
{
    public interface IMealPlanRepository
    {
        Task<List<MealPlan>> GetAllAsync();
        Task<List<MealPlan>> GetAllByUserAsync(Guid userId);
        Task<MealPlan?> GetByIdAsync(Guid id);
        Task AddAsync(MealPlan mealPlan);
        Task DeleteAsync(MealPlan mealPlan);
        Task<MealPlan?> GetByUserAndDateAsync(Guid userId, DateTime date);
    }
}