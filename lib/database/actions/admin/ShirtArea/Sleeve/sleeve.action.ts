"use server";
import  connectToDatabase  from "@/lib/database/connect";
import SleeveModel from "@/lib/database/models/shirtModel/SleeveModel";
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

// Create new Sleeves entry
export const createSleeves = async (
  name: string,
  image: string, // Base64 string for image upload
  icon: string, // Base64 string for icon upload
  price: number,
  fabricId: string, // Fabric ID associated with the sleeves
  colorId: string // Fabric ID associated with the sleeves
) => {
  try {
    await connectToDatabase();

    if (!name || !image || !icon || !price || !fabricId) {
      return {
        message:
          "Sleeves name, image, icon, price, color, and fabricId are required.",
        success: false,
      };
    }

    // Check if sleeves already exists
    const existingSleeves = await SleeveModel.findOne({ name: name });
    if (existingSleeves) {
      return {
        message: "Sleeves with this name already exists.",
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
    imageFormData.append("upload_preset", "sleeves_images");

    const imageResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: imageFormData,
      }
    );
    const uploadedImage = await imageResponse.json();

    // Upload icon to Cloudinary
    const iconBuffer = base64ToBuffer(icon);
    const iconFormData = new FormData();
    iconFormData.append("file", new Blob([iconBuffer], { type: "image/jpeg" }));
    iconFormData.append("upload_preset", "sleeves_icons");

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

    // Create a new sleeves entry in the database
    await new SleeveModel({
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
      fabricId: fabricObjectId,
      colorId: colorObjectId,
    }).save();

    return {
      message: `Sleeve has been successfully created.`,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating sleeves.",
      success: false,
    };
  }
};

// Delete Sleeves entry and its images from Cloudinary
export const deleteSleeves = async (sleevesId: string) => {
  try {
    await connectToDatabase();

    const sleeves = await SleeveModel.findById(sleevesId);

    if (!sleeves) {
      return {
        message: "Sleeves not found with this Id!",
        success: false,
      };
    }

    // Delete image and icon from Cloudinary
    const imagePublicId = sleeves.image.public_id;
    const iconPublicId = sleeves.icon.public_id;
    await cloudinary.v2.uploader.destroy(imagePublicId);
    await cloudinary.v2.uploader.destroy(iconPublicId);

    // Delete sleeves document from MongoDB
    await SleeveModel.findByIdAndDelete(sleevesId);

    return {
      message:
        "Successfully deleted sleeves and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting sleeves.",
      success: false,
    };
  }
};

// Update the sleeves' name, image, or icon by its ID
export const updateSleeves = async (
  sleevesId: string,
  newSleevesName: string,
  newImage: string, // Base64 string for image upload (if updated)
  newIcon: string, // Base64 string for icon upload (if updated)
  newPrice: number // Updated price
) => {
  try {
    await connectToDatabase();

    const sleeves = await SleeveModel.findById(sleevesId);

    if (!sleeves) {
      return {
        message: "Sleeves not found with this Id!",
        success: false,
      };
    }

    if (newSleevesName) {
      sleeves.name = newSleevesName;
    }

    if (newImage) {
      // Upload new image to Cloudinary
      const imageBuffer = base64ToBuffer(newImage);
      const imageFormData = new FormData();
      imageFormData.append(
        "file",
        new Blob([imageBuffer], { type: "image/jpeg" })
      );
      imageFormData.append("upload_preset", "sleeves_images");

      const imageResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: imageFormData,
        }
      );
      const uploadedImage = await imageResponse.json();
      sleeves.image = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    if (newIcon) {
      // Upload new icon to Cloudinary
      const iconBuffer = base64ToBuffer(newIcon);
      const iconFormData = new FormData();
      iconFormData.append(
        "file",
        new Blob([iconBuffer], { type: "image/jpeg" })
      );
      iconFormData.append("upload_preset", "sleeves_icons");

      const iconResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: iconFormData,
        }
      );
      const uploadedIcon = await iconResponse.json();
      sleeves.icon = {
        url: uploadedIcon.secure_url,
        public_id: uploadedIcon.public_id,
      };
    }

    if (newPrice) {
      sleeves.price = newPrice;
    }

    // Save the updated sleeves
    await sleeves.save();

    return {
      message: "Successfully updated the sleeves!",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating sleeves.",
      success: false,
    };
  }
};

// Get all Sleeves
export const getAllSleeves = async () => {
  try {
    await connectToDatabase();

    // Fetch all sleeves from the database
    const sleeves = await SleeveModel.find();

    if (sleeves.length === 0) {
      return {
        message: "No sleeves found.",
        success: false,
        data: [],
      };
    }

    return {
      message: "Successfully fetched all sleeves.",
      success: true,
      data: sleeves,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error fetching sleeves.",
      success: false,
      data: [],
    };
  }
};

export const getSleevesByColorAndFabric = async (fabricId: string, colorId: string) => {
  try {
    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    const sleeves = await SleeveModel.find({ fabricId: fabricObjectId, colorId: colorObjectId})
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(sleeves));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
