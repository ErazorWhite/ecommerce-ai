import mongoose, { Schema, Document } from 'mongoose';

export enum InteractionType {
  VIEW = 'view',
  CLICK = 'click',
  ADD_TO_CART = 'add_to_cart',
  PURCHASE = 'purchase',
  SEARCH = 'search',
}

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  type: InteractionType;
  metadata?: Record<string, any>;
  sessionId: string;
  timestamp: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(InteractionType),
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for analytics
InteractionSchema.index({ userId: 1, timestamp: -1 });
InteractionSchema.index({ productId: 1, type: 1 });

export const Interaction = mongoose.model<IInteraction>('Interaction', InteractionSchema);
