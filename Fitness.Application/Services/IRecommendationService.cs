using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fitness.Application.DTOs;

namespace Fitness.Application.Services
{
    public interface IRecommendationService
    {
        Task<RecommendationResponseDto>GetRecommendationsAsync(Guid userId, string goal);
    }
}
