import mongoose, { Schema, Document } from "mongoose";

export interface Order extends Document {
  shirt: mongoose.Types.ObjectId[]; // multiple shirt items referenced
  orderConfirmation: boolean;
  deliveryStatus: "pending" | "shipped" | "delivered";
  price: {
    base: number;
    discount: number;
    deliveryCost: number;
    total: number;
  };
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery";
  paymentTime: Date;
  receipt: string; // URL or PDF receipt link
  orderAddress: {
    phoneNumber: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    active: boolean;
  };
}

export const OrderSchema = new Schema<Order>({
  shirt: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShirtModel",
      required: true,
    },
  ],
  orderConfirmation: { type: Boolean, required: true },
  deliveryStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending",
    required: true,
  },
  price: {
    base: { type: Number, required: true },
    discount: { type: Number, required: true },
    deliveryCost: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"],
    required: true,
  },
  paymentTime: { type: Date, required: true },
  receipt: { type: String, required: true },
  orderAddress: {
    phoneNumber: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
},
{
  timestamps: true,
});

const OrderModel = mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema);
export default OrderModel;
