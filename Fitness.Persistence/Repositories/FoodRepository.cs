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
    public class FoodRepository : IFoodRepository
    {
        private readonly AppDbContext _context;

        public FoodRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Food>> GetAllAsync()
        {
            return await _context.Foods.ToListAsync();
        }

        public async Task<Food?> GetByIdAsync(Guid id)
        {
            return await _context.Foods.FindAsync(id);
        }

        public async Task AddAsync(Food food)
        {
            await _context.Foods.AddAsync(food);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Food food)
        {
            _context.Foods.Update(food);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Food food)
        {
            _context.Foods.Remove(food);

            await _context.SaveChangesAsync();
        }
    }
}
