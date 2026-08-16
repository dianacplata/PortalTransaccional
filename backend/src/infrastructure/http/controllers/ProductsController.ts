import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { GetProductsUseCase } from '../../../application/use-cases/GetProductsUseCase';
import { GetProductUseCase } from '../../../application/use-cases/GetProductUseCase';
import { isOk } from '../../../application/result/Result';
import { DomainException } from '../../../domain/exceptions/DomainException';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProducts: GetProductsUseCase,
    private readonly getProduct: GetProductUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista todos los productos con stock disponible' })
  @ApiOkResponse({ description: 'Array de productos' })
  async findAll() {
    const result = await this.getProducts.execute();
    if (!isOk(result)) throw result.error;
    return result.data.map(mapProduct);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtiene un producto por UUID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Producto encontrado' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.getProduct.execute(id);
    if (!isOk(result)) throw result.error as DomainException;
    return mapProduct(result.data);
  }
}

function mapProduct(p: {
  id: string;
  name: string;
  description: string;
  price: { cents: number };
  stock: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id:          p.id,
    name:        p.name,
    description: p.description,
    priceCents:  p.price.cents,
    stock:       p.stock,
    imageUrl:    p.imageUrl,
    createdAt:   p.createdAt,
    updatedAt:   p.updatedAt,
  };
}
