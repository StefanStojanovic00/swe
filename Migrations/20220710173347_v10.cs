using Microsoft.EntityFrameworkCore.Migrations;

namespace Aplikacija.Migrations
{
    public partial class v10 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VoznjaID",
                table: "Stanice",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Stanice_VoznjaID",
                table: "Stanice",
                column: "VoznjaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Stanice_Voznje_VoznjaID",
                table: "Stanice",
                column: "VoznjaID",
                principalTable: "Voznje",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stanice_Voznje_VoznjaID",
                table: "Stanice");

            migrationBuilder.DropIndex(
                name: "IX_Stanice_VoznjaID",
                table: "Stanice");

            migrationBuilder.DropColumn(
                name: "VoznjaID",
                table: "Stanice");
        }
    }
}
