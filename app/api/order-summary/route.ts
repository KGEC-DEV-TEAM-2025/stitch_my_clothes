// app/api/order-summary/route.ts
import { NextResponse } from "next/server";
import OrderModel from "@/lib/database/models/order.model";
import ShirtModel from "@/lib/database/models/shirtModel/OrderInfoModel";
import FabricModel from "@/lib/database/models/shirtModel/MonogramModel";
import MonogramModel from "@/lib/database/models/shirtModel/MonogramModel";
import {connectToDatabase} from "@/lib/database/connect";

// GET /api/order-summary?userId=<userId>
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    
    // Query the order placed by the user (assuming one order per user here)
    const order = await OrderModel.findOne({ "orderAddress.phoneNumber": userId }).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    let total = 0;
    const items = [];
    
    // Iterate over shirt references in order
    for (const shirtId of order.shirt) {
      const shirt = await ShirtModel.findById(shirtId).lean();
      if (!shirt) continue;
  
      // Query the related Fabric and Monogram based on the shirt (adjust the field names as needed)
      const fabric = await FabricModel.findById(shirt.fabricId).lean();
      const monogram = await MonogramModel.findOne({ fabricId: shirt.fabricId }).lean();
      
      // For demonstration, assume the shirt has a price field and monogram style holds a price.
      const shirtPrice = shirt.price || 0;
      // Fabric model doesn't have a price in its schema so we assume zero or any fixed value.
      const fabricPrice = fabric ? 0 : 0;
      const monogramPrice = monogram ? monogram.style.price || 0 : 0;
      
      // Total price for this item (add discount logic if needed)
      const itemTotal = shirtPrice + fabricPrice + monogramPrice;
      total += itemTotal;
      
      items.push({ shirt, fabric, monogram, itemTotal });
    }
    
    return NextResponse.json({ items, total });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}