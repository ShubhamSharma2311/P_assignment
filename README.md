# 🔍 TokenWise — Real-Time Wallet Intelligence on Solana

A real-time intelligence tool designed to monitor and analyze wallet behavior for specific tokens on the Solana blockchain.

## 🎯 Features

- **Top 60 Token Holders Discovery** - Find and track the largest token holders
- **Real-time Transaction Monitoring** - Track buys/sells in real-time
- **Protocol Identification** - Identify which protocols are being used (Jupiter, Raydium, Orca)
- **Analytics Dashboard** - Beautiful charts and insights
- **Historical Analysis** - Query past activity with time filters

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Frontend**: React.js + Vite + Chart.js
- **Blockchain**: Solana Web3.js

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

## 🚀 Quick Start

### 1. Database Setup

First, create the PostgreSQL database and tables:

```sql
-- Create database
CREATE DATABASE tokenwise;

-- Connect to the database and run the schema
-- (See db/schema.sql for the complete schema)
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Update database connection in index.js
# Change the password in the Pool configuration

# Start the development server
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📊 Dashboard Features

### Stats Cards
- Total transactions count
- Buy vs Sell breakdown
- Net market direction indicator

### Charts
- **Transaction Activity Chart** - Line chart showing buys/sells over time
- **Protocol Usage Chart** - Doughnut chart showing protocol distribution

### Wallets Table
- Top 60 token holders
- Balance and token amount display
- Responsive design

## 🔧 Configuration

### Backend Configuration

Update the database connection in `backend/index.js`:

```javascript
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tokenwise',
  password: 'your_password_here', // Change this
  port: 5432,
});
```

### Target Token

The current target token is: `9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump`

You can change this in `backend/solana.js`:

```javascript
const TOKEN_ADDRESS = 'your_token_address_here';
```

## 📁 Project Structure

```
new_project/
├── backend/
│   ├── index.js          # Main server file
│   ├── solana.js         # Solana integration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── WalletsTable.jsx
│   │   │   ├── TransactionsChart.jsx
│   │   │   └── ProtocolChart.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── db/
    └── schema.sql        # Database schema
```

## 🎨 UI Features

- **Modern Design** - Clean, gradient-based UI
- **Responsive Layout** - Works on desktop and mobile
- **Real-time Updates** - Auto-refreshes every 30 seconds
- **Interactive Charts** - Hover effects and animations
- **Loading States** - Smooth loading indicators

## 🔄 API Endpoints

- `GET /api/wallets` - Get top 60 token holders
- `GET /api/transactions` - Get recent transactions
- `GET /api/stats` - Get transaction statistics

## 🚧 Development Notes

- Currently uses mock data for demonstration
- Real Solana integration requires additional setup
- Database connection needs to be configured
- CORS is enabled for local development

## 📝 TODO

- [ ] Implement real Solana RPC integration
- [ ] Add real-time transaction monitoring
- [ ] Implement historical data queries
- [ ] Add export functionality (CSV/JSON)
- [ ] Add more detailed wallet analytics
- [ ] Implement user authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ for Solana blockchain analytics** 