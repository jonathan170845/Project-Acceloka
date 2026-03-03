namespace Acceloka.API.Features.Tickets.Queries;

public class BookedTicketItemResponse
{
    public string TicketCode { get; set; } = null!;
    public string TicketName { get; set; } = null!;
    public DateTime EventDate { get; set; }
    public int Quantity { get; set; }
}

public class BookedTicketDetailResponse
{
    public string CategoryName { get; set; } = null!;
    public List<BookedTicketItemResponse> Tickets { get; set; } = new();
}