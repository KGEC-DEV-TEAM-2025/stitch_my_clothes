"use server";

import connectToDatabase from "@/lib/database/connect";
import PocketModel from "@/lib/database/models/shirtModel/PocketModel";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

// Cloudinary configuration
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

// Create new Pocket entry
export const createPocket = async (
  name: string,
  image: string,
  price: number,
  icon: string,
  fabricId: string, // Fabric ID
  colorId: string // Fabric ID
) => {
  try {
    await connectToDatabase();

    // Upload image
    const imageBuffer = base64ToBuffer(image);
    const imageFormData = new FormData();
    imageFormData.append(
      "file",
      new Blob([imageBuffer], { type: "image/jpeg" })
    );
    imageFormData.append("upload_preset", "pocket_images");

    const imageResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: imageFormData,
      }
    );
    const uploadedImage = await imageResponse.json();

    // Upload icon
    const iconBuffer = base64ToBuffer(icon);
    const iconFormData = new FormData();
    iconFormData.append("file", new Blob([iconBuffer], { type: "image/jpeg" }));
    iconFormData.append("upload_preset", "pocket_icons");

    const iconResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: iconFormData,
      }
    );
    const uploadedIcon = await iconResponse.json();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    // Create new Pocket in the database
    await new PocketModel({
      name,
      image: {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      },
      price,
      icon: {
        url: uploadedIcon.secure_url,
        public_id: uploadedIcon.public_id,
      },
      fabricId: fabricObjectId, // Store fabric ID
      colorId: colorObjectId, // Store fabric ID
    }).save();

    return {
      message: "Pocket has been successfully created.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating pocket.",
      success: false,
    };
  }
};

// Delete Pocket entry and its image from Cloudinary
export const deletePocket = async (pocketId: string) => {
  try {
    await connectToDatabase();

    const pocket = await PocketModel.findById(pocketId);

    if (!pocket) {
      return {
        message: "Pocket not found with this Id!",
        success: false,
      };
    }

    // Delete images from Cloudinary
    await cloudinary.v2.uploader.destroy(pocket.image.public_id);
    await cloudinary.v2.uploader.destroy(pocket.icon.public_id);

    // Delete pocket document from MongoDB
    await PocketModel.findByIdAndDelete(pocketId);

    return {
      message:
        "Successfully deleted pocket and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting pocket.",
      success: false,
    };
  }
};

// Update the Pocket's fields by its ID
export const updatePocket = async (
  pocketId: string,
  name: string,
  image: string,
  price: number,
  icon: string
) => {
  try {
    await connectToDatabase();

    const pocket = await PocketModel.findById(pocketId);

    if (!pocket) {
      return {
        message: "Pocket not found with this Id!",
        success: false,
      };
    }

    if (name) {
      pocket.name = name;
    }

    if (image) {
      // Upload new image if provided
      const imageBuffer = base64ToBuffer(image);
      const imageFormData = new FormData();
      imageFormData.append(
        "file",
        new Blob([imageBuffer], { type: "image/jpeg" })
      );
      imageFormData.append("upload_preset", "pocket_images");

      const imageResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const uploadedImage = await imageResponse.json();
      pocket.image = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    if (price !== undefined) {
      pocket.price = price;
    }

    if (icon) {
      // Upload new icon if provided
      const iconBuffer = base64ToBuffer(icon);
      const iconFormData = new FormData();
      iconFormData.append(
        "file",
        new Blob([iconBuffer], { type: "image/jpeg" })
      );
      iconFormData.append("upload_preset", "pocket_icons");

      const iconResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: iconFormData,
        }
      );

      const uploadedIcon = await iconResponse.json();
      pocket.icon = {
        url: uploadedIcon.secure_url,
        public_id: uploadedIcon.public_id,
      };
    }

    await pocket.save();

    return {
      message: "Pocket has been updated successfully.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating pocket.",
      success: false,
    };
  }
};

export const getPocketsByColorAndFabric = async (fabricId: string, colorId: string) => {
  try {
    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    const pockets = await PocketModel.find({ fabricId: fabricObjectId, colorId: colorObjectId })
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(pockets));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
