# 🛒 Portal Transaccional

SPA de checkout integrada con la pasarela de pagos **Pay** (sandbox).  
Stack: **React 19 · NestJS · TypeORM · PostgreSQL · Docker Compose**  
Arquitectura: **Hexagonal (Ports & Adapters) + Railway Oriented Programming (ROP)**

---

## Base de datos

<img width="2008" height="1170" alt="portal_transaccional" src="https://github.com/user-attachments/assets/e4d8cd61-089c-4070-a611-394f0a48950b" />


## 🌐 Demo en vivo

| Recurso | URL |
|---------|-----|
| **Aplicación** | [http://3.17.153.130](http://3.17.153.130) |
| **Swagger / API Docs** | [http://3.17.153.130:3000/api/docs](http://3.17.153.130:3000/api/docs) |
| **API Base** | `http://3.17.153.130:3000/api` |

---

## 💳 Tarjetas de prueba (Pay Sandbox)

| Marca | Número | Resultado esperado |
|-------|--------|--------------------|
| Mastercard ✅ | `5555 5555 5555 4444` | Pago aprobado |
| Visa ✅ | `4242 4242 4242 4242` | Pago aprobado |
| Visa ❌ | `4111 1111 1111 1111` | Pago declinado |

**Datos adicionales para cualquier tarjeta:**
- Fecha de vencimiento: cualquier mes/año futuro (ej: `12/28`)
- CVC: cualquier 3 dígitos (ej: `123`)
- Cuotas: 1
- Nombre titular: cualquier nombre

---

## 🛒 Flujo del checkout

```
1. Catálogo      → Selección de producto y cantidad
2. Datos cliente → Nombre, email, teléfono
3. Dirección     → Datos de entrega
4. Pago          → Formulario de tarjeta con validación Luhn
5. Resultado     → Confirmación o rechazo con polling al backend
```

---

## 🏗️ Arquitectura

```
src/
├── domain/           ← TypeScript puro, sin frameworks
│   ├── entities/     ← Product, Transaction, Customer, Delivery
│   ├── value-objects/← Money (COP centavos), TransactionStatus, CardBrand
│   ├── ports/        ← Interfaces: IProductRepository, IPaymentGateway…
│   └── exceptions/   ← DomainException (abstract) → mapeo a HTTP status
│
├── application/      ← Casos de uso, DTOs, Result<T,E>
│   ├── use-cases/    ← GetProducts, CreateTransaction, ProcessPayment…
│   └── result/       ← Result<T,E> discriminated union (ok/err/flatMap)
│
└── infrastructure/   ← NestJS, TypeORM, Axios
    ├── http/         ← Controllers, ValidationPipe, DomainExceptionFilter
    ├── persistence/  ← PostgresProductRepository, TransactionEntity…
    └── adapters/pay/ ← PayAdapter (Pay), PayClient (Axios + SHA-256)
```

**Railway Oriented Programming:** todos los casos de uso retornan `Promise<Result<T,E>>`. Los errores se propagan sin excepciones hasta el filtro HTTP que los convierte a `4xx/5xx`.

---

## 📡 API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/products` | Lista productos con stock |
| `GET` | `/api/products/:id` | Detalle de un producto |
| `POST` | `/api/transactions` | Crea transacción en estado `PENDING` |
| `GET` | `/api/transactions/:id` | Consulta estado de una transacción |
| `POST` | `/api/transactions/:id/pay` | Procesa el pago (límite: 5 req/min) |


---

## 🧪 Tests

Cobertura **>80%** con Jest (backend) y Vitest (frontend).

```bash
# Backend (desde /backend)
npm run test:cov

# Frontend (desde /frontend)
npm run test
```

Specs incluidos: entidades de dominio, value objects, casos de uso, filtros HTTP, PayAdapter, componentes React, store Redux.

---

## 🚀 Correr localmente

### Prerrequisitos
- Docker + Docker Compose
- Node.js 20+

### Con Docker Compose

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd PortalTransaccional

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con las claves

# 3. Levantar los 3 servicios
docker compose up --build

# 4. Poblar la base de datos (primera vez)
docker compose exec backend npm run seed
```

La aplicación queda disponible en `http://localhost` (frontend) y `http://localhost:3000/api` (backend).

### Sin Docker (desarrollo)

```bash
# Backend
cd backend
npm install
npm run seed
npm run start:dev   # http://localhost:3000/api

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev         # http://localhost:5173
```

---

## ⚙️ Variables de entorno

Copia `backend/.env.example` a `backend/.env`:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL |
| `PAY_BASE_URL` | url sandbox |
| `PAY_PUBLIC_KEY` | Clave pública  sandbox |
| `PAY_PRIVATE_KEY` | Clave privada  sandbox |
| `PAY_INTEGRITY_KEY` | Clave de integridad SHA-256 |
| `BASE_FEE_CENTS` | Tarifa base en centavos COP (ej: `300000`) |
| `DELIVERY_FEE_CENTS` | Tarifa de envío en centavos COP (ej: `150000`) |
| `FRONTEND_URL` | URL del frontend para CORS |

---

## 🛠️ Stack completo

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Redux Toolkit, React Router, Vite, TypeScript |
| Backend | NestJS 10, TypeScript, Helmet, Throttler |
| ORM | TypeORM + PostgreSQL 16 |
| Pasarela | Pay (sandbox) — tokenización + webhook |
| Contenedores | Docker Compose (db + backend + frontend/nginx) |
| Tests | Jest (backend) · Vitest + Testing Library (frontend) |
| CI/CD | AWS EC2 t2.micro — Free Tier |
