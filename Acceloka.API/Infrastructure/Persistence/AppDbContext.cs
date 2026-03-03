using Acceloka.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.API.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    public DbSet<Ticket> Tickets => Set<Ticket>();

    public DbSet<BookedTicket> BookedTickets => Set<BookedTicket>();

    public DbSet<BookedTicketDetail> BookedTicketsDetail => Set<BookedTicketDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ticket>()
            .HasIndex(t => t.TicketCode)
            .IsUnique();

        modelBuilder.Entity<BookedTicketDetail>()
            .HasOne(d => d.BookedTicket)
            .WithMany(b => b.Details)
            .HasForeignKey(d => d.BookedTicketId);

        modelBuilder.Entity<BookedTicketDetail>()
            .HasOne(d => d.Ticket)
            .WithMany()
            .HasForeignKey(d => d.TicketCode)
            .HasPrincipalKey(t => t.TicketCode);
    }
}
