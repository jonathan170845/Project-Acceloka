using MediatR;

namespace Acceloka.API.Features.Tickets.Commands;

public class RevokeTicketCommand : IRequest<RevokeTicketResponse>
{
    public int BookedTicketId { get; set; }
    public string TicketCode { get; set; }
    public int Quantity { get; set; }
}

