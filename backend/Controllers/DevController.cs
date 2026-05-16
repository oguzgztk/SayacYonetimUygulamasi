using Microsoft.AspNetCore.Mvc;
using SayacYonetimUygulamasi.Data;

namespace SayacYonetimUygulamasi.Controllers;

[ApiController]
[Route("api/dev")]
public class DevController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public DevController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    /// <summary>
    /// Tüm veriyi siler ve örnek kayıtları yeniden yükler (yalnızca Development).
    /// </summary>
    [HttpPost("reseed")]
    public IActionResult Reseed()
    {
        if (!_env.IsDevelopment())
            return NotFound();

        DbSeeder.Reseed(_context);

        return Ok(new
        {
            message = "Örnek veriler yüklendi.",
            units = 6,
            meters = 19,
        });
    }
}
