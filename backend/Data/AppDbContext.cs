using Microsoft.EntityFrameworkCore;
using SayacYonetimUygulamasi.Models;

namespace SayacYonetimUygulamasi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<Meter> Meters { get; set; }
        public DbSet<CommunicationUnit> CommunicationUnits { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Global query filter to exclude deleted records
            modelBuilder.Entity<Meter>().HasQueryFilter(m => !m.IsDeleted);
            modelBuilder.Entity<CommunicationUnit>().HasQueryFilter(cu => !cu.IsDeleted);

            // CommunicationUnit - Meter relationship
            modelBuilder.Entity<Meter>()
                .HasOne(m => m.CommunicationUnit)
                .WithMany(cu => cu.Meters)
                .HasForeignKey(m => m.CommunicationUnitId)
                .OnDelete(DeleteBehavior.Restrict); // Haberleşme ünitesi silinirse sayaçlar silinmesin
        }
    }
}
