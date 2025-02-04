import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface for the nested product parts (e.g., fit, pocket, etc.)
interface IProductPart {
  name: string;
  image: {
    url: string;
  };
  price: number;
}

// Define the Product Interface
export interface IProduct extends Document {
  fit: IProductPart;
  pocket: IProductPart;
  placket: IProductPart;
  bottom: IProductPart;
  back: IProductPart;
  sleeves: IProductPart;
  monogram: IProductPart;
  collar: IProductPart;
  cuff: IProductPart;
  fabric: IProductPart;
  color: IProductPart;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema = new Schema(
  {
    fit: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    pocket: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    placket: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    bottom: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    back: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    sleeves: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    monogram: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    collar: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    cuff: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    fabric: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
    color: {
      name: { type: String, required: true },
      image: { url: { type: String, required: true } },
      price: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

// Define the Mongoose Model
const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
