using FluentValidation;
using Acceloka.API.Features.Tickets.Commands;

namespace Acceloka.API.Features.Tickets.Validators;

public class BookTicketValidator : AbstractValidator<BookTicketCommand>
{
    public BookTicketValidator()
    {
        RuleFor(x => x.Tickets)
            .NotEmpty();

        RuleForEach(x => x.Tickets).ChildRules(ticket =>
        {
            ticket.RuleFor(t => t.TicketCode)
                .NotEmpty();

            ticket.RuleFor(t => t.Quantity)
                .GreaterThan(0);
        });
    }
}
