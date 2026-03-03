using MediatR;

namespace Acceloka.API.Features.Tickets.Queries;

public class AvailableTicketsQuery : IRequest<List<AvailableTicketsResponse>>
{
    public string? CategoryName { get; set; }

    public string? TicketCode { get; set; }

    public string? TicketName { get; set; }

    public decimal? MaxPrice { get; set; }

    public DateTime? EventDateFrom { get; set; }

    public DateTime? EventDateTo { get; set; }

    public string? OrderBy { get; set; }

    public string? OrderState { get; set; }

    public int PageNumber { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}
