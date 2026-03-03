using Acceloka.API.Domain.Entities;
using Acceloka.API.Infrastructure.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.API.Features.Tickets.Commands;

public class BookTicketHandler: IRequestHandler<BookTicketCommand, BookTicketResponse>
{
    private readonly AppDbContext _context;
    private readonly IValidator<BookTicketCommand> _validator;

    public BookTicketHandler(AppDbContext context, IValidator<BookTicketCommand> validator)
    {
        _context = context;
        _validator = validator;
    }

    public async Task<BookTicketResponse> Handle(BookTicketCommand request, CancellationToken cancellationToken)
    {
        await _validator.ValidateAndThrowAsync(request, cancellationToken);

        var bookingDate = DateTime.Now;

        var ticketsDictionary = new Dictionary<string, Ticket>();

        foreach (var item in request.Tickets)
        {
            var ticket = await _context.Tickets
                .FirstOrDefaultAsync(x => x.TicketCode == item.TicketCode, cancellationToken);

            if (ticket == null)
            {
                throw new ValidationException($"Ticket code {item.TicketCode} not found.");
            }

            if (ticket.Quota <= 0)
            {
                throw new ValidationException($"Ticket {item.TicketCode} quota is empty. Please choose another ticket.");
            }

            if (item.Quantity > ticket.Quota)
            {
                throw new ValidationException($"Quantity exceeds remaining quota. Quota remaining is {ticket.Quota}");
            }

            if (ticket.EventDate <= bookingDate)
            {
                throw new ValidationException("Event date already passed. Please choose another ticket.");
            }

            ticketsDictionary.Add(item.TicketCode, ticket);
        }

        var bookedTicket = new BookedTicket
        {
            BookingDate = bookingDate,
            Status = "Booked",
            CreatedAt = DateTime.Now
        };

        await _context.BookedTickets.AddAsync(bookedTicket, cancellationToken);

        var results = new List<BookedTicketResult>();
        decimal total = 0;

        foreach (var item in request.Tickets)
        {
            var ticket = ticketsDictionary[item.TicketCode];

            ticket.Quota -= item.Quantity;

            var detail = new BookedTicketDetail
            {
                BookedTicket = bookedTicket,
                TicketCode = ticket.TicketCode,
                Quantity = item.Quantity
            };

            await _context.BookedTicketsDetail.AddAsync(detail, cancellationToken);

            results.Add(new BookedTicketResult
            {
                TicketCode = ticket.TicketCode,
                TicketName = ticket.TicketName,
                Price = ticket.Price,
                Quantity = item.Quantity,
                CategoryName = ticket.CategoryName
            });

            total += ticket.Price * item.Quantity;
        }

        var grouped = results
            .GroupBy(x => x.CategoryName)
            .Select(y => new TicketPerCategoryResponse
            {
                CategoryName = y.Key,
                SummaryPrice = y.Sum(x => x.Price * x.Quantity),
                Tickets = y.ToList()
            })
            .ToList();

        var final = total;

        await _context.SaveChangesAsync(cancellationToken);

        return new BookTicketResponse
        {
            PriceSummary = final,
            TicketsPerCategories = grouped
        };
    }

}
