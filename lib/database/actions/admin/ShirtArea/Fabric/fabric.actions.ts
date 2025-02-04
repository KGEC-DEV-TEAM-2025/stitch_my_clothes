"use server";

import  connectToDatabase  from "@/lib/database/connect";
import FabricModel from "@/lib/database/models/shirtModel/FabricModel";
import cloudinary from "cloudinary";

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

// Create new Fabric entry
export const createFabric = async (
  fabricName: string,
  image: string // Base64 string for image upload
) => {
  try {
    await connectToDatabase();

    if (!fabricName || !image) {
      return {
        message: "Fabric name and image are required.",
        success: false,
      };
    }

    // Check if fabric already exists
    const existingFabric = await FabricModel.findOne({ fabricName });
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

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadedImage = await response.json();

    // Log full response for debugging
    // console.log("Cloudinary Response:", uploadedImage);

    // Ensure Cloudinary response contains both URL and public_id
    // if (!uploadedImage.secure_url || !uploadedImage.public_id) {
    //   throw new Error(
    //     `Image upload failed: Missing secure_url or public_id. Response: ${JSON.stringify(
    //       uploadedImage
    //     )}`
    //   );
    // }

    // Create a new fabric in the database
    const newFabric = new FabricModel({
      fabricName,
      image: {
        url: uploadedImage.secure_url, // Store Cloudinary image URL
        public_id: uploadedImage.public_id, // Store Cloudinary public_id
      },
    });

    await newFabric.save();

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
  try {
    await connectToDatabase();

    const fabric = await FabricModel.findById(fabricId);

    if (!fabric) {
      return {
        message: "Fabric not found with this Id!",
        success: false,
      };
    }

    // Delete image from Cloudinary
    const imagePublicId = fabric.image.public_id; // Get public_id directly from the fabric document
    await cloudinary.v2.uploader.destroy(imagePublicId);

    // Delete fabric document from MongoDB
    await FabricModel.findByIdAndDelete(fabricId);

    return {
      message:
        "Successfully deleted fabric and its associated image from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
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
  try {
    await connectToDatabase();

    const fabric = await FabricModel.findById(fabricId);

    if (!fabric) {
      return {
        message: "Fabric not found with this Id!",
        success: false,
      };
    }

    if (newFabricName) {
      fabric.fabricName = newFabricName;
    }

    if (newImage) {
      // Upload new image to Cloudinary
      const buffer = base64ToBuffer(newImage);
      const formData = new FormData();
      formData.append("file", new Blob([buffer], { type: "image/jpeg" }));
      formData.append("upload_preset", "fabric_images");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadedImage = await response.json();
      fabric.image = {
        url: uploadedImage.secure_url, // Update the image URL
        public_id: uploadedImage.public_id, // Update the public_id
      };
    }

    // Save the updated fabric
    await fabric.save();

    return {
      message: "Successfully updated the fabric!",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating fabric.",
      success: false,
    };
  }
};

export const getAllFabrics = async () => {
  try {
    await connectToDatabase();

    const fabrics = await FabricModel.find().sort({ updatedAt: -1 });

    return JSON.parse(JSON.stringify(fabrics));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
