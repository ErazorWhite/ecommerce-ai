import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Interaction, InteractionType } from '../models/Interaction';

const users = [
  {
    email: 'john.doe@example.com',
    name: 'John Doe',
    preferences: {
      categories: ['smartphones', 'audio'],
      priceRange: { min: 0, max: 50000 },
    },
  },
  {
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    preferences: {
      categories: ['laptops', 'tablets'],
      priceRange: { min: 30000, max: 150000 },
    },
  },
  {
    email: 'alex.johnson@example.com',
    name: 'Alex Johnson',
    preferences: {
      categories: ['gaming', 'accessories'],
      priceRange: { min: 0, max: 100000 },
    },
  },
];

const products = [
  // Smartphones
  {
    name: 'iPhone 15 Pro',
    description: 'Flagship smartphone with A17 Pro chip, titanium design, and advanced camera system',
    category: 'smartphones',
    subcategory: 'flagship',
    price: 89999,
    brand: 'Apple',
    specs: {
      display: '6.1" Super Retina XDR',
      processor: 'A17 Pro',
      ram: '8GB',
      storage: '256GB',
      camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      battery: '3274mAh',
    },
    images: ['https://example.com/iphone15pro.jpg'],
    stock: 45,
    rating: 4.8,
    reviewCount: 1250,
    tags: ['5g', 'premium', 'photography', 'gaming'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android flagship with S Pen, advanced AI features, and exceptional display',
    category: 'smartphones',
    subcategory: 'flagship',
    price: 94999,
    brand: 'Samsung',
    specs: {
      display: '6.8" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      storage: '512GB',
      camera: '200MP Main + 12MP Ultra Wide + 50MP Telephoto + 10MP Telephoto',
      battery: '5000mAh',
    },
    images: ['https://example.com/galaxys24.jpg'],
    stock: 32,
    rating: 4.7,
    reviewCount: 980,
    tags: ['5g', 's-pen', 'photography', 'productivity'],
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'AI-powered smartphone with best-in-class computational photography',
    category: 'smartphones',
    subcategory: 'flagship',
    price: 74999,
    brand: 'Google',
    specs: {
      display: '6.7" LTPO OLED',
      processor: 'Google Tensor G3',
      ram: '12GB',
      storage: '256GB',
      camera: '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
      battery: '5050mAh',
    },
    images: ['https://example.com/pixel8pro.jpg'],
    stock: 28,
    rating: 4.6,
    reviewCount: 720,
    tags: ['5g', 'ai', 'photography', 'clean-android'],
  },

  // Laptops
  {
    name: 'MacBook Pro 14" M3 Pro',
    description: 'Professional laptop with M3 Pro chip, stunning Liquid Retina XDR display',
    category: 'laptops',
    subcategory: 'professional',
    price: 149999,
    brand: 'Apple',
    specs: {
      display: '14.2" Liquid Retina XDR',
      processor: 'Apple M3 Pro',
      ram: '18GB',
      storage: '512GB SSD',
      graphics: 'Integrated 14-core GPU',
      battery: 'Up to 18 hours',
    },
    images: ['https://example.com/macbookpro14.jpg'],
    stock: 18,
    rating: 4.9,
    reviewCount: 445,
    tags: ['creative', 'development', 'portable', 'premium'],
  },
  {
    name: 'Dell XPS 15',
    description: 'Premium Windows laptop with InfinityEdge display and powerful performance',
    category: 'laptops',
    subcategory: 'professional',
    price: 129999,
    brand: 'Dell',
    specs: {
      display: '15.6" 4K OLED',
      processor: 'Intel Core i7-13700H',
      ram: '16GB',
      storage: '1TB SSD',
      graphics: 'NVIDIA RTX 4050',
      battery: 'Up to 13 hours',
    },
    images: ['https://example.com/xps15.jpg'],
    stock: 22,
    rating: 4.5,
    reviewCount: 567,
    tags: ['windows', 'creative', 'business', '4k'],
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'Compact gaming laptop with AMD Ryzen and RTX graphics',
    category: 'laptops',
    subcategory: 'gaming',
    price: 119999,
    brand: 'ASUS',
    specs: {
      display: '14" QHD 165Hz',
      processor: 'AMD Ryzen 9 7940HS',
      ram: '32GB',
      storage: '1TB SSD',
      graphics: 'NVIDIA RTX 4060',
      battery: 'Up to 10 hours',
    },
    images: ['https://example.com/rogg14.jpg'],
    stock: 15,
    rating: 4.7,
    reviewCount: 389,
    tags: ['gaming', 'portable', 'high-refresh', 'rgb'],
  },

  // Audio
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with premium sound quality',
    category: 'audio',
    subcategory: 'headphones',
    price: 24999,
    brand: 'Sony',
    specs: {
      type: 'Over-ear',
      noiseCancellation: 'Active (ANC)',
      battery: 'Up to 30 hours',
      connectivity: 'Bluetooth 5.2, LDAC',
      features: 'Multipoint, Spatial Audio',
    },
    images: ['https://example.com/sony1000xm5.jpg'],
    stock: 67,
    rating: 4.8,
    reviewCount: 2340,
    tags: ['wireless', 'anc', 'premium', 'travel'],
  },
  {
    name: 'AirPods Pro (2nd Gen)',
    description: 'Premium wireless earbuds with adaptive audio and precise noise cancellation',
    category: 'audio',
    subcategory: 'earbuds',
    price: 18999,
    brand: 'Apple',
    specs: {
      type: 'In-ear',
      noiseCancellation: 'Active (ANC)',
      battery: 'Up to 6 hours (30 with case)',
      connectivity: 'Bluetooth 5.3',
      features: 'Spatial Audio, Adaptive Audio, H2 chip',
    },
    images: ['https://example.com/airpodspro2.jpg'],
    stock: 92,
    rating: 4.7,
    reviewCount: 3120,
    tags: ['wireless', 'anc', 'apple-ecosystem', 'compact'],
  },

  // Gaming
  {
    name: 'PlayStation 5',
    description: 'Next-gen gaming console with ultra-high-speed SSD and ray tracing',
    category: 'gaming',
    subcategory: 'console',
    price: 44999,
    brand: 'Sony',
    specs: {
      processor: 'Custom AMD Zen 2',
      graphics: 'Custom RDNA 2',
      storage: '825GB SSD',
      resolution: 'Up to 8K',
      features: 'Ray Tracing, 3D Audio, DualSense Controller',
    },
    images: ['https://example.com/ps5.jpg'],
    stock: 25,
    rating: 4.9,
    reviewCount: 1890,
    tags: ['console', 'exclusive-games', '4k', 'ray-tracing'],
  },

  // Accessories
  {
    name: 'Anker PowerCore 20K',
    description: 'High-capacity portable charger with fast charging support',
    category: 'accessories',
    subcategory: 'power-banks',
    price: 3499,
    brand: 'Anker',
    specs: {
      capacity: '20000mAh',
      output: '22.5W PD',
      ports: '2x USB-C, 1x USB-A',
      features: 'PowerIQ 3.0, Trickle-Charging Mode',
    },
    images: ['https://example.com/anker20k.jpg'],
    stock: 150,
    rating: 4.6,
    reviewCount: 5670,
    tags: ['portable', 'fast-charging', 'travel', 'budget'],
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDatabase();

    // Очищаем существующие данные
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Interaction.deleteMany({});

    // Создаем пользователей
    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Создаем продукты
    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Создаем тестовые взаимодействия
    console.log('🔄 Creating interactions...');
    const interactions = [];
    
    for (const user of createdUsers) {
      const sessionId = `session_${user._id}_${Date.now()}`;
      
      // Каждый пользователь просматривает 3-5 товаров
      const viewCount = Math.floor(Math.random() * 3) + 3;
      const shuffledProducts = [...createdProducts].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < viewCount; i++) {
        interactions.push({
          userId: user._id,
          productId: shuffledProducts[i]._id,
          type: InteractionType.VIEW,
          sessionId,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        });

        // 50% шанс клика после просмотра
        if (Math.random() > 0.5) {
          interactions.push({
            userId: user._id,
            productId: shuffledProducts[i]._id,
            type: InteractionType.CLICK,
            sessionId,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          });
        }

        // 30% шанс добавления в корзину
        if (Math.random() > 0.7) {
          interactions.push({
            userId: user._id,
            productId: shuffledProducts[i]._id,
            type: InteractionType.ADD_TO_CART,
            sessionId,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          });
        }
      }

      // Добавляем 1-2 покупки
      const purchaseCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < purchaseCount; i++) {
        interactions.push({
          userId: user._id,
          productId: shuffledProducts[i]._id,
          type: InteractionType.PURCHASE,
          sessionId,
          metadata: { price: shuffledProducts[i].price },
          timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        });
      }
    }

    const createdInteractions = await Interaction.insertMany(interactions);
    console.log(`✅ Created ${createdInteractions.length} interactions`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Interactions: ${createdInteractions.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
