using Acceloka.API.Infrastructure.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.API.Features.Tickets.Queries;

public class BookedTicketDetailHandler: IRequestHandler<BookedTicketDetailQuery, List<BookedTicketDetailResponse>>
{
    private readonly AppDbContext _context;

    public BookedTicketDetailHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BookedTicketDetailResponse>> Handle(BookedTicketDetailQuery request, CancellationToken cancellationToken)
    {
        var booking = await _context.BookedTickets
            .FirstOrDefaultAsync(x => x.Id == request.BookedTicketId, cancellationToken);

        if (booking == null)
        {
            throw new ValidationException("Id not found.");
        }

        var flat = await _context.BookedTicketsDetail
            .Where(d => d.BookedTicketId == request.BookedTicketId)
            .Join(_context.Tickets,
                detail => detail.TicketCode,
                ticket => ticket.TicketCode,
                (detail, ticket) => new
                {
                    ticket.CategoryName,
                    ticket.TicketCode,
                    ticket.TicketName,
                    ticket.EventDate,
                    detail.Quantity
                })
            .ToListAsync(cancellationToken);

        var grouped = flat
            .GroupBy(x => x.CategoryName)
            .Select(group => new BookedTicketDetailResponse
            {
                CategoryName = group.Key,
                Tickets = group.Select(x => new BookedTicketItemResponse
                {
                    TicketCode = x.TicketCode,
                    TicketName = x.TicketName,
                    EventDate = x.EventDate,
                    Quantity = x.Quantity
                }).ToList()
            })
            .ToList();

        return grouped;
    }
}
