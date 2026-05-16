# Sayaç Yönetim Uygulaması

Sayaç okumaları ve haberleşme ünitelerini yöneten monorepo: ASP.NET Core 8 API + React dashboard.

## Proje yapısı

```
├── backend/     # Web API (EF Core, SQL Server)
├── frontend/    # React + TypeScript arayüz
└── README.md
```

> **Not:** Kökteki `SayacYonetimUygulamasi/` ve `SayacYonetimFrontend/` eski bilgisayardan gelen yedek kopyalardır. Aktif kod `backend/` ve `frontend/` altındadır; yedekleri silebilirsiniz.

## Özellikler

- Sayaç okuma CRUD (numara, değer, tarih)
- Haberleşme ünitesi yönetimi (ad, IP, port)
- Sayaç–ünite ilişkisi
- Yumuşak silme ve geri yükleme (sayaç ve ünite)
- Özet istatistikler, arama ve sıralama

## Gereksinimler

- .NET 8 SDK
- Node.js 20+
- Docker (macOS’ta SQL Server için)

## Kurulum

### SQL Server (Docker)

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name sayac-sql \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

### Backend

```bash
cd backend
dotnet tool install --global dotnet-ef   # ilk seferde
dotnet ef database update              # veya dotnet run (otomatik migrate)
dotnet run
```

API: http://localhost:5249 — Swagger: http://localhost:5249/swagger

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Arayüz: http://localhost:5173

## API özeti

| Kaynak | Base URL |
|--------|----------|
| Sayaçlar | `/api/sayac` (+ `/deleted`, `/{id}/restore`) |
| Haberleşme üniteleri | `/api/communicationunit` (+ `/deleted`, `/{id}/restore`) |
