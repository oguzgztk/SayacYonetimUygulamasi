using System;
using System.ComponentModel.DataAnnotations;

namespace SayacYonetimUygulamasi.Models
{
    public class Meter
    {
        [Key]
        public int Id { get; set; }  // Otomatik artan, manuel müdahale yok

        public string MeterNumber { get; set; }

        public decimal ReadingValue { get; set; }

        public DateTime ReadingDate { get; set; }
    }
}
