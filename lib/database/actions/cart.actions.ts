"use server";

// import { handleError } from "@/lib/utils";
import connectToDatabase from "../connect";
import Product from "../models/product.model";
import User from "../models/user.model";
import Cart from "../models/cart.model";

// Cart operations for user:
export async function saveCartForUser(cart: any, clerkId: string) {
  try {
    await connectToDatabase();
    let products = [];
    let user = await User.findOne({ clerkId });
    await Cart.deleteOne({ user: user._id });

    for (let i = 0; i < cart.length; i++) {
      let dbProduct: any = await Product.findById(cart[i]._id).lean();
      let subProduct = dbProduct.subProducts[cart[i].style];
      let tempProduct: any = {};
      tempProduct.name = dbProduct.name;
      tempProduct.product = dbProduct._id;
      tempProduct.color = {
        color: cart[i].color.color,
        image: cart[i].color.image,
      };
      tempProduct.image = subProduct.images[0].url;
      tempProduct.qty = Number(cart[i].qty);
      tempProduct.size = cart[i].size;
      tempProduct.vendor = cart[i].vendor ? cart[i].vendor : {};
      tempProduct.vendorId =
        cart[i].vendor && cart[i].vendor._id ? cart[i].vendor._id : "";

      let price = Number(
        subProduct.sizes.find((p: any) => p.size == cart[i].size).price
      );
      tempProduct.price =
        subProduct.discount > 0
          ? (price - (price * Number(subProduct.discount)) / 100).toFixed(2)
          : price.toFixed(2);
      products.push(tempProduct);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].qty;
    }
    await new Cart({
      products,
      cartTotal: cartTotal.toFixed(2),
      user: user._id,
    }).save();
    return { success: true };
  } catch(error){

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
  }catch(error){

  } 
}

// update cart for user
export async function updateCartForUser(products: any) {
  try {
    await connectToDatabase();
    const promises = products.map(async (p: any) => {
      let dbProduct: any = await Product.findById(p._id).lean();
      let originalPrice = dbProduct.subProducts[p.style].sizes.find(
        (x: any) => x.size == p.size
      ).price;
      let quantity = dbProduct.subProducts[p.style].sizes.find(
        (x: any) => x.size == p.size
      ).qty;
      let discount = dbProduct.subProducts[p.style].discount;
      return {
        ...p,
        priceBefore: originalPrice,
        price:
          discount > 0
            ? originalPrice - originalPrice / discount
            : originalPrice,
        discount,
        quantity,
        shippingFee: dbProduct.shipping,
      };
    });
    const data = await Promise.all(promises);
    return {
      success: true,
      message: "successfully updated the cart.",
      data: JSON.parse(JSON.stringify(data)),
    };
  } catch (error) {

  }
}

export async function beforeAddToCart(){

}

export async function addToCart(item, clerkId) {
  try {
    await connectToDatabase();
    
    // Find the user by clerkId
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, products: [], cartTotal: 0 });
    }

    // Find the product in the database
    const dbProduct = await Product.findById(item._id).lean();
    if (!dbProduct) {
      throw new Error("Product not found");
    }

    const subProduct = dbProduct.subProducts[item.style];
    if (!subProduct) {
      throw new Error("Invalid product style");
    }

    // Extract price and discount details
    const sizeDetails = subProduct.sizes.find((x) => x.size === item.size);
    if (!sizeDetails) {
      throw new Error("Size not available");
    }

    let price = Number(sizeDetails.price);
    let discount = Number(subProduct.discount);
    let finalPrice = discount > 0 ? (price - (price * discount) / 100).toFixed(2) : price.toFixed(2);

    // Check if the item already exists in the cart
    let existingItem = cart.products.find((p) => p.product.toString() === item._id && p.size === item.size);
    
    if (existingItem) {
      // If the item exists, update the quantity
      existingItem.qty += Number(item.qty);
    } else {
      // Otherwise, add a new item to the cart
      cart.products.push({
        name: dbProduct.name,
        product: dbProduct._id,
        color: { color: item.color.color, image: item.color.image },
        image: subProduct.images[0].url,
        qty: Number(item.qty),
        size: item.size,
        vendor: item.vendor || {},
        vendorId: item.vendor?._id || "",
        price: finalPrice,
      });
    }

    // Recalculate total cart price
    cart.cartTotal = cart.products.reduce((sum, p) => sum + p.price * p.qty, 0).toFixed(2);

    // Save the updated cart
    await cart.save();

    return { success: true, message: "Item added to cart successfully" };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: error.message };
  }
}
