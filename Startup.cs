using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Models;
using Services;

namespace Aplikacija
{
    public class Startup
    {

        public const string SECRET = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaafsfasfasfagasgsdsdgsdfhsdfhsdfhsdfhsdfhsdfhsdfhsdfhsdfhsdfhsdfhsdfhsdfhsdfh";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
             services.AddCors(p =>
            {
                p.AddPolicy("CORS", builder =>
                {
                    builder.WithOrigins(new string[]
                                {
                                    "http://localhost:5500",
                                    "http://127.0.0.1:5500",
                                    "https://localhost:5500",
                                    "https://127.0.0.1:5500",
                                    "http://localhost:5000",
                                    "http://127.0.0.1:5000",
                                    "https://localhost:5000",
                                    "https://127.0.0.1:5000",
                                    "http://localhost:5501",
                                    "http://127.0.0.1:5501",
                                    "https://localhost:5501",
                                    "https://127.0.0.1:5501",
                                    "http://localhost:5001",
                                    "http://127.0.0.1:5001",
                                    "https://localhost:5001",
                                    "https://127.0.0.1:5001"
                                })
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });
            
             services.AddDbContext<AplikacijaContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("ProjekatCS"));
            });

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Aplikacija", Version = "v1" });
            });

            var key = Encoding.ASCII.GetBytes(SECRET);
            
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = true;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddScoped<IUserService, UserService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Aplikacija v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CORS");
            app.UseAuthentication();
            app.UseAuthorization();

            

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
