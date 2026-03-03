namespace Acceloka.API.Features.Tickets.Queries;

public class AvailableTicketsResponse
{
    public string CategoryName { get; set; } = null!;

    public string TicketCode { get; set; } = null!;

    public string TicketName { get; set; } = null!;

    public DateTime EventDate { get; set; }

    public decimal Price { get; set; }

    public int RemainingQuota { get; set; }
}

