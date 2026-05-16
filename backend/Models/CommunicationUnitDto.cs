using System.Collections.Generic;

namespace SayacYonetimUygulamasi.Models
{
    public class CommunicationUnitDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public int Port { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int MeterCount { get; set; } // Sadece sayaç sayısı, sayaç detayları değil
    }
}
