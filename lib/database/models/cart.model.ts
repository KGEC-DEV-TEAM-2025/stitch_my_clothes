import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "ShirtModel",
          required: true,
        },
        qty: {
          type: Number, // changed from String to Number for consistency
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    cartTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAfterDiscount: {
      type: Number,
      default: 0,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
      index: true,
    },

  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
