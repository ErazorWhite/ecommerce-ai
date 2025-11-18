# E-Commerce AI Recommendation System

## Research Project: Integration Methods of Machine Learning Algorithms in React Web Applications

This project is a diploma research work investigating and comparing different API protocols (REST vs gRPC/Connect-Web) for integrating machine learning recommendation algorithms into React-based web applications.

## Project Overview

The application demonstrates a full-stack e-commerce recommendation system with:

- **Machine Learning Algorithm**: Collaborative filtering (hybrid approach combining user-based and item-based filtering)
- **Dual API Architecture**: Both REST and gRPC (via Connect-Web) implementations running in parallel
- **Performance Monitoring**: Real-time latency comparison between protocols
- **Modern Tech Stack**: TypeScript, React, Node.js, Express, MongoDB

### Key Features

- Personalized product recommendations based on user interaction history
- Similar product suggestions using collaborative filtering
- Trending products by category
- Interactive API protocol switcher (REST ↔ gRPC)
- Performance metrics dashboard showing client/server latency
- Protocol Buffers for efficient data serialization

## Architecture

```
ecommerce-ai/
├── backend/          # Node.js + Express server
│   ├── src/
│   │   ├── proto/    # Protocol Buffer definitions
│   │   ├── services/ # REST + gRPC + Connect-Web services
│   │   ├── models/   # MongoDB schemas
│   │   ├── routes/   # REST API routes
│   │   └── gen/      # Auto-generated Protocol Buffer code
│   └── package.json
│
├── frontend/         # React + TypeScript application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # React Query hooks for data fetching
│   │   ├── services/     # API clients (REST + gRPC)
│   │   ├── contexts/     # React Context for state management
│   │   └── gen/          # Auto-generated Protocol Buffer code
│   └── package.json
│
└── README.md         # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.19+ or v22.12+ (recommended: v25.2.1)
- **pnpm**: v10+ package manager
- **MongoDB**: v8.0+ Community Server
- **Git**: For cloning the repository

### Installing Prerequisites

#### Windows (using Chocolatey)

```bash
# Install Chocolatey first (if not installed)
# https://chocolatey.org/install

# Install Node.js
choco install nodejs

# Install pnpm
npm install -g pnpm

# Install MongoDB
choco install mongodb

# MongoDB service will start automatically
```

#### macOS (using Homebrew)

```bash
# Install Node.js
brew install node

# Install pnpm
npm install -g pnpm

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-8.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ErazorWhite/ecommerce-ai
cd ecommerce-ai
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pnpm install

# Generate Protocol Buffer TypeScript code
pnpm run proto:generate

# Seed the database with test data
pnpm run seed
```

**Note**: The seed script will create:
- 3 test users (Alice, Bob, Charlie)
- 10 sample products across different categories
- 27 user interaction records (views, purchases, add-to-cart)

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
pnpm install

# Generate Protocol Buffer TypeScript code
pnpm run proto:generate
```

### 4. Environment Configuration

#### Backend Environment

The backend uses default configuration but you can create a `.env` file in the `backend/` directory:

```env
PORT=3000
GRPC_PORT=50051
MONGODB_URI=mongodb://localhost:27017/ecommerce-ai
```

#### Frontend Environment

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_GRPC_URL=http://localhost:3000
```

## Running the Application

You need to run both backend and frontend servers simultaneously.

### Start Backend Server

```bash
# From backend directory
cd backend
pnpm run dev
```

The backend will start:
- **REST API**: http://localhost:3000
- **Connect-Web (gRPC)**: http://localhost:3000/connect
- **gRPC Server**: localhost:50051

You should see output like:
```
🚀 REST API running on http://localhost:3000
📊 Health check: http://localhost:3000/health

📚 REST Endpoints:
   GET  /api/products
   GET  /api/users
   POST /api/interactions
   GET  /api/recommendations/:userId
   GET  /api/recommendations/similar/:productId
   GET  /api/recommendations/trending/products

🔌 Connect-Web Endpoints:
   POST /connect/recommendations.RecommendationService/GetRecommendations
   POST /connect/recommendations.RecommendationService/GetSimilarProducts
   POST /connect/recommendations.RecommendationService/GetTrendingProducts

⚡ gRPC Recommendations on port 50051
```

### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
pnpm run dev
```

The frontend will start at: **http://localhost:5173**

## Using the Application

1. Open your browser and navigate to **http://localhost:5173**
2. You'll see the product catalog and personalized recommendations
3. Use the **API Protocol switcher** in the header to toggle between:
   - **REST**: Traditional HTTP/JSON API
   - **gRPC (Connect-Web)**: Protocol Buffers over HTTP/2

4. Observe the **Performance Metrics** panel showing:
   - Total latency
   - Client-side latency
   - Server-side latency

## API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/users` | Get all users |
| POST | `/api/interactions` | Record user interaction |
| GET | `/api/recommendations/:userId` | Get personalized recommendations |
| GET | `/api/recommendations/similar/:productId` | Get similar products |
| GET | `/api/recommendations/trending/products` | Get trending products |

### gRPC/Connect-Web API

All gRPC endpoints are available via Connect-Web protocol at `/connect/*`:

| Service Method | Description |
|----------------|-------------|
| `GetRecommendations` | Get personalized recommendations |
| `GetSimilarProducts` | Get similar products |
| `GetTrendingProducts` | Get trending products |

## Development Scripts

### Backend

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server with hot reload |
| `pnpm run build` | Build TypeScript to JavaScript |
| `pnpm run start` | Start production server |
| `pnpm run seed` | Seed database with test data |
| `pnpm run proto:generate` | Generate TypeScript from .proto files |
| `pnpm run test:grpc` | Test gRPC client connection |

### Frontend

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start Vite development server |
| `pnpm run build` | Build production bundle |
| `pnpm run preview` | Preview production build |
| `pnpm run proto:generate` | Generate TypeScript from .proto files |
| `pnpm run lint` | Run ESLint |

## Technology Stack

### Backend

- **Runtime**: Node.js v25+
- **Framework**: Express 5.x
- **Database**: MongoDB with Mongoose ODM
- **API Protocols**:
  - REST: Traditional HTTP/JSON
  - gRPC: @grpc/grpc-js
  - Connect-Web: @connectrpc/connect-node
- **Protocol Buffers**: @bufbuild/protobuf
- **TypeScript**: Full type safety
- **Dev Tools**: tsx (TypeScript execution)

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite 7
- **State Management**:
  - React Query (@tanstack/react-query) for server state
  - React Context for client state
- **API Clients**:
  - Axios for REST
  - @connectrpc/connect-web for gRPC
- **TypeScript**: Full type safety
- **Protocol Buffers**: @bufbuild/protobuf

### Machine Learning

- **Algorithm**: Collaborative Filtering (Hybrid)
  - User-based collaborative filtering
  - Item-based collaborative filtering
  - Weighted scoring system
- **Data**: User interaction history (views, purchases, add-to-cart)

## Protocol Buffer Definition

The recommendation service is defined in `backend/src/proto/recommendations.proto`:

```protobuf
service RecommendationService {
  rpc GetRecommendations (RecommendationRequest) returns (RecommendationResponse);
  rpc GetSimilarProducts (SimilarProductsRequest) returns (SimilarProductsResponse);
  rpc GetTrendingProducts (TrendingRequest) returns (TrendingResponse);
}
```

## Performance Comparison

This project enables direct comparison between REST and gRPC protocols:

| Metric | REST | gRPC (Connect-Web) |
|--------|------|-------------------|
| **Transport** | HTTP/1.1 | HTTP/2 |
| **Serialization** | JSON | Protocol Buffers |
| **Size** | Text-based (larger) | Binary (smaller) |
| **Speed** | Baseline | Typically faster |
| **Browser Support** | Native | Requires client library |

Use the application's performance metrics to conduct your own benchmarks.

## Research Methodology

This project is designed to facilitate research on:

1. **Protocol Performance**: Compare latency and throughput between REST and gRPC
2. **Developer Experience**: Evaluate ease of implementation and maintenance
3. **Type Safety**: Assess benefits of Protocol Buffers vs JSON schemas
4. **Browser Compatibility**: Test gRPC-Web solutions in different browsers
5. **Real-world Scenarios**: ML recommendation systems as a practical use case

## Troubleshooting

### MongoDB Connection Error

```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solution**: Ensure MongoDB service is running:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**: Kill the process using the port or change the port in `.env`:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Protocol Buffer Generation Fails

```
Error: buf not found
```

**Solution**: Ensure Buf CLI is installed via pnpm:
```bash
pnpm install
```

Buf is installed as a dev dependency in package.json.

### Connect-Web 404 Error

If you see `404 Not Found` on `/connect/*` endpoints:

**Solution**: Ensure Connect middleware is placed BEFORE `express.json()` in `backend/src/index.ts`.

## Project Structure Details

### Recommendation Algorithm Flow

1. User interactions are recorded (view, purchase, add-to-cart)
2. Collaborative filtering analyzes:
   - Users with similar interaction patterns
   - Products with similar interaction patterns
3. Scoring system weights:
   - Purchase: 3.0
   - Add to cart: 2.0
   - View: 1.0
4. Top-N recommendations are returned with reasons

### Data Models

- **User**: `{ _id, name, email, preferences }`
- **Product**: `{ _id, name, category, price, description, image }`
- **Interaction**: `{ userId, productId, type, timestamp }`

## Contributing

This is a diploma research project. Contributions, suggestions, and feedback are welcome.

## License

ISC

## Author

Diploma Project - Research on ML Integration Methods in React Web Applications

---

**Note**: This is a research project for educational purposes. The recommendation algorithm uses a simplified collaborative filtering approach suitable for demonstration and performance comparison.
