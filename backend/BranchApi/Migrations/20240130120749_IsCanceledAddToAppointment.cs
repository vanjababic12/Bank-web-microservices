﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BranchApi.Migrations
{
    public partial class IsCanceledAddToAppointment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCanceled",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCanceled",
                table: "Appointments");
        }
    }
}
