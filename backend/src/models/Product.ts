import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  brand: string;
  specs: Record<string, any>;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['smartphones', 'laptops', 'tablets', 'accessories', 'audio', 'gaming'],
    },
    subcategory: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    specs: {
      type: Schema.Types.Mixed,
      default: {},
    },
    images: [{ type: String }],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ tags: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
