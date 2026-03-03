namespace Acceloka.API.Domain.Entities;

public class BookedTicket
{
    public int Id { get; set; }

    public DateTime BookingDate { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public ICollection<BookedTicketDetail> Details { get; set; } = new List<BookedTicketDetail>();
}

