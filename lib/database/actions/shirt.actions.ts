"use server"

import connectToDatabase from "@/lib/database/connect";
import { ShirtModel } from "@/lib/database/models/shirtModel/ShirtModel";
import mongoose from "mongoose";

interface ProductItem {
  name: string;
  image: string;
  price: number;
}

export const createShirt = async (
  price: number,
  bottom: ProductItem,
  back: ProductItem,
  sleeves: ProductItem,
  cuffStyle: ProductItem,
  cuffLinks: ProductItem,
  collarStyle: ProductItem,
  collarHeight: ProductItem,
  collarButton: ProductItem,
  placket: ProductItem,
  pocket: ProductItem,
  fit: ProductItem,
  watchCompatible: boolean,
  colorId: string,
  fabricId: string
) => {
  try {
    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    const newShirt = await new ShirtModel({
      price,
      bottom,
      back,
      sleeves,
      cuffStyle,
      cuffLinks,
      collarStyle,
      collarHeight,
      collarButton,
      placket,
      pocket,
      fit,
      watchCompatible,
      colorId: colorObjectId,
      fabricId: fabricObjectId,
    }).save();

    return {
      message: "Shirt created successfully.",
      success: true,
      shirt: newShirt,
    };
  } catch (error: any) {
    console.error(error);
    return {
      message: "Error creating shirt.",
      success: false,
    };
  }
};