using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SayacYonetimUygulamasi.Migrations
{
    /// <inheritdoc />
    public partial class AddCommunicationUnit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Önce CommunicationUnits tablosunu oluştur
            migrationBuilder.CreateTable(
                name: "CommunicationUnits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Port = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunicationUnits", x => x.Id);
                });

            // 2. Default CommunicationUnit ekle
            migrationBuilder.InsertData(
                table: "CommunicationUnits",
                columns: new[] { "Name", "IpAddress", "Port", "IsDeleted", "CreatedAt" },
                values: new object[] { "Varsayılan Ünite", "192.168.1.1", 8080, false, DateTime.Now });

            // 3. Meters tablosuna yeni kolonları ekle (CommunicationUnitId'yi nullable yap)
            migrationBuilder.AddColumn<int>(
                name: "CommunicationUnitId",
                table: "Meters",
                type: "int",
                nullable: true); // nullable yap

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Meters",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Meters",
                type: "datetime2",
                nullable: true);

            // 4. Mevcut sayaçları varsayılan CommunicationUnit'e bağla
            migrationBuilder.Sql("UPDATE Meters SET CommunicationUnitId = 1");

            // 5. CommunicationUnitId'yi required yap
            migrationBuilder.AlterColumn<int>(
                name: "CommunicationUnitId",
                table: "Meters",
                type: "int",
                nullable: false);

            // 6. Index oluştur
            migrationBuilder.CreateIndex(
                name: "IX_Meters_CommunicationUnitId",
                table: "Meters",
                column: "CommunicationUnitId");

            // 7. Foreign key constraint ekle
            migrationBuilder.AddForeignKey(
                name: "FK_Meters_CommunicationUnits_CommunicationUnitId",
                table: "Meters",
                column: "CommunicationUnitId",
                principalTable: "CommunicationUnits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meters_CommunicationUnits_CommunicationUnitId",
                table: "Meters");

            migrationBuilder.DropTable(
                name: "CommunicationUnits");

            migrationBuilder.DropIndex(
                name: "IX_Meters_CommunicationUnitId",
                table: "Meters");

            migrationBuilder.DropColumn(
                name: "CommunicationUnitId",
                table: "Meters");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Meters");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Meters");
        }
    }
}
