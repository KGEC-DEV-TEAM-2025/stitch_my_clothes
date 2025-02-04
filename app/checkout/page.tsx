"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CheckIcon, MapPinIcon, TicketIcon, CreditCardIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import toast from "react-toast";
// import { saveAddress } from "@/lib/api/address";

// Importing UI components from custom UI library and icons from Lucide
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import Link from "next/link";

/**
 * Type for the steps in the checkout process, including title and icon.
 * This type defines each step and its respective icon for better readability and maintenance.
 */
type Steps = {
  title: string;
  icon: React.ReactNode;
};

/**
 * 
 * Array of steps to guide the user through the checkout process:
 * - Delivery Address
 * - Apply Coupon
 * - Choose Payment
 */
const steps: Steps[] = [
  { title: "Delivery Address", icon: <MapPinIcon className="h-5 w-5" /> },
  { title: "Apply Coupon", icon: <TicketIcon className="h-5 w-5" /> },
  { title: "Choose Payment", icon: <CreditCardIcon className="h-5 w-5" /> },
];

/**
 * Type for order items in the cart.
 * It defines the structure of each product in the cart, including:
 * - Name of the product
 * - Size
 * - Quantity
 * - Price
 * - Image URL
 */
type OrderItems = {
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
};

/**
 * Example order items array, representing a sample list of products in the user's cart.
 * This data will typically come from an API or state in real-world applications.
 */
const orderItems: OrderItems[] = [
  {
    name: "Cotton shirt",
    size: "M",
    quantity: 1,
    price: 999.0,
    image:
      "/g1.jpg",
  },
  {
    name: "Black shirt",
    size: "XL",
    quantity: 1,
    price: 799.0,
    image:
      "/g2.webp",
  },
];

/**
 * Main CheckoutPage component for handling the checkout flow.
 * It includes multi-step navigation (delivery address, coupon, payment) and an order summary.
 */
const CheckoutPage = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("deliveryAddress");
      return savedAddress ? JSON.parse(savedAddress) : {
        phoneNumber: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        zipCode: ""
      };
    }
    return {
      phoneNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zipCode: ""
    };
  });

  // State to track the current step of the checkout process
  const [currentStep, setCurrentStep] = useState(0);

  // State for managing coupon input
  const [couponCode, setCouponCode] = useState("");

  // State for managing selected payment method
  const [paymentMethod, setPaymentMethod] = useState("");

  // Calculate subtotal by summing up the prices of all items in the cart
  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  // Static discount value (this can be dynamically calculated based on coupon logic)
  const discount = 600;
  // Calculate total by subtracting the discount from the subtotal
  const total = subtotal - discount;

  // Fetch order summary from the API route
  const [orderSummary, setOrderSummary] = useState<{ items: any[]; total: number } | null>(null);
  useEffect(() => {
    async function fetchOrderSummary() {
      if (user) {
        try {
          const res = await fetch(`/api/order-summary?userId=${user.id}`);
          const data = await res.json();
          if (!data.error) {
            setOrderSummary(data);
          }
        } catch (error) {
          console.error("Error fetching order summary:", error);
        }
      }
    }
    if (isSignedIn) fetchOrderSummary();
  }, [user, isSignedIn]);

  // Early return if the user is not signed in
  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAddress = async () => {
    console.log("hmm") // TODO: kuch to
    // try {
    //   const response = await saveAddress(deliveryAddress, user.id);
    //   console.log(response);
    //   if (response.success) {
    //     toast(response.message);
    //   }
    // } catch (error: any) {
    //   throw new Error(error);
    // } finally {
    //   handleNext();
    // }
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === "paypal") {
      router.push("/checkout/paypal");
    } else {
      // Keep existing flow for other payment methods if any.
      handleNext();
    }
  };

  return (
    <div className="container mx-auto pt-36">
      <h1 className="text-4xl text-[#646464] font-bold mb-6 text-center">CHECKOUT</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left section for checkout steps */}
        <div className="lg:w-2/3 w-full px-4">
          {/* Render step indicators */}
          <div className="flex flex-col lg:flex-row mb-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center mb-4 lg:mb-0 lg:flex-row flex-col lg:space-x-4"
              >
                <div
                  className={`rounded-full p-2 ${index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                    }`}
                >
                  {index < currentStep ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="ml-0 lg:ml-4 lg:mr-8 text-center lg:text-left">
                  <p
                    className={`text-sm font-medium ${index <= currentStep
                        ? "text-primary"
                        : "text-secondary-foreground"
                      }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="h-0.5 w-8 bg-border mt-1 lg:mt-0 mr-0 lg:mr-4 hidden lg:block"></div>
                )}
              </div>
            ))}
          </div>

          {/* Render the current step's content */}
          <Card className="bg-[#f5f5f0]">
            <CardHeader>
              <CardTitle className="subHeading">
                {steps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && (
                <div className="space-y-4">
                  {/* Step 1: Delivery Address Form */}
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" placeholder="Phone Number" value={deliveryAddress.phoneNumber} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phoneNumber: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">Zip Code / Postal Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="Zip Code / Postal Code" value={deliveryAddress.zipCode}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" value={deliveryAddress.city} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="State" value={deliveryAddress.state} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        defaultValue="India"
                        value={deliveryAddress.country} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, country: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address1">Address 1</Label>
                    <Input id="address1" placeholder="Address 1" value={deliveryAddress.address1} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address1: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address 2</Label>
                    <Input id="address2" placeholder="Address 2" value={deliveryAddress.address2} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address2: e.target.value })} />
                  </div>
                  <Button className="w-full bg-[#c40600] text-white" onClick={handleSaveAddress}>
                    Save Address And Continue
                  </Button>
                </div>
              )}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* Step 2: Apply Coupon Code */}
                  <div>
                    <Label htmlFor="couponCode">Enter Coupon Code</Label>
                    <Input
                      id="couponCode"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <Button className="w-full bg-[#c40600] text-white" onClick={handleNext}>
                    Apply Coupon
                  </Button>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Step 3: Choose Payment Method */}
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card">Credit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="debit_card" id="debit_card" />
                        <Label htmlFor="debit_card">Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="net_banking" id="net_banking" />
                        <Label htmlFor="net_banking">Net Banking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <Button className="w-full bg-[#c40600] text-white" onClick={handleNext}>
                    Confirm Payment Method
                  </Button>
                  <Button className="w-full bg-[#c40600] text-white"
                          onClick={handleConfirmPayment}
                          asChild>
                    <Link href="/order">Place Order</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 flex space-x-4 justify-center lg:justify-start">
            {currentStep > 0 && (
              <Button variant={"outline"} className="bg-[#c40600] text-white" onClick={handlePrevious}>
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button variant={"outline"} className="bg-[#c40600] text-white" onClick={handleNext}>
                Continue
              </Button>
            )}
          </div>
        </div>

        {/* Right section for order summary */}
        <div className="lg:w-1/3 w-full px-4">
          <Card className="bg-[#f5f5f0]">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderSummary ? (
                  <>
                    {orderSummary.items.map((item, index) => (
                      <div key={index} className="mb-4 border-b pb-2">
                        <div className="flex justify-between text-sm">
                          <span>Shirt Price:</span>
                          <span>${item.shirt.price?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Monogram Price:</span>
                          <span>${item.monogram?.style.price?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="flex justify-between font-semibold mt-1">
                          <span>Item Total:</span>
                          <span>${item.itemTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <p>Loading order summary...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
