using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Notes.Models
{
    public class DbAplication1Context : IdentityDbContext<IdentityUser>
    {
        public DbAplication1Context(DbContextOptions<DbAplication1Context> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder) { base.OnModelCreating(builder); }

        public DbSet<Note> Notes { get; set; }
    }
}
