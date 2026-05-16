using System;
using System.ComponentModel.DataAnnotations;

namespace SayacYonetimUygulamasi.Models
{
    public class MeterCreateDto
    {
        [Required(ErrorMessage = "Sayaç numarası zorunludur")]
        public string? MeterNumber { get; set; }

        [Required(ErrorMessage = "Okuma değeri zorunludur")]
        [Range(0, double.MaxValue, ErrorMessage = "Okuma değeri 0'dan büyük olmalıdır")]
        public decimal ReadingValue { get; set; }

        [Required(ErrorMessage = "Okuma tarihi zorunludur")]
        public DateTime ReadingDate { get; set; }

        [Required(ErrorMessage = "Haberleşme ünitesi seçimi zorunludur")]
        public int CommunicationUnitId { get; set; }
    }
}
    