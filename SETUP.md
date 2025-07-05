# 🚀 TokenWise Setup Guide

## Quick Start (Without Database)

The backend now works with **mock data** by default! You can run the project immediately:

```bash
# 1. Start Backend
cd backend
npm run dev

# 2. Start Frontend  
cd frontend
npm run dev
```

The dashboard will work with sample data automatically.

## Full Setup (With PostgreSQL Database)

### 1. Install PostgreSQL
- Download from: https://www.postgresql.org/download/
- Install with default settings
- Remember your password!

### 2. Create Database
Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE tokenwise;
```

### 3. Run Schema
Connect to the `tokenwise` database and run the commands from `setup-database.sql`

### 4. Update Backend Configuration
Edit `backend/index.js` and update the database password:

```javascript
pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tokenwise',
  password: 'YOUR_PASSWORD_HERE', // Change this
  port: 5432,
});
```

### 5. Start the Project
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 🎯 What Works Now

✅ **Mock Data Mode** - Works without database  
✅ **Real Database Mode** - Works with PostgreSQL  
✅ **Beautiful Dashboard** - Tailwind CSS styling  
✅ **Real-time Updates** - Auto-refresh every 30 seconds  
✅ **Responsive Design** - Works on mobile and desktop  

## 🔧 Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check your password in `backend/index.js`
- Verify database name is `tokenwise`

### Frontend Issues
- Install Chart.js: `npm install chart.js react-chartjs-2`
- Make sure backend is running on port 3001

### Backend Issues
- Check if port 3001 is available
- Verify all dependencies are installed: `npm install`

## 📊 Dashboard Features

- **Stats Cards**: Total transactions, buys vs sells
- **Transaction Chart**: Line chart showing activity
- **Protocol Chart**: Doughnut chart for protocol usage
- **Wallets Table**: Top 60 token holders
- **Real-time Data**: Auto-refreshes every 30 seconds

## 🎨 UI Features

- Modern gradient design
- Hover animations
- Responsive layout
- Professional styling with Tailwind CSS
- Loading states and error handling

---

**The project is ready to run with mock data!** 🎉 