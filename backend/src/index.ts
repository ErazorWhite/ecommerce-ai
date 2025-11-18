import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { startGrpcServer } from './services/grpcServer';
import productsRouter from './routes/products';
import usersRouter from './routes/users';
import interactionsRouter from './routes/interactions';
import recommendationsRouter from './routes/recommendations';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GRPC_PORT = Number(process.env.GRPC_PORT) || 50051;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/interactions', interactionsRouter);
app.use('/api/recommendations', recommendationsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running!',
    services: {
      rest: 'running',
      grpc: 'running',
      database: 'connected',
    },
    timestamp: new Date().toISOString()
  });
});

// Database info
app.get('/api/db-info', async (req, res) => {
  const mongoose = await import('./config/database');
  res.json({
    status: mongoose.default.connection.readyState === 1 ? 'connected' : 'disconnected',
    database: mongoose.default.connection.name,
    host: mongoose.default.connection.host,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start servers
const startServers = async () => {
  try {
    await connectDatabase();
    
    // Start REST API
    app.listen(PORT, () => {
      console.log(`\n🚀 REST API running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log('\n📚 REST Endpoints:');
      console.log('   GET  /api/products');
      console.log('   GET  /api/users');
      console.log('   POST /api/interactions');
      console.log('   GET  /api/recommendations/:userId');
      console.log('   GET  /api/recommendations/similar/:productId');
      console.log('   GET  /api/recommendations/trending/products');
    });

    // Start gRPC server
    startGrpcServer(GRPC_PORT);
    console.log(`\n⚡ gRPC Recommendations on port ${GRPC_PORT}\n`);
    
  } catch (error) {
    console.error('Failed to start servers:', error);
    process.exit(1);
  }
};

startServers();
