namespace Acceloka.API.Domain.Entities;

public class Ticket
{
    public int Id { get; set; }

    public string TicketCode { get; set; } = null!;

    public string TicketName { get; set; } = null!;

    public string CategoryName { get; set; } = null!;

    public DateTime EventDate { get; set; }

    public decimal Price { get; set; }

    public int Quota { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}

