using Microsoft.EntityFrameworkCore;
using SayacYonetimUygulamasi.Models;

namespace SayacYonetimUygulamasi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<Meter> Meters { get; set; }
    }
}
