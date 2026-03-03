namespace Acceloka.API.Features.Tickets.Commands
{
    public class EditBookedTicketResponse
    {
        public decimal GrandTotal { get; set; }
        public List<EditedTicketResult> Tickets { get; set; }
    }

    public class EditedTicketResult
    {
        public string TicketCode { get; set; }
        public string TicketName { get; set; }
        public string CategoryName { get; set; }
        public int Quantity { get; set; }
    }

}
