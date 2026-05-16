using System.ComponentModel.DataAnnotations;

namespace SayacYonetimUygulamasi.Models
{
    public class CommunicationUnitCreateDto
    {
        [Required(ErrorMessage = "İsim alanı zorunludur")]
        [StringLength(100, ErrorMessage = "İsim en fazla 100 karakter olabilir")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "IP adresi zorunludur")]
        [StringLength(15, ErrorMessage = "IP adresi en fazla 15 karakter olabilir")]
        [RegularExpression(@"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$", 
            ErrorMessage = "Geçerli bir IP adresi giriniz")]
        public string IpAddress { get; set; } = string.Empty;

        [Required(ErrorMessage = "Port numarası zorunludur")]
        [Range(1, 65535, ErrorMessage = "Port numarası 1-65535 arasında olmalıdır")]
        public int Port { get; set; }
    }
}
