import { PayAdapter } from './PayAdapter';
import { PaymentException } from '../../../domain/exceptions/PaymentException';
import { TransactionStatus } from '../../../domain/value-objects/TransactionStatus';
import { CardBrand } from '../../../domain/value-objects/CardBrand';
import type { PayClient } from './PayClient';
import type { ConfigService } from '@nestjs/config';

const MERCHANT_RESPONSE = {
  data: {
    presigned_acceptance: { acceptance_token: 'acc-token-test', permalink: '' },
    presigned_personal_data_auth: { acceptance_token: 'pda-token-test', permalink: '' },
  },
};

const makeClient = (): jest.Mocked<Pick<PayClient, 'postPublic' | 'postPrivate' | 'getPublic' | 'getPublicNoAuth' | 'pubKey'>> => ({
  postPublic:       jest.fn(),
  postPrivate:      jest.fn(),
  getPublic:        jest.fn(),
  getPublicNoAuth:  jest.fn().mockResolvedValue(MERCHANT_RESPONSE),
  pubKey:           'pub_stagtest_test',
});

const makeConfig = (): Partial<jest.Mocked<ConfigService>> => ({
  get: jest.fn().mockImplementation((key: string) => {
    if (key === 'PAY_INTEGRITY_KEY') return 'test-integrity-key';
    return '';
  }),
});

describe('PayAdapter', () => {
  let client:  ReturnType<typeof makeClient>;
  let config:  ReturnType<typeof makeConfig>;
  let adapter: PayAdapter;

  beforeEach(() => {
    client  = makeClient();
    config  = makeConfig();
    adapter = new PayAdapter(client as unknown as PayClient, config as unknown as ConfigService);
  });

  describe('tokenizeCard()', () => {
    const cardRequest = {
      number: '4242424242424242',
      cvc: '123',
      expMonth: '12',
      expYear: '28',
      cardHolder: 'TEST USER',
    };

    it('returns a CardToken on success (status CREATED)', async () => {
      (client.postPublic as jest.Mock).mockResolvedValue({
        status: 'CREATED',
        data: { id: 'tok-abc', brand: 'VISA', last_four: '4242' },
      });

      const token = await adapter.tokenizeCard(cardRequest);
      expect(token.id).toBe('tok-abc');
      expect(token.brand).toBe(CardBrand.VISA);
      expect(token.lastFour).toBe('4242');
    });

    it('throws PaymentException when status is not CREATED', async () => {
      (client.postPublic as jest.Mock).mockResolvedValue({
        status: 'ERROR',
        data: {},
      });

      await expect(adapter.tokenizeCard(cardRequest)).rejects.toBeInstanceOf(PaymentException);
    });
  });

  describe('createPayment()', () => {
    it('calls postPrivate and maps the response status to domain TransactionStatus', async () => {
      (client.postPrivate as jest.Mock).mockResolvedValue({
        data: { id: 'pay-xyz', status: 'APPROVED', reference: 'REF-001' },
      });

      const result = await adapter.createPayment({
        reference:      'REF-001',
        amountInCents:  50_000,
        currency:       'COP',
        customerEmail:  'test@example.com',
        cardTokenId:    'tok-abc',
        installments:   1,
      });

      expect(result.status).toBe(TransactionStatus.APPROVED);
      expect(result.payTransactionId).toBe('pay-xyz');
      expect(client.postPrivate).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTransactionStatus()', () => {
    it('calls getPublic and maps status correctly', async () => {
      (client.getPublic as jest.Mock).mockResolvedValue({
        data: { id: 'pay-xyz', status: 'DECLINED', reference: 'REF-001' },
      });

      const status = await adapter.getTransactionStatus('pay-xyz');
      expect(status).toBe(TransactionStatus.DECLINED);
      expect(client.getPublic).toHaveBeenCalledWith('/transactions/pay-xyz');
    });
  });
});
