using Fitness.Application.DTOs;
using Fitness.Application.Interfaces;
using Fitness.Application.Services;
using Fitness.Domain.Entities;
using Fitness.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        [HttpGet("google-login")]
        [AllowAnonymous]
        public IActionResult GoogleLogin()
        {
            var redirectUrl = Url.Action("GoogleCallback", "Auth");
            var properties = new AuthenticationProperties
            {
                RedirectUri = redirectUrl
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-callback")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleCallback()
        {
            var result = await HttpContext.AuthenticateAsync("Cookies");

            if (!result.Succeeded)
                return Unauthorized("Google authentication failed");

            var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
            var name = result.Principal.FindFirst(ClaimTypes.Name)?.Value;

            if (email == null) return Unauthorized();

            var user = await _repository.GetByEmailAsync(email);

            if (user == null)
            {
                user = new User
                {
                    Id = Guid.NewGuid(),
                    FullName = name ?? email,
                    Email = email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                    Role = "User",
                    Gender = "",
                    Weight = 0,
                    Height = 0,
                    Age = 0
                };
                await _repository.AddAsync(user);
            }

            var token = _jwtService.GenerateToken(user);

            // Redirect về frontend kèm token
            var redirectUrl = $"https://localhost:7180/pages/google-callback.html?token={token}&role={user.Role}&fullName={Uri.EscapeDataString(user.FullName)}";
            return Redirect(redirectUrl);
        }
    }
}
