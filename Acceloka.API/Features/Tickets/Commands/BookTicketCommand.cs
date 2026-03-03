using MediatR;

namespace Acceloka.API.Features.Tickets.Commands;

public class BookTicketCommand : IRequest<BookTicketResponse>
{
    public List<BookTicketItem> Tickets { get; set; } = new();
}

public class BookTicketItem
{
    public string TicketCode { get; set; } = null!;

    public int Quantity { get; set; }
}
