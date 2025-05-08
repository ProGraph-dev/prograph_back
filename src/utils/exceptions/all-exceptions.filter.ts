import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

/**
 * A global exception filter that catches all exceptions thrown in the application.
 *
 * It determines the appropriate HTTP status code and error message based on the type of exception:
 * - If the exception is an instance of `HttpException`, it uses its status and response.
 * - Otherwise, it treats it as an internal server error (500).
 *
 * The filter then sends a structured JSON response containing:
 * - `statusCode`: HTTP status of the error.
 * - `message`: error message or payload from the exception.
 * - `timestamp`: when the error occurred.
 * - `path`: the URL of the request that caused the error.
 *
 * This is useful for logging and debugging, and for providing clients with consistent error responses.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).send({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

/**
 * Throws a `NotFoundException` if the given value is `null` or `undefined`.
 * Useful for ensuring required resources are present (e.g., database records).
 *
 * @param value - The value to assert (e.g., from a DB query).
 * @param message - Optional custom message for the exception.
 * @returns The value itself if it's not null or undefined.
 * @throws NotFoundException if the value is null or undefined.
 */
export function assertFound<T>(
  value: T | null | undefined,
  message = 'Resource not found',
): T {
  if (!value) {
    throw new NotFoundException(message);
  }
  return value;
}
