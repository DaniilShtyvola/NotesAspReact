using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Notes.Models
{
    public class DbNotesContext : IdentityDbContext<IdentityUser>
    {
        public DbNotesContext(DbContextOptions<DbNotesContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder) { base.OnModelCreating(builder); }

        public DbSet<Note> Notes { get; set; }
    }
}
