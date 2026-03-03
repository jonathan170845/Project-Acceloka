using System.Net;
using System.Text.Json;
using FluentValidation;

namespace Acceloka.API.Common.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/problem+json";

            var problem = new
            {
                type = "https://datatracker.ietf.org/doc/html/rfc7807",
                title = "Validation Error",
                status = 400,
                errors = ex.Errors.Any()
                    ? ex.Errors.Select(e => e.ErrorMessage)
                    : new[] { ex.Message }
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/problem+json";

            var problem = new
            {
                type = "https://datatracker.ietf.org/doc/html/rfc7807",
                title = "Internal Server Error",
                status = 500,
                detail = ex.Message
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
        }
    }
}
