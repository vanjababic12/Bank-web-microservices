using System;

namespace BranchApi.Dto
{
    public class CreateAppointmentDto
    {
        public int BranchId { get; set; }
        public DateTime AppointmentDate { get; set; } // Datum termina

    }
}
