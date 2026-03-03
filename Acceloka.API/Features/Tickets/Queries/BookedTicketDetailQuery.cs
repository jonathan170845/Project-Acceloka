using MediatR;

namespace Acceloka.API.Features.Tickets.Queries;

public class BookedTicketDetailQuery
    : IRequest<List<BookedTicketDetailResponse>>
{
    public int BookedTicketId { get; set; }
}
