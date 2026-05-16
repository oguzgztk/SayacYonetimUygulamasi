# Sayaç Yönetim Uygulaması

Staj projesi kapsamında geliştirilen sayaç okuma yönetim sistemi. ASP.NET Core 8 Web API backend ve React + TypeScript frontend içerir.

## Proje Yapısı

```
├── backend/     # ASP.NET Core 8 API (EF Core + SQL Server)
├── frontend/    # React + Vite + TypeScript dashboard
└── README.md
```

## Gereksinimler

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20+
- SQL Server (Windows: SQLEXPRESS / macOS-Linux: Docker)

## Kurulum

### 1. SQL Server (macOS / Linux — Docker)

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name sayac-sql \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Geliştirme ortamında bağlantı dizesi `backend/appsettings.Development.json` içinde tanımlıdır.

### 2. Backend

```bash
cd backend
dotnet ef database update
dotnet run
```

API: http://localhost:5249  
Swagger: http://localhost:5249/swagger

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Arayüz: http://localhost:5173

## API Uç Noktaları

| Metot | URL | Açıklama |
|-------|-----|----------|
| GET | `/api/sayac` | Tüm okumalar |
| GET | `/api/sayac/{id}` | Tek okuma |
| POST | `/api/sayac` | Yeni okuma |
| PUT | `/api/sayac/{id}` | Güncelle |
| DELETE | `/api/sayac/{id}` | Sil |

## Özellikler

- Özet istatistik kartları (toplam kayıt, bu ay, son okuma)
- Sayaç numarasına göre arama
- Tarih, değer ve sayaç no'ya göre sıralama
- Okuma ekleme, düzenleme ve silme
- Mobil uyumlu kart görünümü

## Üretim Derlemesi

```bash
cd frontend && npm run build
cd ../backend && dotnet publish -c Release
```

Frontend üretim derlemesi `frontend/dist` klasöründe oluşur.
