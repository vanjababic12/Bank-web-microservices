using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LoanApi.Models;

namespace LoanApi.Infrastructure.Configuration
{
    public class LoanTypeConfiguration : IEntityTypeConfiguration<LoanType>
    {
        public void Configure(EntityTypeBuilder<LoanType> builder)
        {
            builder.HasKey(lt => lt.Id);
            builder.Property(lt => lt.Name).IsRequired();
            builder.Property(lt => lt.InterestRate).HasColumnType("decimal(18, 4)");
            builder.Property(lt => lt.Description).IsRequired();
            builder.Property(lt => lt.IsDeleted).HasDefaultValue(false);
        }
    }

}
