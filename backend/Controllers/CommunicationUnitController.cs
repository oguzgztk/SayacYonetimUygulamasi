using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SayacYonetimUygulamasi.Data;
using SayacYonetimUygulamasi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SayacYonetimUygulamasi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommunicationUnitController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommunicationUnitController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/communicationunit
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommunicationUnitDto>>> GetCommunicationUnits()
        {
            var units = await _context.CommunicationUnits
                .Select(cu => new CommunicationUnitDto
                {
                    Id = cu.Id,
                    Name = cu.Name,
                    IpAddress = cu.IpAddress,
                    Port = cu.Port,
                    IsDeleted = cu.IsDeleted,
                    CreatedAt = cu.CreatedAt,
                    UpdatedAt = cu.UpdatedAt,
                    MeterCount = cu.Meters.Count
                })
                .ToListAsync();

            return units;
        }

        // GET: api/communicationunit/deleted
        [HttpGet("deleted")]
        public async Task<ActionResult<IEnumerable<CommunicationUnitDto>>> GetDeletedCommunicationUnits()
        {
            var units = await _context.CommunicationUnits
                .IgnoreQueryFilters() // Silinen kayıtları da getir
                .Where(cu => cu.IsDeleted)
                .Select(cu => new CommunicationUnitDto
                {
                    Id = cu.Id,
                    Name = cu.Name,
                    IpAddress = cu.IpAddress,
                    Port = cu.Port,
                    IsDeleted = cu.IsDeleted,
                    CreatedAt = cu.CreatedAt,
                    UpdatedAt = cu.UpdatedAt,
                    MeterCount = cu.Meters.Count
                })
                .ToListAsync();

            return units;
        }

        // GET: api/communicationunit/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CommunicationUnitDto>> GetCommunicationUnit(int id)
        {
            var unit = await _context.CommunicationUnits
                .Where(cu => cu.Id == id)
                .Select(cu => new CommunicationUnitDto
                {
                    Id = cu.Id,
                    Name = cu.Name,
                    IpAddress = cu.IpAddress,
                    Port = cu.Port,
                    IsDeleted = cu.IsDeleted,
                    CreatedAt = cu.CreatedAt,
                    UpdatedAt = cu.UpdatedAt,
                    MeterCount = cu.Meters.Count
                })
                .FirstOrDefaultAsync();

            if (unit == null)
            {
                return NotFound();
            }

            return unit;
        }

        // POST: api/communicationunit
        [HttpPost]
        public async Task<ActionResult<CommunicationUnitDto>> PostCommunicationUnit(CommunicationUnitCreateDto createDto)
        {
            var unit = new CommunicationUnit
            {
                Name = createDto.Name,
                IpAddress = createDto.IpAddress,
                Port = createDto.Port,
                CreatedAt = DateTime.Now
            };

            _context.CommunicationUnits.Add(unit);
            await _context.SaveChangesAsync();

            var result = new CommunicationUnitDto
            {
                Id = unit.Id,
                Name = unit.Name,
                IpAddress = unit.IpAddress,
                Port = unit.Port,
                IsDeleted = unit.IsDeleted,
                CreatedAt = unit.CreatedAt,
                UpdatedAt = unit.UpdatedAt,
                MeterCount = 0
            };

            return CreatedAtAction(nameof(GetCommunicationUnit), new { id = unit.Id }, result);
        }

        // PUT: api/communicationunit/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCommunicationUnit(int id, CommunicationUnitCreateDto updateDto)
        {
            var unit = await _context.CommunicationUnits.FindAsync(id);
            if (unit == null)
            {
                return NotFound();
            }

            unit.Name = updateDto.Name;
            unit.IpAddress = updateDto.IpAddress;
            unit.Port = updateDto.Port;
            unit.UpdatedAt = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommunicationUnitExists(id))
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

        // DELETE: api/communicationunit/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCommunicationUnit(int id)
        {
            var unit = await _context.CommunicationUnits.FindAsync(id);
            if (unit == null)
            {
                return NotFound();
            }

            // Soft delete
            unit.IsDeleted = true;
            unit.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/communicationunit/5/restore
        [HttpPost("{id}/restore")]
        public async Task<IActionResult> RestoreCommunicationUnit(int id)
        {
            var unit = await _context.CommunicationUnits
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(cu => cu.Id == id);

            if (unit == null)
            {
                return NotFound();
            }

            unit.IsDeleted = false;
            unit.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommunicationUnitExists(int id)
        {
            return _context.CommunicationUnits.Any(e => e.Id == id);
        }
    }
}
