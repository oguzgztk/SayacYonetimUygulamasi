using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SayacYonetimUygulamasi.Models
{
    public class Meter
    {
        [Key]
        public int Id { get; set; }  // Otomatik artan, manuel müdahale yok

        [Required]
        public string? MeterNumber { get; set; }

        public decimal ReadingValue { get; set; }

        public DateTime ReadingDate { get; set; }

        public bool IsDeleted { get; set; } = false;

        // CommunicationUnit ile ilişki
        [Required]
        public int CommunicationUnitId { get; set; }

        [ForeignKey("CommunicationUnitId")]
        public virtual CommunicationUnit? CommunicationUnit { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }
    }
}
