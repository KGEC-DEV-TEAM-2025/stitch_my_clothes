"use server";

import { connectToDatabase } from "@/lib/database/connect";
import FabricModel from "@/lib/database/models/shirtModel/FabricModel";
import cloudinary from "cloudinary";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Helper function to convert base64 string to buffer
const base64ToBuffer = (base: any) => {
  const base64String = base.split(";base64,").pop();
  return Buffer.from(base64String, "base64");
};

// Create new Fabric entry
export const createFabric = async (
  fabricName: string,
  image: string // Base64 string for image upload
) => {
  console.log("createFabric called with:", { fabricName });
  try {
    await connectToDatabase();
    console.log("Connected to database");

    if (!fabricName || !image) {
      console.log("Fabric name or image is missing");
      return {
        message: "Fabric name and image are required.",
        success: false,
      };
    }

    // Check if fabric already exists
    const existingFabric = await FabricModel.findOne({ fabricName });
    console.log("Existing fabric check result:", existingFabric);
    if (existingFabric) {
      return {
        message: "Fabric with this name already exists.",
        success: false,
      };
    }

    // Upload image to Cloudinary
    const buffer = base64ToBuffer(image);
    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: "image/jpeg" }));
    formData.append("upload_preset", "fabric_images");

    console.log("Uploading image to Cloudinary...");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadedImage = await response.json();
    console.log("Cloudinary response:", uploadedImage);

    // Create a new fabric in the database
    const newFabric = new FabricModel({
      fabricName,
      image: {
        url: uploadedImage.secure_url, // Store Cloudinary image URL
        public_id: uploadedImage.public_id, // Store Cloudinary public_id
      },
    });

    await newFabric.save();
    console.log("New fabric saved:", newFabric);

    return {
      message: `Fabric ${fabricName} has been successfully created.`,
      success: true,
    };
  } catch (error: any) {
    console.log("Error creating fabric:", error);
    return {
      message: "Error creating fabric.",
      success: false,
    };
  }
};

// Delete Fabric entry and its image from Cloudinary
export const deleteFabric = async (fabricId: string) => {
  console.log("deleteFabric called with fabricId:", fabricId);
  try {
    await connectToDatabase();
    console.log("Connected to database");

    const fabric = await FabricModel.findById(fabricId);
    console.log("Fabric found:", fabric);

    if (!fabric) {
      return {
        message: "Fabric not found with this Id!",
        success: false,
      };
    }

    // Delete image from Cloudinary
    const imagePublicId = fabric.image.public_id;
    console.log("Deleting image from Cloudinary with public_id:", imagePublicId);
    await cloudinary.v2.uploader.destroy(imagePublicId);

    // Delete fabric document from MongoDB
    await FabricModel.findByIdAndDelete(fabricId);
    console.log("Fabric deleted from MongoDB");

    return {
      message:
        "Successfully deleted fabric and its associated image from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log("Error deleting fabric:", error);
    return {
      message: "Error deleting fabric.",
      success: false,
    };
  }
};

// Update the fabric's name or image by its ID
export const updateFabric = async (
  fabricId: string,
  newFabricName: string,
  newImage: string // Base64 string for image upload (if updated)
) => {
  console.log("updateFabric called with:", { fabricId, newFabricName, hasNewImage: !!newImage });
  try {
    await connectToDatabase();
    console.log("Connected to database");

    const fabric = await FabricModel.findById(fabricId);
    console.log("Existing fabric:", fabric);

    if (!fabric) {
      return {
        message: "Fabric not found with this Id!",
        success: false,
      };
    }

    if (newFabricName) {
      fabric.fabricName = newFabricName;
      console.log("Updated fabricName to:", newFabricName);
    }

    if (newImage) {
      // Upload new image to Cloudinary
      const buffer = base64ToBuffer(newImage);
      const formData = new FormData();
      formData.append("file", new Blob([buffer], { type: "image/jpeg" }));
      formData.append("upload_preset", "fabric_images");

      console.log("Uploading new image to Cloudinary...");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadedImage = await response.json();
      console.log("New Cloudinary response:", uploadedImage);
      fabric.image = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    // Save the updated fabric
    await fabric.save();
    console.log("Fabric updated and saved:", fabric);

    return {
      message: "Successfully updated the fabric!",
      success: true,
    };
  } catch (error: any) {
    console.log("Error updating fabric:", error);
    return {
      message: "Error updating fabric.",
      success: false,
    };
  }
};

export const getAllFabrics = async () => {
  console.log("getAllFabrics called");
  try {
    await connectToDatabase();
    console.log("Connected to database");

    const fabrics = await FabricModel.find().sort({ updatedAt: -1 });
    console.log("Fabrics retrieved:", fabrics);

    return JSON.parse(JSON.stringify(fabrics));
  } catch (error: any) {
    console.log("Error in getAllFabrics:", error);
    return [];
  }
};