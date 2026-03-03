namespace Acceloka.API.Domain.Entities;

public class BookedTicketDetail
{
    public int Id { get; set; }

    public int BookedTicketId { get; set; }

    public string TicketCode { get; set; } = null!;

    public int Quantity { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public BookedTicket BookedTicket { get; set; } = null!;

    public Ticket Ticket { get; set; } = null!;
}

