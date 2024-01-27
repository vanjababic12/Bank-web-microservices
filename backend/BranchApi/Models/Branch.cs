using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BranchApi.Models
{
    public class Branch
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string OpeningTime { get; set; } // ISO 8601 format "HH:mm:ss"
        public string ClosingTime { get; set; } // ISO 8601 format "HH:mm:ss"
        [JsonIgnore]
        public virtual ICollection<Appointment> Appointments { get; set; }

    }

}
