import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodSerializationException } from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(ZodSerializationException)
export class ZodInterceptorError implements ExceptionFilter {
  private readonly logger = new Logger(ZodInterceptorError.name);

  catch(exception: ZodSerializationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errors = exception.getZodError() as ZodError;
    this.logger.error(
      `ZodError on [${request.method} ${request.url}]: ${JSON.stringify(errors.issues)}`,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
