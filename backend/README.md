# TokenWise Backend - Clean Architecture

## Project Structure

```
backend/
├── controllers/          # Business logic controllers
│   ├── walletController.js
│   ├── transactionController.js
│   ├── statsController.js
│   └── healthController.js
├── routes/              # API route definitions
│   ├── walletRoutes.js
│   ├── transactionRoutes.js
│   ├── statsRoutes.js
│   └── healthRoutes.js
├── lib/                 # Database utilities
│   └── prisma.js
├── prisma/              # Database schema
│   └── schema.prisma
├── solana.js           # Mock data generation
└── index.js            # Main server file
```

## Architecture Overview

### Controllers (`/controllers`)
- **walletController.js**: Handles wallet-related operations
- **transactionController.js**: Manages transaction data and live feeds
- **statsController.js**: Processes analytics and statistics
- **healthController.js**: System status and health checks

### Routes (`/routes`)
- **walletRoutes.js**: `/api/wallets` endpoints
- **transactionRoutes.js**: `/api/transactions` endpoints
- **statsRoutes.js**: `/api/stats` endpoints
- **healthRoutes.js**: `/api/health` endpoints

### Key Features
- **Clean Separation**: Business logic in controllers, routing in routes
- **Database Fallback**: Automatic fallback to mock data if database unavailable
- **Real-time Simulation**: Live transaction generation for demo purposes
- **Modular Design**: Easy to extend and maintain

## API Endpoints

### Wallets
- `GET /api/wallets` - Get all wallets

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/live` - Get live transactions
- `POST /api/transactions` - Add new transaction

### Statistics
- `GET /api/stats` - Get basic stats
- `GET /api/stats/enhanced` - Get enhanced stats with protocol data
- `GET /api/stats/protocols` - Get protocol usage statistics

### Health
- `GET /api/health` - Get system health status

## Database Modes

### Real Database Mode
- Uses PostgreSQL with Prisma ORM
- Persistent data storage
- Real-time transaction simulation

### Mock Data Mode
- Realistic mock data generation
- No database dependency
- Perfect for demos and development

## Getting Started

1. Install dependencies: `npm install`
2. Set up database (optional): Configure `DATABASE_URL` in `.env`
3. Start server: `npm start`

The server automatically detects database availability and switches between real and mock data modes. 