using System;
using System.ComponentModel.DataAnnotations;

namespace SayacYonetimUygulamasi.Models
{
    public class CommunicationUnit
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string IpAddress { get; set; } = string.Empty;

        [Required]
        [Range(1, 65535)]
        public int Port { get; set; }

        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }

        // Navigation property - bu üniteye bağlı sayaçlar
        public virtual ICollection<Meter> Meters { get; set; } = new List<Meter>();
    }
}
