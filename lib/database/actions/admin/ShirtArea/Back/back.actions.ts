"use server";

import connectToDatabase from "@/lib/database/connect";
import BackModel from "@/lib/database/models/shirtModel/BackModel";
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

export const createBack = async (
  name: string,
  image: string, // Base64 string for image upload
  icon: string, // Base64 string for icon upload
  price: number,
  fabricId: string, // Fabric ID as a string
  colorId: string // Fabric ID as a string
) => {
  try {
    await connectToDatabase();

    if (!name || !image || !icon || price === undefined || !fabricId) {
      return {
        message:
          "Name, image, icon, price, colorId, and fabricId are required.",
        success: false,
      };
    }

    // Check if back entry already exists
    const existingBack = await BackModel.findOne({ name });
    if (existingBack) {
      return {
        message: "Back with this name already exists.",
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
    imageFormData.append("upload_preset", "back_images");

    const iconFormData = new FormData();
    iconFormData.append("file", new Blob([iconBuffer], { type: "image/jpeg" }));
    iconFormData.append("upload_preset", "back_icons");

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

    // Create a new back entry in the database
    await new BackModel({
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
      message: `Back ${name} has been successfully created.`,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating back.",
      success: false,
    };
  }
};

// Delete Back entry and its images from Cloudinary
export const deleteBack = async (backId: string) => {
  try {
    await connectToDatabase();

    const back = await BackModel.findById(backId);

    if (!back) {
      return {
        message: "Back not found with this Id!",
        success: false,
      };
    }

    // Delete images from Cloudinary
    const imagePublicId = back.image.public_id;
    const iconPublicId = back.icon.public_id;
    await cloudinary.v2.uploader.destroy(imagePublicId);
    await cloudinary.v2.uploader.destroy(iconPublicId);

    // Delete back document from MongoDB
    await BackModel.findByIdAndDelete(backId);

    return {
      message:
        "Successfully deleted back and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting back.",
      success: false,
    };
  }
};

// Update the back's name, price, or images by its ID
export const updateBack = async (
  backId: string,
  newName: string,
  newImage: string, // Base64 string for image upload (if updated)
  newIcon: string, // Base64 string for icon upload (if updated)
  newPrice: number
) => {
  try {
    await connectToDatabase();

    const back = await BackModel.findById(backId);

    if (!back) {
      return {
        message: "Back not found with this Id!",
        success: false,
      };
    }

    if (newName) {
      back.name = newName;
    }

    if (newPrice !== undefined) {
      back.price = newPrice;
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
        imageFormData.append("upload_preset", "back_images");

        const imageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: imageFormData,
          }
        );

        const uploadedImage = await imageResponse.json();
        back.image = {
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
        iconFormData.append("upload_preset", "back_icons");

        const iconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: iconFormData,
          }
        );

        const uploadedIcon = await iconResponse.json();
        back.icon = {
          url: uploadedIcon.secure_url,
          public_id: uploadedIcon.public_id,
        };
      }
    }

    // Save the updated back
    await back.save();

    return {
      message: "Successfully updated the back!",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating back.",
      success: false,
    };
  }
};

export const getAllBacks = async () => {
  try {
    await connectToDatabase();

    const backs = await BackModel.find()
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(backs));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

export const getBacksByColorAndFabric = async (
  fabricId: string,
  colorId: string
) => {
  try {
    await connectToDatabase();

    const fabObjectId = new mongoose.Types.ObjectId(fabricId); // Convert string to ObjectId
    const colObjectId = new mongoose.Types.ObjectId(colorId); // Convert string to ObjectId

    const backs = await BackModel.find({
      fabricId: fabObjectId,
      colorId: colObjectId,
    })
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(backs));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
