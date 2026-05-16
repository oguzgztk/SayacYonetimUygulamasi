using Microsoft.EntityFrameworkCore;
using SayacYonetimUygulamasi.Models;

namespace SayacYonetimUygulamasi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Meters.IgnoreQueryFilters().Any())
            return;

        InsertSampleData(context);
    }

    public static void Reseed(AppDbContext context)
    {
        context.Meters.IgnoreQueryFilters().ExecuteDelete();
        context.CommunicationUnits.IgnoreQueryFilters().ExecuteDelete();
        InsertSampleData(context);
    }

    private static void InsertSampleData(AppDbContext context)
    {
        var units = new[]
        {
            new CommunicationUnit
            {
                Name = "Merkez Bina RTU",
                IpAddress = "192.168.10.1",
                Port = 502,
                CreatedAt = new DateTime(2025, 8, 1, 9, 0, 0),
            },
            new CommunicationUnit
            {
                Name = "Blok A Saha Modem",
                IpAddress = "192.168.10.21",
                Port = 502,
                CreatedAt = new DateTime(2025, 8, 5, 10, 30, 0),
            },
            new CommunicationUnit
            {
                Name = "Blok B Saha Modem",
                IpAddress = "192.168.10.22",
                Port = 502,
                CreatedAt = new DateTime(2025, 8, 5, 10, 30, 0),
            },
            new CommunicationUnit
            {
                Name = "Jeneratör Odası",
                IpAddress = "192.168.10.30",
                Port = 2404,
                CreatedAt = new DateTime(2025, 9, 12, 14, 0, 0),
            },
            new CommunicationUnit
            {
                Name = "Su Deposu İstasyonu",
                IpAddress = "10.44.2.15",
                Port = 8080,
                CreatedAt = new DateTime(2025, 10, 3, 8, 15, 0),
            },
            new CommunicationUnit
            {
                Name = "Eski Saha Gateway (devre dışı)",
                IpAddress = "192.168.9.99",
                Port = 502,
                IsDeleted = true,
                CreatedAt = new DateTime(2024, 11, 20, 16, 0, 0),
                UpdatedAt = new DateTime(2026, 1, 10, 11, 0, 0),
            },
        };

        context.CommunicationUnits.AddRange(units);
        context.SaveChanges();

        var u1 = units[0].Id; // Merkez Bina RTU
        var u2 = units[1].Id; // Blok A
        var u3 = units[2].Id; // Blok B
        var u4 = units[3].Id; // Jeneratör
        var u5 = units[4].Id; // Su Deposu

        context.Meters.AddRange(

            // ── ELEK-001 — Merkez ana hat — aylık okumalar ──────────────
            M("ELEK-001", 17210.00m, "2025-12-15 09:00", u1),
            M("ELEK-001", 17598.40m, "2026-01-15 09:05", u1),
            M("ELEK-001", 17901.80m, "2026-02-15 09:10", u1),
            M("ELEK-001", 18124.50m, "2026-03-15 09:08", u1),
            M("ELEK-001", 18302.70m, "2026-04-15 09:12", u1),
            M("ELEK-001", 18452.30m, "2026-05-14 09:15", u1),

            // ── ELEK-002 — Merkez ikinci hat ────────────────────────────
            M("ELEK-002", 8640.00m, "2026-01-14 09:20", u1),
            M("ELEK-002", 8890.25m, "2026-02-14 09:22", u1),
            M("ELEK-002", 9011.60m, "2026-03-14 09:18", u1),
            M("ELEK-002", 9105.30m, "2026-04-14 09:20", u1),
            M("ELEK-002", 9231.75m, "2026-05-14 09:18", u1),

            // ── ELEK-003 — Merkez havalandırma ──────────────────────────
            M("ELEK-003", 30210.00m, "2026-03-13 16:30", u1),
            M("ELEK-003", 30588.80m, "2026-04-13 16:40", u1),
            M("ELEK-003", 31008.40m, "2026-05-13 16:45", u1),

            // ── ELEK-004 — Blok A giriş ─────────────────────────────────
            M("ELEK-004", 5200.00m, "2026-02-12 11:00", u2),
            M("ELEK-004", 5388.50m, "2026-03-12 11:10", u2),
            M("ELEK-004", 5510.20m, "2026-04-12 11:15", u2),
            M("ELEK-004", 5621.00m, "2026-05-12 11:20", u2),

            // ── ELEK-005 — Blok A asansör ───────────────────────────────
            M("ELEK-005", 7210.30m, "2026-03-12 11:20", u2),
            M("ELEK-005", 7508.80m, "2026-04-12 11:22", u2),
            M("ELEK-005", 7789.55m, "2026-05-12 11:22", u2),

            // ── ELEK-006 — Blok A ortak alan ────────────────────────────
            M("ELEK-006", 11200.00m, "2026-02-10 08:00", u2),
            M("ELEK-006", 11588.40m, "2026-03-10 08:00", u2),
            M("ELEK-006", 11802.60m, "2026-04-10 08:00", u2),
            M("ELEK-006", 12045.80m, "2026-05-10 08:00", u2),

            // ── ELEK-007 — Blok B giriş ─────────────────────────────────
            M("ELEK-007", 4102.50m, "2026-03-10 08:05", u3),
            M("ELEK-007", 4280.00m, "2026-04-10 08:05", u3),
            M("ELEK-007", 4450.20m, "2026-05-10 08:05", u3),

            // ── ELEK-008 — Blok B kazan dairesi ─────────────────────────
            M("ELEK-008", 9340.00m, "2026-02-08 14:30", u3),
            M("ELEK-008", 9580.20m, "2026-03-08 14:30", u3),
            M("ELEK-008", 9750.90m, "2026-04-08 14:30", u3),
            M("ELEK-008", 9923.10m, "2026-05-08 14:30", u3),

            // ── SU-101 — Su deposu A hattı ───────────────────────────────
            M("SU-101", 2310.00m, "2026-01-15 07:30", u5),
            M("SU-101", 2488.80m, "2026-02-15 07:35", u5),
            M("SU-101", 2622.40m, "2026-03-15 07:38", u5),
            M("SU-101", 2745.20m, "2026-04-15 07:40", u5),
            M("SU-101", 2847.60m, "2026-05-15 07:40", u5),

            // ── SU-102 — Su deposu B hattı ───────────────────────────────
            M("SU-102", 1520.00m, "2026-02-15 07:40", u5),
            M("SU-102", 1680.50m, "2026-03-15 07:42", u5),
            M("SU-102", 1800.10m, "2026-04-15 07:42", u5),
            M("SU-102", 1902.35m, "2026-05-15 07:42", u5),

            // ── SU-103 — Bahçe sulama ────────────────────────────────────
            M("SU-103", 3840.00m, "2026-03-01 10:00", u5),
            M("SU-103", 3988.50m, "2026-04-01 10:00", u5),
            M("SU-103", 4105.00m, "2026-05-01 10:00", u5),

            // ── SU-104 — Yangın rezervi ──────────────────────────────────
            M("SU-104", 920.00m, "2026-03-02 08:10", u5),
            M("SU-104", 950.20m, "2026-04-02 08:15", u5),
            M("SU-104", 980.50m, "2026-05-02 08:20", u5),

            // ── DOG-01 — Jeneratör 1 yakıt ──────────────────────────────
            M("DOG-01", 11200.00m, "2026-01-28 18:00", u4),
            M("DOG-01", 11820.50m, "2026-02-28 18:00", u4),
            M("DOG-01", 12180.00m, "2026-03-28 18:00", u4),
            M("DOG-01", 12520.75m, "2026-04-28 18:00", u4),
            M("DOG-01", 12840.00m, "2026-05-14 10:00", u4),

            // ── DOG-02 — Jeneratör 2 yakıt ──────────────────────────────
            M("DOG-02", 7980.00m, "2026-02-15 12:00", u4),
            M("DOG-02", 8210.80m, "2026-03-15 12:00", u4),
            M("DOG-02", 8450.25m, "2026-04-15 12:00", u4),
            M("DOG-02", 8650.25m, "2026-05-12 12:00", u4),

            // ── Silinmiş kayıtlar ────────────────────────────────────────
            M("ELEK-012", 3344.70m, "2026-01-18 13:45", u2, deleted: true),
            M("ELEK-013", 5012.00m, "2025-11-05 10:10", u2, deleted: true));

        context.SaveChanges();
    }

    private static Meter M(
        string number,
        decimal value,
        string readingDate,
        int unitId,
        bool deleted = false)
    {
        var readAt = DateTime.Parse(readingDate);
        return new Meter
        {
            MeterNumber = number,
            ReadingValue = value,
            ReadingDate = readAt,
            CommunicationUnitId = unitId,
            IsDeleted = deleted,
            CreatedAt = readAt.AddHours(-1),
            UpdatedAt = deleted ? readAt.AddDays(2) : null,
        };
    }
}
