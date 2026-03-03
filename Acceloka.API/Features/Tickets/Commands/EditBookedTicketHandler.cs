using Acceloka.API.Infrastructure.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.API.Features.Tickets.Commands;

public class EditBookedTicketHandler
    : IRequestHandler<EditBookedTicketCommand, EditBookedTicketResponse>
{
    private readonly AppDbContext _context;

    public EditBookedTicketHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<EditBookedTicketResponse> Handle(EditBookedTicketCommand request, CancellationToken cancellationToken)
    {
        using var dbTransaction = await _context.Database
            .BeginTransactionAsync(cancellationToken);

        try
        {
            var bookingHeader = await _context.BookedTickets
                .FirstOrDefaultAsync(x => x.Id == request.BookedTicketId, cancellationToken);

            if (bookingHeader == null)
                throw new ValidationException("Id not found.");

            var update = new List<EditedTicketResult>();

            foreach (var item in request.Tickets)
            {
                var detailRow = await _context.BookedTicketsDetail
                    .FirstOrDefaultAsync(x =>
                        x.BookedTicketId == request.BookedTicketId &&
                        x.TicketCode == item.TicketCode,
                        cancellationToken);

                if (detailRow == null)
                {
                    throw new ValidationException($"{item.TicketCode} ticket does not exist in data.");
                }

                if (item.Quantity < 1)
                {
                    throw new ValidationException("The minimum quantity is 1.");
                }

                var ticketMaster = await _context.Tickets
                    .FirstOrDefaultAsync(x => x.TicketCode == item.TicketCode, cancellationToken);

                if (ticketMaster == null)
                {
                    throw new ValidationException($"{item.TicketCode} ticket is not registered.");
                }

                if (ticketMaster.EventDate < DateTime.Now)
                {
                    throw new ValidationException($"Cannot edit {item.TicketCode}. Event has already passed.");
                }

                var available = ticketMaster.Quota + detailRow.Quantity;

                if (item.Quantity > available)
                {
                    throw new ValidationException("Quantity exceeds remaining quota.");
                }

                ticketMaster.Quota = available - item.Quantity;

                detailRow.Quantity = item.Quantity;

                update.Add(new EditedTicketResult
                {
                    TicketCode = ticketMaster.TicketCode,
                    TicketName = ticketMaster.TicketName,
                    CategoryName = ticketMaster.CategoryName,
                    Quantity = detailRow.Quantity
                });
            }

            await _context.SaveChangesAsync(cancellationToken);

            var total = await _context.BookedTicketsDetail
                .Where(x => x.BookedTicketId == request.BookedTicketId)
                .Join(_context.Tickets,
                    detail => detail.TicketCode,
                    ticket => ticket.TicketCode,
                    (detail, ticket) => detail.Quantity * ticket.Price)
                .SumAsync(cancellationToken);

            await dbTransaction.CommitAsync(cancellationToken);

            return new EditBookedTicketResponse
            {
                GrandTotal = total,
                Tickets = update
            };
        }
        catch
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}

