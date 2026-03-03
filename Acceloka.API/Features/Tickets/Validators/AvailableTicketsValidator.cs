using FluentValidation;
using Acceloka.API.Features.Tickets.Queries;

namespace Acceloka.API.Features.Tickets.Validators;

public class AvailableTicketsValidator
    : AbstractValidator<AvailableTicketsQuery>
{
    public AvailableTicketsValidator()
    {
        RuleFor(x => x.MaxPrice)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MaxPrice.HasValue);

        RuleFor(x => x.EventDateTo)
            .GreaterThanOrEqualTo(x => x.EventDateFrom.Value)
            .When(x => x.EventDateFrom.HasValue && x.EventDateTo.HasValue)
            .WithMessage("EventDateTo must be greater than or equal to EventDateFrom.");

        RuleFor(x => x.OrderState)
            .Must(x => x == null || x.ToLower() == "asc" || x.ToLower() == "desc")
            .WithMessage("OrderState must be 'asc' or 'desc'");

        RuleFor(x => x.PageNumber)
            .GreaterThan(0)
            .WithMessage("Page Number must be greater than 0");

        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .LessThanOrEqualTo(10)
            .WithMessage("Page Size must be between 1 and 10");
    }
}
