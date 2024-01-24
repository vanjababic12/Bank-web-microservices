using System;

namespace BranchApi.Dto
{
    public class CreateAppointmentDto
    {
        public int BranchId { get; set; }
        public DateTime AppointmentDate { get; set; } // Datum termina
        public string AppointmentTime { get; set; } // Vreme termina kao string (npr. "14:00")
        public string CustomerUsername { get; set; } // Korisničko ime umesto imena kupca

    }
}
