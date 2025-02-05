"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useAtom, useStore } from "jotai";
import { cartMenuState } from "@/app/utils/data/store";
import { useUser } from "@clerk/nextjs";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CartDrawer = () => {
  const { user, isLoaded } = useUser();
  const [cartMenuOpen, setCartMenuOpen] = useAtom(cartMenuState, {
    store: useStore(),
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await fetch(
        `/api/order-summary?userId=${user.id}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await res.json();
      // Assuming API returns items array with product details
      const items = data.items.map((item: any) => ({
        id: item.product._id,
        name: item.product.name,
        image: item.product.image || "/placeholder.jpg",
        price: Number(item.product.price),
        quantity: item.qty,
      }));
      setCartItems(items);
      setTotal(Number(data.total));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchCart();
    }
  }, [isLoaded, user, cartMenuOpen]);

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const computedTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="relative flex items-center">
      <Sheet open={cartMenuOpen} onOpenChange={setCartMenuOpen}>
        <SheetTrigger asChild>
          <button onClick={() => setCartMenuOpen(true)}>
            <ShoppingCart className="text-[#4a2b2b]" />
          </button>
        </SheetTrigger>
        <SheetContent className="w-[90%] max-w-[450px] sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle className="subHeading">CART</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {cartItems.length === 0 && (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
            {cartItems.map((item) => (
              <div
                className="flex items-center space-x-4 border-b-2 pb-3"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-xs sm:text-sm tracking-wide">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <button
                        className="p-1"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="p-1"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-semibold text-xs sm:text-base">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 w-[90%] mt-6 bg-white">
            <p className="text-sm text-gray-500">
              Tax included. Shipping calculated at checkout.
            </p>
            <Link href={"/checkout"}>
              <Button className="w-full mt-4 bg-[#c40600]">
                CHECKOUT - ₹{computedTotal.toFixed(2)}
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartDrawer;