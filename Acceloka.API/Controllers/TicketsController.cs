using Acceloka.API.Features.Tickets.Commands;
using Acceloka.API.Features.Tickets.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Acceloka.API.Controllers;

[ApiController]
[Route("api/v1")]
public class TicketsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TicketsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get-available-ticket")]
    public async Task<IActionResult> GetAvailableTicket([FromQuery] AvailableTicketsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("book-ticket")]
    public async Task<IActionResult> BookTicket([FromBody] BookTicketCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("get-booked-ticket/{BookedTicketId}")]
    public async Task<IActionResult> GetBookedTicketDetail(int BookedTicketId)
    {
        var result = await _mediator.Send(new BookedTicketDetailQuery { BookedTicketId = BookedTicketId });

        return Ok(result);
    }

    [HttpDelete("revoke-ticket/{bookedTicketId}/{ticketCode}/{qty}")]
    public async Task<IActionResult> Revoke(int bookedTicketId,string ticketCode,int qty)
    {
        var result = await _mediator.Send(new RevokeTicketCommand
        {
            BookedTicketId = bookedTicketId,
            TicketCode = ticketCode,
            Quantity = qty
        });

        return Ok(result);
    }


    [HttpPut("edit-booked-ticket/{bookedTicketId}")]
    public async Task<IActionResult> Edit(int bookedTicketId, [FromBody] EditBookedTicketCommand command)
    {
        command.BookedTicketId = bookedTicketId;

        return Ok(await _mediator.Send(command));
    }

}