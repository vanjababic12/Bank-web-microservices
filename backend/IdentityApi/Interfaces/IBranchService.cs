using IdentityApi.Dto;
using System.Threading.Tasks;

namespace IdentityApi.Interfaces
{
    public interface IBranchService
    {
        Task<BranchDto> GetBranchAsync(int branchId);
    }
}
