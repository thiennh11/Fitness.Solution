using Fitness.Application.Interfaces;
using Fitness.Application.Services;
using Fitness.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Fitness.Application.DTOs;

namespace Fitness.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly IJwtService _jwtService;

        public AuthController(
            IUserRepository repository,
            IJwtService jwtService)
        {
            _repository = repository;
            _jwtService = jwtService;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var existingUser =
            await _repository.GetByEmailAsync(dto.Email);

            if (existingUser != null)
            {
                return BadRequest("Email already exists");
            }
            var user = new User
            {
                Id = Guid.NewGuid(),

                FullName = dto.FullName,

                Email = dto.Email,

                Gender = dto.Gender,

                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(dto.Password),

                Weight = dto.Weight,

                Height = dto.Height,

                Age = dto.Age,

                Role = dto.Role
            };

            await _repository.AddAsync(user);

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user =
                await _repository.GetByEmailAsync(dto.Email);

            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            var isPasswordValid =
                BCrypt.Net.BCrypt.Verify(
                    dto.Password,
                    user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid credentials");
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                token = token,
                role = user.Role,
                fullName = user.FullName
            });
        }
    }
}
