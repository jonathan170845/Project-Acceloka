namespace Acceloka.API.Features.Tickets.Commands;

public class RevokeTicketResponse
{
    public string TicketCode { get; set; }
    public string TicketName { get; set; }
    public string CategoryName { get; set; }
    public int RemainingQuantity { get; set; }
}
