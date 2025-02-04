"use server";

import  connectToDatabase  from "@/lib/database/connect";
import ColorModel from "@/lib/database/models/shirtModel/ColorModel";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Helper function to convert base64 string to buffer
const base64ToBuffer = (base: any) => {
  const base64String = base.split(";base64,").pop();
  return Buffer.from(base64String, "base64");
};

export const createColor = async (
  name: string,
  hexCode: string,
  image: string, // Base64 string for image upload
  fabricId: string // Fabric ID as a string
) => {
  try {
    await connectToDatabase();

    if (!name || !hexCode || !image || !fabricId) {
      return {
        message: "Name, hexCode, image, and fabricId are required.",
        success: false,
      };
    }

    // Upload image to Cloudinary
    const imageBuffer = base64ToBuffer(image);

    const imageFormData = new FormData();
    imageFormData.append(
      "file",
      new Blob([imageBuffer], { type: "image/jpeg" })
    );
    imageFormData.append("upload_preset", "color_images");

    const imageResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: imageFormData,
      }
    );

    const uploadedImage = await imageResponse.json();

    // Convert fabricId to ObjectId
    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);

    // Create a new color entry in the database
    await new ColorModel({
      name,
      hexCode,
      fabricId: fabricObjectId, // Store the ObjectId for fabricId
      image: {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      },
    }).save();

    return {
      message: `Color ${name} has been successfully created.`,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating color.",
      success: false,
    };
  }
};

// Delete a color by ID
export const deleteColorById = async (colorId: string) => {
  try {
    await connectToDatabase(); // Ensure DB connection

    const result = await ColorModel.findByIdAndDelete(colorId);
    if (result) {
      return {
        success: true,
        message: "Color successfully deleted.",
      };
    } else {
      return {
        success: false,
        message: "Color not found.",
      };
    }
  } catch (error: any) {
    console.log("Error deleting color:", error);
    return {
      success: false,
      message: error.message || "An error occurred while deleting the color.",
    };
  }
};

// Get all colors
export const getAllColors = async () => {
  try {
    await connectToDatabase(); // Ensure DB connection

    const colors = await ColorModel.find()
      .sort({ updatedAt: -1 }) // Sort by the latest updated entries
      .lean();

    return JSON.parse(JSON.stringify(colors));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

export const getColorByFabric = async (fabricId: string) => {
  try {
    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId); // Convert string to ObjectId

    const colors = await ColorModel.find({
      fabricId: fabricObjectId,
    })
      .sort({ name: 1 }) // Sorting colors by name or other preferred criteria
      .lean();

    return JSON.parse(JSON.stringify(colors));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
