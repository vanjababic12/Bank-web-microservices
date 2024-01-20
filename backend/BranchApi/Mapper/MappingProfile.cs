using AutoMapper;
using BranchApi.Dto;
using BranchApi.Models;

namespace Backend.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Branch, BranchDto>().ReverseMap();
            CreateMap<Branch, AppointmentDto>().ReverseMap();
        }
    }
}
