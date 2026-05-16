using System;

namespace SayacYonetimUygulamasi.Models
{
    public class MeterDto
    {
        public int Id { get; set; }
        public string MeterNumber { get; set; } = string.Empty;
        public decimal ReadingValue { get; set; }
        public DateTime ReadingDate { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // CommunicationUnit bilgileri (sadece gerekli alanlar)
        public int CommunicationUnitId { get; set; }
        public string CommunicationUnitName { get; set; } = string.Empty;
        public string CommunicationUnitIp { get; set; } = string.Empty;
        public int CommunicationUnitPort { get; set; }
    }
}
