import React from "react";
import { useRouter } from "next/navigation";
import { PayPalButton } from "@/app/components/PayPal/PayPalButton";

const PaypalPage = () => {
  const router = useRouter();

  const handleSuccess = (order: any) => {
    console.log("Payment successful", order);
    // after payment, redirect user to order confirmation page
    router.push("/order");
  };

  // For demonstration, a fixed amount is used.
  // In a real app, amount can be passed via query params or context.
  const amount = "10.00";

  return (
    <div className="container mx-auto pt-36">
      <h1 className="text-4xl text-center text-[#646464] font-bold mb-6">
        PayPal Payment
      </h1>
      <PayPalButton amount={amount} onSuccess={handleSuccess} />
    </div>
  );
};

export default PaypalPage;