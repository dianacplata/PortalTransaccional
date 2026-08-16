import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  IPaymentGateway,
  CardTokenRequest,
  CardToken,
  PaymentRequest,
  PaymentResult,
} from '../../../domain/ports/IPaymentGateway';
import { TransactionStatus } from '../../../domain/value-objects/TransactionStatus';
import { CardBrand } from '../../../domain/value-objects/CardBrand';
import { PaymentException } from '../../../domain/exceptions/PaymentException';
import { PayClient } from './PayClient';

interface PayCardTokenResponse {
  status: string;
  data: {
    id: string;
    brand: string;
    last_four: string;
  };
}

interface PayTransactionResponse {
  data: {
    id: string;
    status: string;
    reference: string;
  };
}

@Injectable()
export class PayAdapter implements IPaymentGateway {
  constructor(
    private readonly client: PayClient,
    private readonly config: ConfigService,
  ) {}

  async tokenizeCard(card: CardTokenRequest): Promise<CardToken> {
    const response = await this.client.postPublic<PayCardTokenResponse>(
      '/tokens/cards',
      {
        number: card.number,
        cvc: card.cvc,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        card_holder: card.cardHolder,
      },
    );

    if (response.status !== 'CREATED') {
      throw new PaymentException('Card tokenization failed');
    }

    return {
      id: response.data.id,
      brand: this.mapBrand(response.data.brand),
      lastFour: response.data.last_four,
    };
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResult> {
    const signature = this.buildIntegritySignature(
      request.reference,
      request.amountInCents,
      request.currency,
    );

    const response = await this.client.postPrivate<PayTransactionResponse>(
      '/transactions',
      {
        amount_in_cents: request.amountInCents,
        currency: request.currency,
        signature,
        customer_email: request.customerEmail,
        reference: request.reference,
        payment_method: {
          type: 'CARD',
          installments: request.installments,
          token: request.cardTokenId,
        },
      },
    );

    return {
      payTransactionId: response.data.id,
      status: this.mapStatus(response.data.status),
      reference: response.data.reference,
    };
  }

  async getTransactionStatus(payTransactionId: string): Promise<TransactionStatus> {
    const response = await this.client.getPublic<PayTransactionResponse>(
      `/transactions/${payTransactionId}`,
    );
    return this.mapStatus(response.data.status);
  }

  private buildIntegritySignature(
    reference: string,
    amountInCents: number,
    currency: string,
  ): string {
    const key = this.config.get<string>('PAY_INTEGRITY_KEY') ?? '';
    const payload = `${reference}${amountInCents}${currency}${key}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  private mapStatus(payStatus: string): TransactionStatus {
    const map: Record<string, TransactionStatus> = {
      PENDING:  TransactionStatus.PENDING,
      APPROVED: TransactionStatus.APPROVED,
      DECLINED: TransactionStatus.DECLINED,
      VOIDED:   TransactionStatus.VOIDED,
      ERROR:    TransactionStatus.ERROR,
    };
    return map[payStatus] ?? TransactionStatus.ERROR;
  }

  private mapBrand(payBrand: string): CardBrand {
    const map: Record<string, CardBrand> = {
      VISA:       CardBrand.VISA,
      MASTERCARD: CardBrand.MASTERCARD,
    };
    return map[payBrand] ?? CardBrand.UNKNOWN;
  }
}