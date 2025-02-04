"use server";

import connectToDatabase from "@/lib/database/connect";
import BottomModel from "@/lib/database/models/shirtModel/BottomModel";
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

export const createBottom = async (
  name: string,
  image: string, // Base64 string for image upload
  icon: string, // Base64 string for icon upload
  price: number,
  fabricId: string, // Fabric ID as a string
  colorId: string // Fabric ID as a string
) => {
  try {
    await connectToDatabase();

    if (
      !name ||
      !image ||
      !icon ||
      price === undefined ||
      !fabricId ||
      !colorId
    ) {
      return {
        message:
          "Name, image, icon, price, colorId, and fabricId are required.",
        success: false,
      };
    }

    // Check if bottom entry already exists
    const existingBottom = await BottomModel.findOne({ name });
    if (existingBottom) {
      return {
        message: "Bottom with this name already exists.",
        success: false,
      };
    }

    // Upload image to Cloudinary
    const imageBuffer = base64ToBuffer(image);
    const iconBuffer = base64ToBuffer(icon);

    const imageFormData = new FormData();
    imageFormData.append(
      "file",
      new Blob([imageBuffer], { type: "image/jpeg" })
    );
    imageFormData.append("upload_preset", "bottom_images");

    const iconFormData = new FormData();
    iconFormData.append("file", new Blob([iconBuffer], { type: "image/jpeg" }));
    iconFormData.append("upload_preset", "bottom_icons");

    const imageResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: imageFormData,
      }
    );

    const iconResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: iconFormData,
      }
    );

    const uploadedImage = await imageResponse.json();
    const uploadedIcon = await iconResponse.json();

    // Convert colorId and fabricId to ObjectIds
    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    // Create a new bottom entry in the database
    await new BottomModel({
      name,
      image: {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      },
      icon: {
        url: uploadedIcon.secure_url,
        public_id: uploadedIcon.public_id,
      },
      price,
      fabricId: fabricObjectId, // Store the ObjectId for fabricId
      colorId: colorObjectId, // Store the ObjectId for fabricId
    }).save();

    return {
      message: `Bottom ${name} has been successfully created.`,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating bottom.",
      success: false,
    };
  }
};

// Delete Bottom entry and its images from Cloudinary
export const deleteBottom = async (bottomId: string) => {
  try {
    await connectToDatabase();

    const bottom = await BottomModel.findById(bottomId);

    if (!bottom) {
      return {
        message: "Bottom not found with this Id!",
        success: false,
      };
    }

    // Delete images from Cloudinary
    const imagePublicId = bottom.image.public_id;
    const iconPublicId = bottom.icon.public_id;
    await cloudinary.v2.uploader.destroy(imagePublicId);
    await cloudinary.v2.uploader.destroy(iconPublicId);

    // Delete bottom document from MongoDB
    await BottomModel.findByIdAndDelete(bottomId);

    return {
      message:
        "Successfully deleted bottom and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting bottom.",
      success: false,
    };
  }
};

// Update the bottom's name, price, or images by its ID
export const updateBottom = async (
  bottomId: string,
  newName: string,
  newImage: string, // Base64 string for image upload (if updated)
  newIcon: string, // Base64 string for icon upload (if updated)
  newPrice: number
) => {
  try {
    await connectToDatabase();

    const bottom = await BottomModel.findById(bottomId);

    if (!bottom) {
      return {
        message: "Bottom not found with this Id!",
        success: false,
      };
    }

    if (newName) {
      bottom.name = newName;
    }

    if (newPrice !== undefined) {
      bottom.price = newPrice;
    }

    if (newImage || newIcon) {
      // Upload new image and icon to Cloudinary if updated
      if (newImage) {
        const imageBuffer = base64ToBuffer(newImage);
        const imageFormData = new FormData();
        imageFormData.append(
          "file",
          new Blob([imageBuffer], { type: "image/jpeg" })
        );
        imageFormData.append("upload_preset", "bottom_images");

        const imageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: imageFormData,
          }
        );

        const uploadedImage = await imageResponse.json();
        bottom.image = {
          url: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
        };
      }

      if (newIcon) {
        const iconBuffer = base64ToBuffer(newIcon);
        const iconFormData = new FormData();
        iconFormData.append(
          "file",
          new Blob([iconBuffer], { type: "image/jpeg" })
        );
        iconFormData.append("upload_preset", "bottom_icons");

        const iconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: iconFormData,
          }
        );

        const uploadedIcon = await iconResponse.json();
        bottom.icon = {
          url: uploadedIcon.secure_url,
          public_id: uploadedIcon.public_id,
        };
      }
    }

    // Save the updated bottom
    await bottom.save();

    return {
      message: "Successfully updated the bottom!",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating bottom.",
      success: false,
    };
  }
};

export const getAllBottoms = async () => {
  try {
    await connectToDatabase();

    const bottoms = await BottomModel.find()
      .sort({ updatedAt: -1 }) // Sort by latest updated
      .lean();

    return JSON.parse(JSON.stringify(bottoms));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
export const getBottomsByColorAndFabric = async (
  fabricId: string,
  colorId: string
) => {
  try {
    await connectToDatabase();

    const fabObjectId = new mongoose.Types.ObjectId(fabricId); // Convert string to ObjectId
    const colObjectId = new mongoose.Types.ObjectId(colorId); // Convert string to ObjectId

    const bottoms = await BottomModel.find({
      fabricId: fabObjectId,
      colorId: colObjectId,
    })
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(bottoms));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
