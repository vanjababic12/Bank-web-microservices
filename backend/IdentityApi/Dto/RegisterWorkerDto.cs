﻿namespace IdentityApi.Dto
{
    public class RegisterWorkerDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long Birthday { get; set; }
        public int BranchId { get; set; }
        public string Address { get; set; }
    }
}