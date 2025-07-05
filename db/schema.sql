-- Create database (run this first)
-- CREATE DATABASE tokenwise;

-- Connect to the database and run these commands:

-- Create wallets table
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(20, 8) NOT NULL,
    token_amount DECIMAL(20, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')),
    amount DECIMAL(20, 8) NOT NULL,
    protocol VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_wallets_balance ON wallets(balance DESC);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_address);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Insert some sample data
INSERT INTO wallets (address, balance, token_amount) VALUES
('wallet_1', 1000000, 5000),
('wallet_2', 950000, 4800),
('wallet_3', 900000, 4500),
('wallet_4', 850000, 4200),
('wallet_5', 800000, 4000);

INSERT INTO transactions (transaction_id, wallet_address, type, amount, protocol, timestamp) VALUES
('tx_1', 'wallet_1', 'buy', 100, 'Jupiter', NOW() - INTERVAL '1 hour'),
('tx_2', 'wallet_2', 'sell', 50, 'Raydium', NOW() - INTERVAL '2 hours'),
('tx_3', 'wallet_3', 'buy', 200, 'Orca', NOW() - INTERVAL '3 hours'),
('tx_4', 'wallet_1', 'sell', 75, 'Jupiter', NOW() - INTERVAL '4 hours'),
('tx_5', 'wallet_4', 'buy', 150, 'Raydium', NOW() - INTERVAL '5 hours'); 