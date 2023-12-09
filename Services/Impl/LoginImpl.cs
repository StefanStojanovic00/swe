using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Models;
using Aplikacija;

namespace Services
{
    public class UserService : IUserService
    {

        AplikacijaContext Context {get;set;}

        public UserService(AplikacijaContext context)
        {
            Context = context;
        }
        // users hardcoded for simplicity, store in a db with hashed passwords in production applications
        // private List<User> _users = new List<User>
        // {
        //     //new User { Id = 1, UserName = "user1", Password = "password1", Role = "admin"},
        //     //new User { Id = 2, UserName = "user2", Password = "password2", Role = "guest"}
        // };

        public string Login(string userName, string password)
        {
            //var user = _users.SingleOrDefault(x => x.UserName == userName && x.Password == password);
            var user = Context.Users.Where(p=>p.UserName == userName && p.Password == password).FirstOrDefault();
            
            
            // return null if user not found
            if (user == null)
            {
                return string.Empty;
            }

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Startup.SECRET);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, user.Role)
                }),

                Expires = DateTime.UtcNow.AddMinutes(50),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            Context.SaveChanges();
            return user.Token;
        }
    }
}