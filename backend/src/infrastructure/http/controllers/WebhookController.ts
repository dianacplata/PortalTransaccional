import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../../../domain/ports/ITransactionRepository';
import { TransactionStatus } from '../../../domain/value-objects/TransactionStatus';
import { Inject } from '@nestjs/common';

interface WompiWebhookBody {
  event: string;
  data: {
    transaction?: {
      id: string;
      status: string;
      reference: string;
    };
  };
  timestamp: number;
}

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly config: ConfigService,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  @Post('wompi')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recibe eventos del gateway de pago (HMAC-SHA256 requerido)' })
  @ApiOkResponse({ description: 'Evento procesado' })
  @ApiUnauthorizedResponse({ description: 'Firma inválida' })
  async handleWompiEvent(
    @Body() body: WompiWebhookBody,
    @Headers('x-event-checksum') signature: string,
  ) {
    this.validateSignature(body, signature);

    if (body.event !== 'transaction.updated' || !body.data.transaction) {
      return { received: true };
    }

    const { reference, status: rawStatus } = body.data.transaction;
    const newStatus = this.mapStatus(rawStatus);

    const transaction = await this.transactionRepo.findByReference(reference);
    if (!transaction) {
      this.logger.warn(`Webhook: transaction with reference "${reference}" not found`);
      return { received: true };
    }

    if (transaction.isCompleted) {
      this.logger.log(`Webhook: transaction ${transaction.id} already completed — skip`);
      return { received: true };
    }

    transaction.updateStatus(newStatus);
    await this.transactionRepo.update(transaction);
    this.logger.log(`Webhook: transaction ${transaction.id} updated to ${newStatus}`);

    return { received: true };
  }

  private validateSignature(body: unknown, signature: string): void {
    const eventsKey = this.config.get<string>('PAY_EVENTS_KEY') ?? '';
    if (!eventsKey) {
      this.logger.warn('PAY_EVENTS_KEY not set — skipping webhook signature check');
      return;
    }
    const computed = crypto
      .createHmac('sha256', eventsKey)
      .update(JSON.stringify(body))
      .digest('hex');

    if (computed !== signature) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  private mapStatus(raw: string): TransactionStatus {
    const map: Record<string, TransactionStatus> = {
      APPROVED: TransactionStatus.APPROVED,
      DECLINED: TransactionStatus.DECLINED,
      VOIDED:   TransactionStatus.VOIDED,
      ERROR:    TransactionStatus.ERROR,
    };
    return map[raw] ?? TransactionStatus.ERROR;
  }
}
