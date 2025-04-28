import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : new InternalServerErrorException().getStatus();
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

export function assertFound<T>(
  value: T | null | undefined,
  message = 'Resource not found',
): T {
  if (!value) {
    throw new NotFoundException(message);
  }
  return value;
}
