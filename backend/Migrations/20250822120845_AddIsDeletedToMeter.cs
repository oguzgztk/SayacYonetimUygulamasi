using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SayacYonetimUygulamasi.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDeletedToMeter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Check if the column already exists before adding it
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Meters]') AND name = 'IsDeleted')
                BEGIN
                    ALTER TABLE [Meters] ADD [IsDeleted] bit NOT NULL DEFAULT 0
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Meters");
        }
    }
}
