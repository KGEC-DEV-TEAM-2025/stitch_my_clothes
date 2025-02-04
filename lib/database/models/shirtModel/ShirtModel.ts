import mongoose, { Document, Schema } from "mongoose";

interface ProductItem {
  name: string;
  image: string;
  price: number;
}

// Extend the Shirt interface from Document for MongoDB compatibility
export interface Shirt extends Document {
  price: number;
  collarStyle?: ProductItem;
  collarButton?: ProductItem;
  collarHeight?: ProductItem;
  cuffStyle?: ProductItem;
  cuffLinks?: ProductItem;
  watchCompatible?: boolean;
  bottom?: ProductItem;
  back?: ProductItem;
  pocket?: ProductItem;
  placket?: ProductItem;
  sleeves?: ProductItem;
  fit?: ProductItem;
  colorId: mongoose.Types.ObjectId;
  fabricId: mongoose.Types.ObjectId;
  monogramId?: mongoose.Types.ObjectId;
  measurementId?: mongoose.Types.ObjectId;
}

// Define ProductItemSchema for reusability
const ProductItemSchema = new Schema<ProductItem>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

const ShirtSchema = new Schema<Shirt>({
  price: { type: Number, required: true },
  collarStyle: { type: ProductItemSchema, required: false },
  collarButton: { type: ProductItemSchema, required: false },
  collarHeight: { type: ProductItemSchema, required: false },
  cuffStyle: { type: ProductItemSchema, required: false },
  cuffLinks: { type: ProductItemSchema, required: false },
  watchCompatible: { type: Boolean, required: false },
  bottom: { type: ProductItemSchema, required: false },
  back: { type: ProductItemSchema, required: false },
  pocket: { type: ProductItemSchema, required: false },
  placket: { type: ProductItemSchema, required: false },
  sleeves: { type: ProductItemSchema, required: false },
  fit: { type: ProductItemSchema, required: false },
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    required: true,
  },
  fabricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fabric",
    required: true,
  },
  monogramId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monogram",
    required: false,
  },
  measurementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Measurement",
    required: false,
  },
});

// Fix for Next.js hot-reloading
export const ShirtModel =
  mongoose.models.Shirt || mongoose.model<Shirt>("Shirt", ShirtSchema);
