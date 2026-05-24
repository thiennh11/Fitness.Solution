using Fitness.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fitness.Application.Interfaces
{
    public interface IExerciseRepository
    {
        Task<List<Exercise>> GetAllAsync();

        Task<Exercise?> GetByIdAsync(Guid id);

        Task AddAsync(Exercise exercise);

        Task UpdateAsync(Exercise exercise);

        Task DeleteAsync(Exercise exercise);
    }
}
