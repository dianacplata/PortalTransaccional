import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CreateTransactionUseCase } from '../../../application/use-cases/CreateTransactionUseCase';
import { GetTransactionUseCase } from '../../../application/use-cases/GetTransactionUseCase';
import { ProcessPaymentUseCase } from '../../../application/use-cases/ProcessPaymentUseCase';
import { CreateTransactionDto } from '../../../application/dto/CreateTransactionDto';
import { ProcessPaymentDto } from '../../../application/dto/ProcessPaymentDto';
import { isOk } from '../../../application/result/Result';
import { DomainException } from '../../../domain/exceptions/DomainException';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransaction: CreateTransactionUseCase,
    private readonly getTransaction: GetTransactionUseCase,
    private readonly processPayment: ProcessPaymentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crea una transacción en estado PENDING' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiCreatedResponse({ description: 'Transacción creada' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  @ApiConflictResponse({ description: 'Stock insuficiente' })
  async create(@Body() dto: CreateTransactionDto) {
    const result = await this.createTransaction.execute(dto);
    if (!isOk(result)) throw result.error as DomainException;
    return result.data;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Consulta el estado de una transacción' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Estado de la transacción' })
  @ApiNotFoundResponse({ description: 'Transacción no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.getTransaction.execute(id);
    if (!isOk(result)) throw result.error as DomainException;
    const tx = result.data;
    return {
      id:                tx.id,
      productId:         tx.productId,
      customerId:        tx.customerId,
      quantity:          tx.quantity,
      productAmountCents: tx.productAmount.cents,
      baseFeeCents:      tx.baseFee.cents,
      deliveryFeeCents:  tx.deliveryFee.cents,
      totalAmountCents:  tx.totalAmount.cents,
      status:            tx.status,
      payTransactionId:  tx.payTransactionId,
      reference:         tx.reference,
      createdAt:         tx.createdAt,
      updatedAt:         tx.updatedAt,
    };
  }

  @Post(':id/pay')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Procesa el pago de una transacción (límite: 5/min)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: ProcessPaymentDto })
  @ApiOkResponse({ description: 'Resultado del pago' })
  @ApiNotFoundResponse({ description: 'Transacción no encontrada' })
  @ApiUnprocessableEntityResponse({ description: 'Pago rechazado o tarjeta inválida' })
  @ApiTooManyRequestsResponse({ description: 'Demasiados intentos — espere 1 minuto' })
  async pay(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ProcessPaymentDto,
  ) {
    const result = await this.processPayment.execute(id, dto);
    if (!isOk(result)) throw result.error as DomainException;
    return result.data;
  }
}
