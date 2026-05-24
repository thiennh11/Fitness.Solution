using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fitness.Domain.Entities;

namespace Fitness.Persistence.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Food> Foods => Set<Food>();
    public DbSet<MealPlan> MealPlans => Set<MealPlan>();
    public DbSet<MealItem> MealItems => Set<MealItem>();
    public DbSet<Exercise> Exercises => Set<Exercise>();

    public DbSet<WorkoutPlan> WorkoutPlans
        => Set<WorkoutPlan>();

    public DbSet<WorkoutItem> WorkoutItems
        => Set<WorkoutItem>();
}
