import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { recommendationService } from './recommendationService';

const PROTO_PATH = path.join(__dirname, '../proto/recommendations.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const recommendationsProto = grpc.loadPackageDefinition(packageDefinition).recommendations as any;

/**
 * Имплементация gRPC методов
 */
const getRecommendations = async (call: any, callback: any) => {
  const startTime = Date.now();
  const { user_id, limit = 5, exclude_product_ids = [] } = call.request;

  try {
    console.log(`📡 gRPC: GetRecommendations for user ${user_id}`);

    const recommendations = await recommendationService.getPersonalizedRecommendations(
      user_id,
      limit,
      exclude_product_ids
    );

    const latency = Date.now() - startTime;

    callback(null, {
      recommendations: recommendations.map(r => ({
        product_id: r.productId,
        name: r.name,
        category: r.category,
        price: r.price,
        score: r.score,
        reason: r.reason,
      })),
      algorithm: 'collaborative_filtering_hybrid',
      latency_ms: latency,
    });
  } catch (error: any) {
    console.error('gRPC Error:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

const getSimilarProducts = async (call: any, callback: any) => {
  const startTime = Date.now();
  const { product_id, limit = 5 } = call.request;

  try {
    console.log(`📡 gRPC: GetSimilarProducts for ${product_id}`);

    const similar = await recommendationService.getSimilarProducts(product_id, limit);
    const latency = Date.now() - startTime;

    callback(null, {
      similar_products: similar.map(r => ({
        product_id: r.productId,
        name: r.name,
        category: r.category,
        price: r.price,
        score: r.score,
        reason: r.reason,
      })),
      latency_ms: latency,
    });
  } catch (error: any) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

const getTrendingProducts = async (call: any, callback: any) => {
  const startTime = Date.now();
  const { category, limit = 5 } = call.request;

  try {
    console.log(`📡 gRPC: GetTrendingProducts in ${category || 'all categories'}`);

    const trending = await recommendationService.getTrendingProducts(category, limit);
    const latency = Date.now() - startTime;

    callback(null, {
      trending_products: trending.map(r => ({
        product_id: r.productId,
        name: r.name,
        category: r.category,
        price: r.price,
        score: r.score,
        reason: r.reason,
      })),
      latency_ms: latency,
    });
  } catch (error: any) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

/**
 * Запуск gRPC сервера
 */
export const startGrpcServer = (port: number = 50051) => {
  const server = new grpc.Server();

  server.addService(recommendationsProto.RecommendationService.service, {
    GetRecommendations: getRecommendations,
    GetSimilarProducts: getSimilarProducts,
    GetTrendingProducts: getTrendingProducts,
  });

  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, boundPort) => {
      if (error) {
        console.error('❌ Failed to start gRPC server:', error);
        return;
      }
      console.log(`🚀 gRPC server running on port ${boundPort}`);
    }
  );

  return server;
};
