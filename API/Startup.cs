﻿using System;
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
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Persistence;

namespace API
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddDbContext<DataContext>(opt =>
      {
        opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
      });
      services.AddCors(options =>
      {
        options.AddPolicy("CorsPolicy", policy =>
        {
          policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
        });
      });
      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        //                app.UseHsts();
      }

      //            app.UseHttpsRedirection();
      app.UseCors("CorsPolicy");
      app.UseMvc();
    }
  }
}