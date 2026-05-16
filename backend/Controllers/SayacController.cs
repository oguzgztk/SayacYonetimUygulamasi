using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SayacYonetimUygulamasi.Data;
using SayacYonetimUygulamasi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace SayacYonetimUygulamasi.Controllers
{
    [Route("api/sayac")]
    [ApiController]
    public class SayacController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SayacController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sayac/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MeterDto>> GetMeter(int id)
        {
            var meter = await _context.Meters
                .Include(m => m.CommunicationUnit)
                .Where(m => m.Id == id)
                .Select(m => new MeterDto
                {
                    Id = m.Id,
                    MeterNumber = m.MeterNumber,
                    ReadingValue = m.ReadingValue,
                    ReadingDate = m.ReadingDate,
                    IsDeleted = m.IsDeleted,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt,
                    CommunicationUnitId = m.CommunicationUnitId,
                    CommunicationUnitName = m.CommunicationUnit.Name,
                    CommunicationUnitIp = m.CommunicationUnit.IpAddress,
                    CommunicationUnitPort = m.CommunicationUnit.Port
                })
                .FirstOrDefaultAsync();

            if (meter == null)
            {
                return NotFound();
            }

            return meter;
        }

        // GET: api/sayac
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MeterDto>>> GetMeters()
        {
            var meters = await _context.Meters
                .Include(m => m.CommunicationUnit)
                .Select(m => new MeterDto
                {
                    Id = m.Id,
                    MeterNumber = m.MeterNumber,
                    ReadingValue = m.ReadingValue,
                    ReadingDate = m.ReadingDate,
                    IsDeleted = m.IsDeleted,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt,
                    CommunicationUnitId = m.CommunicationUnitId,
                    CommunicationUnitName = m.CommunicationUnit.Name,
                    CommunicationUnitIp = m.CommunicationUnit.IpAddress,
                    CommunicationUnitPort = m.CommunicationUnit.Port
                })
                .ToListAsync();

            return meters;
        }

        // GET: api/sayac/deleted
        [HttpGet("deleted")]
        public async Task<ActionResult<IEnumerable<MeterDto>>> GetDeletedMeters()
        {
            var meters = await _context.Meters
                .IgnoreQueryFilters() // Silinen kayıtları da getir
                .Include(m => m.CommunicationUnit)
                .Where(m => m.IsDeleted)
                .Select(m => new MeterDto
                {
                    Id = m.Id,
                    MeterNumber = m.MeterNumber,
                    ReadingValue = m.ReadingValue,
                    ReadingDate = m.ReadingDate,
                    IsDeleted = m.IsDeleted,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt,
                    CommunicationUnitId = m.CommunicationUnitId,
                    CommunicationUnitName = m.CommunicationUnit.Name,
                    CommunicationUnitIp = m.CommunicationUnit.IpAddress,
                    CommunicationUnitPort = m.CommunicationUnit.Port
                })
                .ToListAsync();

            return meters;
        }

        // POST: api/sayac
        [HttpPost]
        public async Task<ActionResult<MeterDto>> PostMeter(MeterCreateDto meterDto)
        {
            // CommunicationUnit'in var olup olmadığını kontrol et
            var communicationUnit = await _context.CommunicationUnits.FindAsync(meterDto.CommunicationUnitId);
            if (communicationUnit == null)
            {
                return BadRequest("Belirtilen haberleşme ünitesi bulunamadı");
            }

            var meter = new Meter
            {
                MeterNumber = meterDto.MeterNumber,
                ReadingValue = meterDto.ReadingValue,
                ReadingDate = meterDto.ReadingDate,
                CommunicationUnitId = meterDto.CommunicationUnitId,
                CreatedAt = DateTime.Now
            };

            _context.Meters.Add(meter);
            await _context.SaveChangesAsync();

            // MeterDto olarak döndür
            var result = new MeterDto
            {
                Id = meter.Id,
                MeterNumber = meter.MeterNumber,
                ReadingValue = meter.ReadingValue,
                ReadingDate = meter.ReadingDate,
                IsDeleted = meter.IsDeleted,
                CreatedAt = meter.CreatedAt,
                UpdatedAt = meter.UpdatedAt,
                CommunicationUnitId = meter.CommunicationUnitId,
                CommunicationUnitName = communicationUnit.Name,
                CommunicationUnitIp = communicationUnit.IpAddress,
                CommunicationUnitPort = communicationUnit.Port
            };

            return Ok(result);
        }

        // PUT: api/sayac/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMeter(int id, MeterCreateDto updateDto)
        {
            var meter = await _context.Meters.FindAsync(id);
            if (meter == null)
            {
                return NotFound();
            }

            // CommunicationUnit'in var olup olmadığını kontrol et
            var communicationUnit = await _context.CommunicationUnits.FindAsync(updateDto.CommunicationUnitId);
            if (communicationUnit == null)
            {
                return BadRequest("Belirtilen haberleşme ünitesi bulunamadı");
            }

            meter.MeterNumber = updateDto.MeterNumber;
            meter.ReadingValue = updateDto.ReadingValue;
            meter.ReadingDate = updateDto.ReadingDate;
            meter.CommunicationUnitId = updateDto.CommunicationUnitId;
            meter.UpdatedAt = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MeterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/sayac/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeter(int id)
        {
            var meter = await _context.Meters.FindAsync(id);
            if (meter == null)
            {
                return NotFound();
            }

            // Soft delete - mark as deleted instead of removing
            meter.IsDeleted = true;
            _context.Entry(meter).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PERMANENT DELETE: api/sayac/5/permanent
        [HttpDelete("{id}/permanent")]
        public async Task<IActionResult> PermanentDeleteMeter(int id)
        {
            var meter = await _context.Meters
                .IgnoreQueryFilters() // Ignore the global query filter to find deleted records
                .FirstOrDefaultAsync(m => m.Id == id);
                
            if (meter == null)
            {
                return NotFound();
            }

            _context.Meters.Remove(meter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // RESTORE: api/sayac/5/restore
        [HttpPost("{id}/restore")]
        public async Task<IActionResult> RestoreMeter(int id)
        {
            var meter = await _context.Meters
                .IgnoreQueryFilters() // Ignore the global query filter to find deleted records
                .FirstOrDefaultAsync(m => m.Id == id);
                
            if (meter == null)
            {
                return NotFound();
            }

            if (!meter.IsDeleted)
            {
                return BadRequest("Record is not deleted");
            }

            meter.IsDeleted = false;
            _context.Entry(meter).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MeterExists(int id)
        {
            return _context.Meters.Any(e => e.Id == id);
        }
    }
}
