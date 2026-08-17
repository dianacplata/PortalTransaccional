import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../../domain/exceptions/DomainException';

const HTTP_STATUS_MAP: Record<string, HttpStatus> = {
  PRODUCT_NOT_FOUND:     HttpStatus.NOT_FOUND,
  TRANSACTION_NOT_FOUND: HttpStatus.NOT_FOUND,
  INSUFFICIENT_STOCK:    HttpStatus.CONFLICT,
  PAYMENT_FAILED:        HttpStatus.UNPROCESSABLE_ENTITY,
};

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HTTP_STATUS_MAP[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.warn(`DomainException [${exception.code}]: ${exception.message}`);

    response.status(status).json({
      statusCode: status,
      code:       exception.code,
      message:    exception.message,
    });
  }
}
