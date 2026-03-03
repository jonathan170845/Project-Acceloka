using Acceloka.API.Infrastructure.Persistence;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.API.Features.Tickets.Queries;

public class GetAvailableTicketsHandler: IRequestHandler<AvailableTicketsQuery, List<AvailableTicketsResponse>>
{
    private readonly AppDbContext _context;
    private readonly IValidator<AvailableTicketsQuery> _validator;

    public GetAvailableTicketsHandler(AppDbContext context, IValidator<AvailableTicketsQuery> validator)
    {
        _context = context;
        _validator = validator;
    }

    public async Task<List<AvailableTicketsResponse>> Handle(AvailableTicketsQuery request, CancellationToken cancellationToken)
    {
        await _validator.ValidateAndThrowAsync(request, cancellationToken);

        var today = DateTime.UtcNow.Date;

        var query = _context.Tickets
            .Where(x => x.IsActive
                && x.Quota > 0
                && x.EventDate.Date >= today)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.CategoryName))
        {
            query = query.Where(x => x.CategoryName.Contains(request.CategoryName));
        }

        if (!string.IsNullOrEmpty(request.TicketCode))
        {
            query = query.Where(x => x.TicketCode.Contains(request.TicketCode));
        }

        if (!string.IsNullOrEmpty(request.TicketName))
        {
            query = query.Where(x => x.TicketName.Contains(request.TicketName));
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(x => x.Price <= request.MaxPrice.Value);
        }

        if (request.EventDateFrom.HasValue)
        {
            query = query.Where(x => x.EventDate >= request.EventDateFrom.Value);
        }

        if (request.EventDateTo.HasValue)
        {
            query = query.Where(x => x.EventDate <= request.EventDateTo.Value);
        }

        var orderBy = string.IsNullOrEmpty(request.OrderBy)
            ? "TicketCode"
            : request.OrderBy;

        var orderState = string.IsNullOrEmpty(request.OrderState)
            ? "asc"
            : request.OrderState.ToLower();

        query = orderBy.ToLower() switch
        {
            "categoryname" => orderState == "desc"
                ? query.OrderByDescending(x => x.CategoryName)
                : query.OrderBy(x => x.CategoryName),

            "ticketcode" => orderState == "desc"
                ? query.OrderByDescending(x => x.TicketCode)
                : query.OrderBy(x => x.TicketCode),

            "ticketname" => orderState == "desc"
                ? query.OrderByDescending(x => x.TicketName)
                : query.OrderBy(x => x.TicketName),

            "eventdate" => orderState == "desc"
                ? query.OrderByDescending(x => x.EventDate)
                : query.OrderBy(x => x.EventDate),

            "price" => orderState == "desc"
                ? query.OrderByDescending(x => x.Price)
                : query.OrderBy(x => x.Price),

            _ => query.OrderBy(x => x.TicketCode)
        };

        query = query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize);

        return await query.Select(x => new AvailableTicketsResponse
        {
            CategoryName = x.CategoryName,
            TicketCode = x.TicketCode,
            TicketName = x.TicketName,
            EventDate = x.EventDate,
            Price = x.Price,
            RemainingQuota = x.Quota
        }).ToListAsync(cancellationToken);
    }
}
