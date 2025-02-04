"use server";

import connectToDatabase from "../connect";
import Product from "../models/product.model";
import User from "../models/user.model";
import Cart from "../models/cart.model";

// Cart operations for user:
export async function saveCartForUser(cart: any, clerkId: string) {
  try {
    await connectToDatabase();
    let products: any[] = [];
    let user = await User.findOne({ clerkId });
    await Cart.deleteOne({ user: user._id });

    for (let i = 0; i < cart.length; i++) {
      let dbProduct: any = await Product.findById(cart[i]._id).lean();
      let subProduct = dbProduct.subProducts[cart[i].style];
      let sizeObj = subProduct.sizes.find((p: any) => p.size === cart[i].size);
      let originalPrice: number = Number(sizeObj.price);
      let discount = subProduct.discount || 0;
      let finalPrice: number =
        discount > 0 ? originalPrice - (originalPrice * discount) / 100 : originalPrice;
      
      products.push({
        product: dbProduct._id,
        qty: Number(cart[i].qty),
        price: Number(finalPrice.toFixed(2)),
      });
    }
    let cartTotal: number = products.reduce(
      (sum, prod) => sum + prod.price * prod.qty,
      0
    );

    await new Cart({
      products,
      cartTotal: Number(cartTotal.toFixed(2)),
      totalAfterDiscount: Number(cartTotal.toFixed(2)), // update if applying coupon later
      user: user._id,
    }).save();
    return { success: true };
  } catch (error) {
    throw new Error("Error saving cart: " + error);
  }
}

export async function getSavedCartForUser(clerkId: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    const cart = await Cart.findOne({ user: user._id });
    return {
      user: JSON.parse(JSON.stringify(user)),
      cart: JSON.parse(JSON.stringify(cart)),
      address: JSON.parse(JSON.stringify(user.address)),
    };
  } catch (error) {
    throw new Error("Error getting cart: " + error);
  } 
}

// update cart for user (recalculate prices using product details)
export async function updateCartForUser(products: any) {
  try {
    await connectToDatabase();
    const updatedProductsPromises = products.map(async (p: any) => {
      let dbProduct: any = await Product.findById(p._id).lean();
      let subProduct = dbProduct.subProducts[p.style];
      let sizeObj = subProduct.sizes.find((x: any) => x.size === p.size);
      let originalPrice: number = Number(sizeObj.price);
      let discount = subProduct.discount || 0;
      let finalPrice: number =
        discount > 0
          ? originalPrice - (originalPrice * discount) / 100
          : originalPrice;
      return {
        product: p._id,
        qty: Number(p.qty),
        price: Number(finalPrice.toFixed(2)),
      };
    });
    const updatedProducts = await Promise.all(updatedProductsPromises);
    return {
      success: true,
      message: "Successfully updated the cart.",
      data: JSON.parse(JSON.stringify(updatedProducts)),
    };
  } catch (error) {
    throw new Error("Error updating cart: " + error);
  }
}
