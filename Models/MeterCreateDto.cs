using System;
using System.ComponentModel.DataAnnotations;

namespace SayacYonetimUygulamasi.Models
{

    public class MeterCreateDto
    {
        public string MeterNumber { get; set; }
        public decimal ReadingValue { get; set; }
        public DateTime ReadingDate { get; set; }
    }
}
    