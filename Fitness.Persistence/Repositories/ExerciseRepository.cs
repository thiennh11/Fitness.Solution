using Fitness.Application.Interfaces;
using Fitness.Domain.Entities;
using Fitness.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Persistence.Repositories
{
    public class ExerciseRepository : IExerciseRepository
    {
        private readonly AppDbContext _context;

        public ExerciseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Exercise>> GetAllAsync()
        {
            return await _context.Exercises.ToListAsync();
        }

        public async Task<Exercise?> GetByIdAsync(Guid id)
        {
            return await _context.Exercises.FindAsync(id);
        }

        public async Task AddAsync(Exercise exercise)
        {
            await _context.Exercises.AddAsync(exercise);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Exercise exercise)
        {
            _context.Exercises.Update(exercise);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Exercise exercise)
        {
            _context.Exercises.Remove(exercise);

            await _context.SaveChangesAsync();
        }
    }
}
