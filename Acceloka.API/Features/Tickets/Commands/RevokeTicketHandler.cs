using Acceloka.API.Infrastructure.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.API.Features.Tickets.Commands;

public class RevokeTicketHandler: IRequestHandler<RevokeTicketCommand, RevokeTicketResponse>
{
    private readonly AppDbContext _context;

    public RevokeTicketHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RevokeTicketResponse> Handle(RevokeTicketCommand request, CancellationToken cancellationToken)
    {
        var booking = await _context.BookedTickets
            .FirstOrDefaultAsync(x => x.Id == request.BookedTicketId, cancellationToken);

        if (booking == null)
        {
            throw new ValidationException("BookedTicketId not registered.");
        }


        var detail = await _context.BookedTicketsDetail
            .FirstOrDefaultAsync(x =>
                x.BookedTicketId == request.BookedTicketId &&
                x.TicketCode == request.TicketCode,
                cancellationToken);

        if (detail == null)
        {
            throw new ValidationException("Ticket code not found in this booking.");
        }

        if (request.Quantity > detail.Quantity)
        {
            throw new ValidationException("Qty exceeds booked quantity.");
        }

        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(x => x.TicketCode == request.TicketCode, cancellationToken);

        if (ticket == null)
        {
            throw new ValidationException("Ticket code not registered.");
        }

        if (ticket.EventDate < DateTime.Now)
        {
            throw new ValidationException("Cannot revoke ticket. Event has already passed.");
        }

        ticket.Quota += request.Quantity;

        detail.Quantity -= request.Quantity;

        if (detail.Quantity == 0)
        {
            _context.BookedTicketsDetail.Remove(detail);
        }

        var remainingDetails = await _context.BookedTicketsDetail
            .AnyAsync(x => x.BookedTicketId == request.BookedTicketId, cancellationToken);

        if (!remainingDetails)
        {
            _context.BookedTickets.Remove(booking);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new RevokeTicketResponse
        {
            TicketCode = ticket.TicketCode,
            TicketName = ticket.TicketName,
            CategoryName = ticket.CategoryName,
            RemainingQuantity = detail.Quantity < 0 ? 0 : detail.Quantity
        };
    }
}
