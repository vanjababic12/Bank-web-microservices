using System;

namespace BranchApi.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int BranchId { get; set; }
        public DateTime AppointmentDate { get; set; } // Datum termina
        public string CustomerUsername { get; set; } // Korisničko ime umesto imena kupca

        public bool IsBooked => !string.IsNullOrEmpty(CustomerUsername); // Proverava da li je termin zauzet
    }
}
