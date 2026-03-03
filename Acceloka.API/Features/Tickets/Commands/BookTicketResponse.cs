namespace Acceloka.API.Features.Tickets.Commands;

public class BookTicketResponse
{
    public decimal PriceSummary { get; set; }

    public List<TicketPerCategoryResponse> TicketsPerCategories { get; set; }
}

public class TicketPerCategoryResponse
{
    public string CategoryName { get; set; }

    public decimal SummaryPrice { get; set; }

    public List<BookedTicketResult> Tickets { get; set; }
}

public class BookedTicketResult
{
    public string TicketCode { get; set; }

    public string TicketName { get; set; }

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public string CategoryName { get; set; }
}
