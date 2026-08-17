import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from '../infrastructure/persistence/entities/ProductEntity';
import { CustomerEntity } from '../infrastructure/persistence/entities/CustomerEntity';
import { TransactionEntity } from '../infrastructure/persistence/entities/TransactionEntity';
import { DeliveryEntity } from '../infrastructure/persistence/entities/DeliveryEntity';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  // Fix 1: explicit array
  entities: [ProductEntity, CustomerEntity, TransactionEntity, DeliveryEntity],
});

const PRODUCTS = [
  {
    name: 'Camiseta Premium Algodón',
    description: 'Camiseta 100% algodón orgánico, corte regular, disponible en varios colores.',
    priceCents: 8_900_000,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  },
  {
    name: 'Audífonos Inalámbricos BT Pro',
    description: 'Audífonos Bluetooth 5.0 con cancelación activa de ruido y 30h de batería.',
    priceCents: 24_900_000,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  },
  {
    name: 'Mochila Urbana 20L',
    description: 'Mochila resistente al agua con compartimento para laptop de 15".',
    priceCents: 14_500_000,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
  },
  {
    name: 'Termo Acero Inoxidable 500ml',
    description: 'Termo de doble pared que mantiene temperatura hasta 12 horas.',
    priceCents: 5_500_000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
  },
  {
    name: 'Smartwatch Fit Series 3',
    description: 'Reloj inteligente con monitoreo cardiaco, GPS y resistencia al agua IP68.',
    priceCents: 39_900_000,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  },
];

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('Database connected.');

  const repo = AppDataSource.getRepository(ProductEntity);
  const existing = await repo.count();

  if (existing > 0) {
    console.log(`Seed skipped — ${existing} products already exist.`);
    await AppDataSource.destroy();
    return;
  }

  for (const data of PRODUCTS) {
    const product = repo.create({ id: uuidv4(), ...data });
    await repo.save(product);
    console.log(`  ✓ ${data.name}`);
  }

  console.log('Seed complete: 5 products inserted.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});