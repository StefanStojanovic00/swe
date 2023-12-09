using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Services;
using System.Security.Cryptography;
using Models;

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        public static string sha256_hashFunkcija( string value )
        {
             using var hash = SHA256.Create();
             var niz = hash.ComputeHash(Encoding.UTF8.GetBytes( value ) );
             return Convert.ToHexString(niz).ToLower();
        }

        // POST api/user/login
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody]User user)
        {
            var token = _userService.Login(user.UserName, sha256_hashFunkcija(user.Password));

            if (token == null || token == String.Empty)
                return BadRequest(new { message = "User name or password is incorrect" });

            return Ok(token);
        }

        
    }
}