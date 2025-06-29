# U4S Backend API

A comprehensive DeFi backend API built with NestJS that provides liquidity pool management, swap execution, KYC verification, and analytics for decentralized trading platforms.

## Features

### Core DeFi Functionality

- **Liquidity Pool Management**: Create, manage, and monitor liquidity pools with multiple token pairs
- **Swap Execution**: Execute token swaps with real-time price calculations and slippage protection
- **Position Management**: Handle liquidity positions with tick-based range orders
- **Pool Metrics & Analytics**: Track volume, TVL, APR, and other key performance indicators
- **OHLC Price Data**: Generate candlestick data for trading charts

### Authentication & User Management

- **Multi-Auth Support**: Wallet signature authentication, Google OAuth, and Facebook OAuth
- **KYC Verification**: Complete KYC flow with document upload and SBT (Soulbound Token) minting
- **User Ban System**: Administrative user management with ban/unban functionality
- **Private Key Management**: Secure encrypted private key storage for OAuth users

### Blockchain Integration

- **Ethereum Integration**: Full Web3 integration with Ethers.js
- **Token Price Feeds**: Real-time token price tracking and historical data
- **IPFS Integration**: Decentralized metadata storage for SBT tokens
- **Transaction Tracking**: Monitor and record all DeFi transactions

### Security & Performance

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting and request throttling
- **Session Management**: Redis-based session storage
- **Data Validation**: Comprehensive input validation and sanitization
- **Database Migrations**: Version-controlled database schema management

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MySQL with TypeORM
- **Caching**: Redis
- **Authentication**: JWT, OAuth (Google/Facebook)
- **Blockchain**: Ethers.js, Web3 integration
- **File Storage**: IPFS (Pinata)
- **API Documentation**: Swagger/OpenAPI
- **Package Manager**: PNPM

## Prerequisites

- Node.js >= 20.11.1
- npm >= 10.1.0
- MySQL database
- Redis server
- PNPM package manager

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd u4s-backend

# Install dependencies
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=mysql://username:password@localhost:3306/u4s

# Authentication
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-64-character-hex-encryption-key

# Redis
REDIS_URL=redis://localhost:6379

# Blockchain
RPC_URL=https://your-ethereum-rpc-url
PRIVATE_KEY=your-ethereum-private-key

# IPFS
PINATA_JWT=your-pinata-jwt-token

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

### 3. Database Setup

```bash
# Run database migrations
pnpm run migration:up
```

### 4. Start the Application

```bash
# Development mode with hot reload
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

The API will be available at `http://localhost:3000/api`

## API Documentation

### Swagger Documentation

Visit `http://localhost:3000/swagger` for interactive API documentation.

### Main Endpoints

#### Authentication

- `POST /api/auth/wallet-login` - Wallet signature authentication
- `POST /api/auth/oauth-login` - OAuth authentication (Google/Facebook)

#### Pool Management

- `GET /api/pools` - List all liquidity pools
- `POST /api/pools` - Create a new pool
- `GET /api/pools/:address` - Get pool details
- `POST /api/pools/:address/swaps` - Execute a swap
- `GET /api/pools/:address/swaps` - Get pool swap history
- `GET /api/pools/:address/ohlc` - Get OHLC price data

#### Position Management

- `POST /api/positions` - Create a new liquidity position
- `GET /api/positions/:id` - Get position details
- `POST /api/positions/:id/events` - Add liquidity event

#### User & KYC

- `GET /api/users/:walletAddress` - Get user profile
- `POST /api/users/:walletAddress/kyc` - Submit KYC application
- `GET /api/users/:walletAddress/kyc/status` - Get KYC status
- `GET /api/users/:walletAddress/swaps` - Get user swap history

#### Token Management

- `GET /api/tokens` - List all tokens
- `POST /api/tokens` - Add new token
- `GET /api/tokens/:address/price` - Get token price

## Database Schema

The application uses MySQL with the following main entities:

- **Users**: User accounts with wallet addresses and auth methods
- **Pools**: Liquidity pools with token pairs and fee tiers
- **Positions**: User liquidity positions with tick ranges
- **Swaps**: Token swap transactions
- **KycProfiles**: KYC verification data
- **Tokens**: Token metadata and addresses
- **PoolMetrics**: Pool analytics and metrics

## Development

### Available Scripts

```bash
# Development
pnpm run start:dev          # Start with hot reload
pnpm run start:debug        # Start with debug mode

# Building
pnpm run build              # Build the application
pnpm run start:prod         # Start production build

# Testing
pnpm run test               # Run unit tests
pnpm run test:e2e           # Run end-to-end tests
pnpm run test:cov           # Run tests with coverage

# Database
pnpm run migration:generate # Generate new migration
pnpm run migration:up       # Run migrations
pnpm run migration:down     # Revert migrations

# Code Quality
pnpm run lint               # Run ESLint
pnpm run format             # Format code with Prettier
```

### Project Structure

```
src/
├── common/                 # Shared utilities and DTOs
├── config/                 # Application configuration
├── interfaces/             # TypeScript interfaces
├── libs/                   # Library configurations
├── migrations/             # Database migrations
├── modules/
│   ├── auth/              # Authentication module
│   ├── pool/              # Pool management
│   ├── position/          # Position management
│   ├── swap/              # Swap functionality
│   ├── token/             # Token management
│   ├── token-price/       # Price tracking
│   ├── user/              # User & KYC management
│   └── pool-metrics/      # Analytics & metrics
├── script/                # Blockchain scripts
└── services/              # External services (IPFS, etc.)
```

## Security Considerations

- **Private Key Encryption**: All private keys are encrypted using AES-256-GCM
- **Input Validation**: Comprehensive validation using class-validator
- **Rate Limiting**: API endpoints are rate-limited to prevent abuse
- **Secure Headers**: Helmet.js for security headers
- **CORS Configuration**: Properly configured CORS policies
- **Session Security**: Secure cookie configuration with Redis storage

## Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t u4s-backend .

# Run with docker-compose
docker-compose up -d
```

### Environment Variables for Production

Ensure all environment variables are properly set:

- Use strong, unique secrets for JWT and encryption
- Configure secure database connections
- Set up proper Redis clustering for high availability
- Use production-grade RPC endpoints
- Configure proper CORS origins

### Database Migration in Production

```bash
# Run migrations safely
pnpm run migration:up
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Write comprehensive tests for new features
- Update documentation for API changes
- Use TypeScript strictly with proper typing
- Follow NestJS best practices and conventions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the API documentation at `/swagger`
- Review the existing issues and discussions