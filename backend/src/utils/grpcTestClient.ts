import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/recommendations.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const recommendationsProto = grpc.loadPackageDefinition(packageDefinition).recommendations as any;

const client = new recommendationsProto.RecommendationService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Тест: Получение рекомендаций
function testGetRecommendations(userId: string) {
  return new Promise((resolve, reject) => {
    client.GetRecommendations(
      { user_id: userId, limit: 5 },
      (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  });
}

// Тест: Похожие товары
function testGetSimilarProducts(productId: string) {
  return new Promise((resolve, reject) => {
    client.GetSimilarProducts(
      { product_id: productId, limit: 5 },
      (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  });
}

// Тест: Популярные товары
function testGetTrendingProducts(category?: string) {
  return new Promise((resolve, reject) => {
    client.GetTrendingProducts(
      { category, limit: 5 },
      (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  });
}

// Запуск тестов
async function runTests() {
  console.log('🧪 Running gRPC Client Tests...\n');

  try {
    // Получаем первого пользователя из базы
    const mongoose = await import('mongoose');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-ai');
    
    const User = (await import('../models/User')).User;
    const Product = (await import('../models/Product')).Product;
    
    const user = await User.findOne();
    const product = await Product.findOne();

    if (!user || !product) {
      throw new Error('No test data found. Run seed script first.');
    }

    console.log(`📝 Test User ID: ${user._id}`);
    console.log(`📝 Test Product ID: ${product._id}\n`);

    // Тест 1: Персонализированные рекомендации
    console.log('1️⃣  Testing GetRecommendations...');
    const recommendations = await testGetRecommendations(user._id.toString());
    console.log('✅ Result:', JSON.stringify(recommendations, null, 2));
    console.log('');

    // Тест 2: Похожие товары
    console.log('2️⃣  Testing GetSimilarProducts...');
    const similar = await testGetSimilarProducts(product._id.toString());
    console.log('✅ Result:', JSON.stringify(similar, null, 2));
    console.log('');

    // Тест 3: Популярные товары
    console.log('3️⃣  Testing GetTrendingProducts...');
    const trending = await testGetTrendingProducts('smartphones');
    console.log('✅ Result:', JSON.stringify(trending, null, 2));
    console.log('');

    console.log('🎉 All gRPC tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Запускаем если вызван напрямую
if (require.main === module) {
  runTests();
}

export { testGetRecommendations, testGetSimilarProducts, testGetTrendingProducts };
