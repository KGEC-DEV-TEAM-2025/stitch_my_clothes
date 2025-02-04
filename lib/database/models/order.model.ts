import mongoose, { Schema, Document } from "mongoose";
import ShirtModel from "./shirtModel/ShirtModel";

export interface Order extends Document {
  shirt:[{
    type : mongoose.Types.ObjectId;
    ref: "ShirtModel";
  }]// Reference to the Shirt _id
  orderConfirmation: boolean;
  deliveryStatus: "pending" | "shipped" | "delivered";
  price: number;
  deliveryCost: number;
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery";
  paymentTime: Date;
  receipt: string; // String to store the PDF document URL or receipt
  orderAddress: {
    phoneNumber: string;
    address1 : string;
    address2 : string;
    city : string;
    state : string;
    zipCode : string;
    country : string;
    active: boolean;
  };
}

// Define the Order schema
export const OrderSchema = new Schema<Order>({
  shirt: [{ 
    type: mongoose.Schema.Types.ObjectId, // Correctly reference ObjectId
    ref: "ShirtModel", // Reference the "Shirt" model
    required: true 
  }],
  orderConfirmation: { type: Boolean, required: true },
  deliveryStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    required : true,
    default: "pending",
  },
  price: { type: Number, required: true },
  deliveryCost: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"],
    required : true,
  },
  paymentTime: { type: Date, required: true },
  receipt: { type: String, required: true }, // Link to the receipt PDF
  orderAddress: {
      phoneNumber: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
      },
      active: {
        type: Boolean,
        default: true,
      },
  },
});
const OrderModel = mongoose.model<Order>("Order", OrderSchema);

export default OrderModel;
