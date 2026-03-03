using MediatR;
using System.Text.Json.Serialization;

namespace Acceloka.API.Features.Tickets.Commands;

public class EditBookedTicketCommand : IRequest<EditBookedTicketResponse>
{
    [JsonIgnore]
    public int BookedTicketId { get; set; }
    public List<EditTicketItem> Tickets { get; set; }
}

public class EditTicketItem
{
    public string TicketCode { get; set; }
    public int Quantity { get; set; }
}
