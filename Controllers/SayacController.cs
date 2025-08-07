using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SayacYonetimUygulamasi.Data;
using SayacYonetimUygulamasi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SayacYonetimUygulamasi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SayacController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SayacController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sayac
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Meter>>> GetMeters()
        {
            return await _context.Meters.ToListAsync();
        }

        // GET: api/sayac/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Meter>> GetMeter(int id)
        {
            var meter = await _context.Meters.FindAsync(id);

            if (meter == null)
            {
                return NotFound();
            }

            return meter;
        }

        // POST: api/sayac
        [HttpPost]
        public async Task<ActionResult<Meter>> PostMeter(MeterCreateDto meterDto)
        {
            var meter = new Meter
            {
                MeterNumber = meterDto.MeterNumber,
                ReadingValue = meterDto.ReadingValue,
                ReadingDate = meterDto.ReadingDate
            };

            _context.Meters.Add(meter);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMeter), new { id = meter.Id }, meter);
        }



        // PUT: api/sayac/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMeter(int id, Meter meter)
        {
            if (id != meter.Id)
            {
                return BadRequest();
            }

            _context.Entry(meter).State = EntityState.Modified;

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

            _context.Meters.Remove(meter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MeterExists(int id)
        {
            return _context.Meters.Any(e => e.Id == id);
        }
    }
}
