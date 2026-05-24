using Fitness.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.Interfaces
{
    public interface IFoodRepository
    {
        Task<List<Food>> GetAllAsync();

        Task<Food?> GetByIdAsync(Guid id);

        Task AddAsync(Food food);

        Task UpdateAsync(Food food);

        Task DeleteAsync(Food food);
    }
}
