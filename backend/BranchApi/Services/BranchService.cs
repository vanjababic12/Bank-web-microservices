using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using BranchApi.Dto;
using BranchApi.Infrastructure;
using BranchApi.Interfaces;
using BranchApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Common.Exceptions;

namespace BranchApi.Services
{
    public class BranchService : IBranchService
    {
        private readonly BranchDbContext _dbContext;

        public BranchService(BranchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Branch> GetAllBranches()
        {
            return _dbContext.Branches.ToList();
        }

        public Branch GetBranch(int id)
        {
            return _dbContext.Branches.Find(id) ?? throw new NotFoundException("Branch not found");
        }

        public List<Branch> SearchAndSortBranches(string searchTerm, string sortField, bool ascending)
        {
            var query = _dbContext.Branches.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(b => b.Name.Contains(searchTerm) || b.Address.Contains(searchTerm));
            }

            query = sortField switch
            {
                "name" => ascending ? query.OrderBy(b => b.Name) : query.OrderByDescending(b => b.Name),
                "address" => ascending ? query.OrderBy(b => b.Address) : query.OrderByDescending(b => b.Address),
                _ => query
            };

            return query.ToList();
        }

        public async Task<Branch> CreateBranch(BranchDto branchDto)
        {
            var branch = new Branch
            {
                Name = branchDto.Name,
                Address = branchDto.Address,
                PhoneNumber = branchDto.PhoneNumber,
                OpeningTime = branchDto.OpeningTime,
                ClosingTime = branchDto.ClosingTime,
            };
            _dbContext.Branches.Add(branch);
            await _dbContext.SaveChangesAsync();
            return branch;
        }

        public async Task<Branch> UpdateBranch(int id, BranchDto branchDto)
        {
            var branch = _dbContext.Branches.Find(id);
            if (branch == null)
            {
                throw new NotFoundException("Branch not found");
            }
            branch.Name = branchDto.Name;
            branch.Address = branchDto.Address;
            branch.PhoneNumber = branchDto.PhoneNumber;
            branch.OpeningTime = branchDto.OpeningTime;
            branch.ClosingTime = branchDto.ClosingTime;
            await _dbContext.SaveChangesAsync();
            return branch;
        }

        public void DeleteBranch(int id)
        {
            var branch = _dbContext.Branches.Find(id);
            if (branch == null)
            {
                throw new NotFoundException("Branch not found");
            }
            _dbContext.Branches.Remove(branch);
            _dbContext.SaveChanges();
        }

        public List<Appointment> GetAvailableAppointments(int branchId, DateTime date)
        {
            return _dbContext.Appointments
                .Where(a => a.BranchId == branchId && a.AppointmentDate.Date == date.Date && !a.IsBooked)
                .ToList();
        }

        public async Task<BookAppointmentResult> BookAppointment(int appointmentId, String clientUsername)
        {
            var appointment = _dbContext.Appointments
                .FirstOrDefault(a => a.Id == appointmentId);

            if (appointment == null || appointment.IsBooked)
            {
                return new BookAppointmentResult { Success = false, Message = "Termin nije dostupan ili ne postoji." };
            }

            appointment.CustomerUsername = clientUsername;
            await _dbContext.SaveChangesAsync();
            return new BookAppointmentResult { Success = true, Message = "Termin je uspešno zakazan." };
        }

        public async Task<bool> CancelAppointment(int appointmentId)
        {
            var appointment = _dbContext.Appointments.Find(appointmentId);

            if (appointment == null || !appointment.IsBooked)
            {
                return false; // Termin ne postoji ili nije zauzet
            }

            appointment.CustomerUsername = null; // Oslobađanje termina
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public List<Appointment> GetUserAppointments(string username)
        {
            return _dbContext.Appointments
                .Where(a => a.CustomerUsername == username)
                .ToList();
        }
    }
}
