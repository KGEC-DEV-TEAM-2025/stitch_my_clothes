"use server";

import connectToDatabase from "@/lib/database/connect";
import PlacketModel from "@/lib/database/models/shirtModel/PlacketModel";
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

// Create new Placket entry
export const createPlacket = async (
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
    imageFormData.append("upload_preset", "placket_images");

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
    iconFormData.append("upload_preset", "placket_icons");

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

    // Create new Placket in the database
    await new PlacketModel({
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
      message: "Placket has been successfully created.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating placket.",
      success: false,
    };
  }
};

// Delete Placket entry and its image from Cloudinary
export const deletePlacket = async (placketId: string) => {
  try {
    await connectToDatabase();

    const placket = await PlacketModel.findById(placketId);

    if (!placket) {
      return {
        message: "Placket not found with this Id!",
        success: false,
      };
    }

    // Delete images from Cloudinary
    await cloudinary.v2.uploader.destroy(placket.image.public_id);
    await cloudinary.v2.uploader.destroy(placket.icon.public_id);

    // Delete placket document from MongoDB
    await PlacketModel.findByIdAndDelete(placketId);

    return {
      message:
        "Successfully deleted placket and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting placket.",
      success: false,
    };
  }
};

// Update the Placket's fields by its ID
export const updatePlacket = async (
  placketId: string,
  name: string,
  image: string,
  price: number,
  icon: string
) => {
  try {
    await connectToDatabase();

    const placket = await PlacketModel.findById(placketId);

    if (!placket) {
      return {
        message: "Placket not found with this Id!",
        success: false,
      };
    }

    if (name) {
      placket.name = name;
    }

    if (image) {
      // Upload new image if provided
      const imageBuffer = base64ToBuffer(image);
      const imageFormData = new FormData();
      imageFormData.append(
        "file",
        new Blob([imageBuffer], { type: "image/jpeg" })
      );
      imageFormData.append("upload_preset", "placket_images");

      const imageResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const uploadedImage = await imageResponse.json();
      placket.image = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    if (price !== undefined) {
      placket.price = price;
    }

    if (icon) {
      // Upload new icon if provided
      const iconBuffer = base64ToBuffer(icon);
      const iconFormData = new FormData();
      iconFormData.append(
        "file",
        new Blob([iconBuffer], { type: "image/jpeg" })
      );
      iconFormData.append("upload_preset", "placket_icons");

      const iconResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: iconFormData,
        }
      );

      const uploadedIcon = await iconResponse.json();
      placket.icon = {
        url: uploadedIcon.secure_url,
        public_id: uploadedIcon.public_id,
      };
    }

    await placket.save();

    return {
      message: "Placket has been updated successfully.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating placket.",
      success: false,
    };
  }
};

export const getPlacketsByColorAndFabric = async (fabricId: string, colorId: string) => {
  try {
    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    const plackets = await PlacketModel.find({ fabricId: fabricObjectId, colorId: colorObjectId })
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(plackets));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
