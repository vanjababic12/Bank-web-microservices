using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BranchApi.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        [ForeignKey("Branch")]
        public int BranchId { get; set; }
        public DateTime AppointmentDate { get; set; } // Datum termina
        public string CustomerUsername { get; set; } // Korisničko ime umesto imena kupca
        public bool IsCanceled { get; set; } = false;
        public bool IsBooked => !string.IsNullOrEmpty(CustomerUsername); // Proverava da li je termin zauzet
        public virtual Branch Branch { get; set; }
    }
}
