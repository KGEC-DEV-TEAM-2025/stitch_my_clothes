import mongoose, { Schema, Document } from "mongoose";

export interface Order extends Document {
  shirt: mongoose.Types.ObjectId; // Reference to the Shirt _id
  orderConfirmation: boolean;
  deliveryStatus: "pending" | "shipped" | "delivered";
  price: number;
  deliveryCost: number;
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery";
  paymentTime: Date;
  receipt: string; // String to store the PDF document URL or receipt
  orderAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
}

// Define the Order schema
export const OrderSchema = new Schema<Order>({
  shirt: { 
    type: mongoose.Schema.Types.ObjectId, // Correctly reference ObjectId
    ref: "Shirt", // Reference the "Shirt" model
    required: true 
  },
  orderConfirmation: { type: Boolean, required: true },
  deliveryStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending",
  },
  price: { type: Number, required: true },
  deliveryCost: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"],
    required: true,
  },
  paymentTime: { type: Date, required: true },
  receipt: { type: String, required: true }, // Link to the receipt PDF
  orderAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
});
const OrderModel = mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema);
export default OrderModel;