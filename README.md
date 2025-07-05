# TokenWise - Real-time Solana Wallet Intelligence

A comprehensive real-time wallet intelligence tool for the Solana blockchain that tracks the top 60 token holders, monitors real-time transactions, identifies protocols used, and provides a dashboard with market insights and historical analysis.

## 🎯 **Project Objective**

Build a real-time intelligence tool for the Solana blockchain that:

- ✅ **Discovers the top 60 holders** of a given Solana token
- ✅ **Tracks buy/sell activity** in real time for those wallets  
- ✅ **Identifies which protocol** is used (Jupiter, Raydium, Orca, etc.)
- ✅ **Visualizes insights** in a comprehensive dashboard
- ✅ **Supports historical filtering** and exporting to CSV/JSON

## 🔗 **Target Token**

**Mint Address**: `9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump`

## 🛠️ **Tech Stack**

| Layer | Tool |
|-------|------|
| Backend | Node.js (JavaScript) |
| DB Access | Prisma ORM |
| Database | PostgreSQL |
| Blockchain | @solana/web3.js |
| Frontend | React.js + Chart.js |
| Realtime | Polling + WebSocket simulation |
| Export | json2csv |

## 🚀 **Features**

### Core Functionality
- **🔍 Real Blockchain Integration**: Fetches actual top 60 token holders from Solana mainnet
- **📊 Live Transaction Monitoring**: Real-time tracking of buy/sell activity
- **🔗 Protocol Detection**: Identifies Jupiter, Raydium, Orca, Serum, and other DeFi protocols
- **📈 Historical Analysis**: Custom time filters and data export
- **💾 CSV/JSON Export**: Download data for external analysis
- **🔄 Periodic Updates**: Automatic token holder updates every 30 minutes

### Technical Features
- **🏗️ Clean Architecture**: Controllers and routes for maintainable code
- **🗄️ Database Integration**: PostgreSQL with Prisma ORM
- **⚡ Real-time Updates**: WebSocket-like transaction simulation
- **📱 Responsive UI**: Modern React.js frontend with Tailwind CSS
- **📊 Chart Visualizations**: Interactive charts with Chart.js

## 📦 **Installation**

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Environment Configuration:**
Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/tokenwise"
PORT=3001
NODE_ENV=development
```

3. **Database Setup:**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start the backend server
npm start
```

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start the development server:**
```bash
npm start
```

## 🔄 **Real Solana Blockchain Integration**

### Token Holder Tracking
- **Real-time Fetching**: Connects to Solana RPC endpoints
- **Top 60 Discovery**: Uses `getTokenLargestAccounts()` to find actual holders
- **Balance Monitoring**: Tracks both token amounts and SOL balances
- **Periodic Updates**: Every 30 minutes automatically

### Transaction Monitoring
- **Live Transaction Parsing**: Analyzes actual blockchain transactions
- **Protocol Detection**: Identifies DeFi protocols by program IDs
- **Direction Analysis**: Determines buy/sell/transfer from balance changes
- **Real-time Storage**: Stores transactions in PostgreSQL

### Protocol Detection
The system recognizes these DeFi protocols:
- **Jupiter**: `JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB`
- **Raydium**: `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8`
- **Orca**: `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc`
- **Serum**: `9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin`
- **Meteora**: `M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K`
- **Lifinity**: `EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S`

## 📊 **API Endpoints**

### Token Holders
- `GET /api/token-holders/status` - Get update status
- `POST /api/token-holders/update` - Manually trigger update
- `GET /api/token-holders/stats` - Get token holder statistics

### Wallets
- `GET /api/wallets` - Get top 60 token holders
- `GET /api/wallets/:id` - Get specific wallet details

### Transactions
- `GET /api/transactions` - Get recent transactions
- `GET /api/transactions/:id` - Get specific transaction

### Statistics
- `GET /api/stats` - Get overall statistics
- `GET /api/stats/protocols` - Get protocol usage stats

### Export
- `GET /api/export/transactions/csv` - Export transactions to CSV
- `GET /api/export/wallets/csv` - Export wallets to CSV
- `GET /api/export/protocols/csv` - Export protocol stats to CSV
- `GET /api/export/:dataType/json` - Export data to JSON
- `GET /api/export/options` - Get available export options

### Health
- `GET /api/health` - Health check endpoint

## 🎯 **Key Features Explained**

### 1. Real Blockchain Integration
- **Solana RPC Connection**: Connects to mainnet-beta for live data
- **Token Account Analysis**: Uses `getTokenLargestAccounts()` for accurate holder discovery
- **Transaction Parsing**: Analyzes actual transaction data for protocol detection
- **Balance Tracking**: Monitors both token and SOL balances in real-time

### 2. Transaction Monitoring
- **Live Feed**: Real-time transaction monitoring from blockchain
- **Protocol Detection**: Identifies DeFi protocols by program IDs
- **Transaction Types**: Buy/sell/transfer tracking with amount analysis
- **Real-time Storage**: Stores parsed transactions in PostgreSQL

### 3. Protocol Analytics
- **Usage Statistics**: Which protocols are most popular
- **Trend Analysis**: Protocol usage over time
- **Visual Charts**: Interactive protocol breakdown
- **Real Data**: Based on actual blockchain transactions

### 4. Historical Analysis
- **Custom Time Filters**: Date range selection
- **CSV Export**: Download data for external analysis
- **Trend Visualization**: Historical data charts
- **Performance Metrics**: Time-based analytics

## 🔧 **Configuration**

### Update Intervals
- **Token Holder Updates**: 30 minutes (configurable)
- **Transaction Monitoring**: 5 minutes
- **Status Polling**: 30 seconds

### Database Configuration
- **Connection Pool**: Optimized for concurrent access
- **Indexing**: Proper indexes for fast queries
- **Backup Strategy**: Regular database backups recommended

## 🚀 **Deployment**

### Production Setup
1. **Environment Variables**: Set production DATABASE_URL
2. **Database Migration**: Run `npx prisma migrate deploy`
3. **Build Frontend**: `npm run build`
4. **Process Management**: Use PM2 or similar
5. **Reverse Proxy**: Configure Nginx/Apache

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📈 **Monitoring**

### Health Checks
- **API Endpoints**: `/api/health`
- **Database Connection**: Automatic reconnection
- **Update Status**: Real-time monitoring
- **Blockchain Connection**: Solana RPC health checks

### Logging
- **Console Logs**: Detailed operation logs
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Response time monitoring

## 📤 **Export Features**

### CSV Export
- **Transactions**: Complete transaction history with filters
- **Wallets**: Top 60 token holders with rankings
- **Protocol Stats**: Protocol usage statistics

### JSON Export
- **Structured Data**: Clean JSON format
- **Filtered Results**: Custom date ranges and criteria
- **API Integration**: Ready for external systems

### Export Options
- **Date Filters**: From/to date ranges
- **Protocol Filters**: Specific protocol selection
- **Direction Filters**: Buy/sell/transfer filtering
- **Wallet Filters**: Specific wallet address filtering

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For issues and questions:
- Check the API documentation
- Review the health endpoint
- Check console logs for errors
- Ensure database connection is working
- Verify Solana RPC connection

---

**TokenWise** - Your comprehensive Solana wallet intelligence platform! 🚀

*Built with real Solana blockchain integration for accurate, live data.* 