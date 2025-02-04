"use server";

import connectToDatabase from "@/lib/database/connect";
import CuffModel from "@/lib/database/models/shirtModel/CuffModel";
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

// Create a new Cuff entry
export const createCuff = async (
  style: {
    name?: string;
    image?: string; // Base64 string for style image upload
    icon?: string; // Base64 string for style icon upload
    price?: number;
  },
  cufflinks: {
    name?: string;
    image?: string; // Base64 string for cufflink image upload
    icon?: string; // Base64 string for cufflink icon upload
    price?: number;
  },
  fabricId: string, // Fabric ID as a string
  colorId: string // Fabric ID as a string
) => {
  try {
    await connectToDatabase();

    // Validate required fields
    if (!fabricId) {
      return {
        message: "Fabric ID is required.",
        success: false,
      };
    }

    // Convert fabricId to ObjectId
    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    // Initialize variables to hold the uploaded image data
    let uploadedStyleImage, uploadedStyleIcon;
    let uploadedCufflinkImage, uploadedCufflinkIcon;

    // Optional validation for style
    if (
      style &&
      style.name &&
      style.name.trim() !== "" &&
      (style.price || style.price === 0)
    ) {
      if (style.image) {
        const styleImageBuffer = base64ToBuffer(style.image);
        const styleImageFormData = new FormData();
        styleImageFormData.append("file", new Blob([styleImageBuffer], { type: "image/jpeg" }));
        styleImageFormData.append("upload_preset", "cuff_style_images");

        const styleImageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: styleImageFormData }
        );
        uploadedStyleImage = await styleImageResponse.json();
      }

      if (style.icon) {
        const styleIconBuffer = base64ToBuffer(style.icon);
        const styleIconFormData = new FormData();
        styleIconFormData.append("file", new Blob([styleIconBuffer], { type: "image/jpeg" }));
        styleIconFormData.append("upload_preset", "cuff_style_icons");

        const styleIconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: styleIconFormData }
        );
        uploadedStyleIcon = await styleIconResponse.json();
      }
    }

    // Optional validation for cufflinks
    if (
      cufflinks &&
      cufflinks.name &&
      cufflinks.name.trim() !== "" &&
      (cufflinks.price || cufflinks.price === 0)
    ) {
      if (cufflinks.image) {
        const cufflinkImageBuffer = base64ToBuffer(cufflinks.image);
        const cufflinkImageFormData = new FormData();
        cufflinkImageFormData.append("file", new Blob([cufflinkImageBuffer], { type: "image/jpeg" }));
        cufflinkImageFormData.append("upload_preset", "cufflink_images");

        const cufflinkImageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: cufflinkImageFormData }
        );
        uploadedCufflinkImage = await cufflinkImageResponse.json();
      }

      if (cufflinks.icon) {
        const cufflinkIconBuffer = base64ToBuffer(cufflinks.icon);
        const cufflinkIconFormData = new FormData();
        cufflinkIconFormData.append("file", new Blob([cufflinkIconBuffer], { type: "image/jpeg" }));
        cufflinkIconFormData.append("upload_preset", "cufflink_icons");

        const cufflinkIconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: cufflinkIconFormData }
        );
        uploadedCufflinkIcon = await cufflinkIconResponse.json();
      }
    }

    // Save the cuff with the uploaded images and other data
    const cuff = new CuffModel({
      style:
        style && style.name.trim() !== "" && style.price !== undefined
          ? {
              name: style.name,
              image: style.image
                ? {
                    url: uploadedStyleImage?.secure_url,
                    public_id: uploadedStyleImage?.public_id,
                  }
                : undefined,
              icon: style.icon
                ? {
                    url: uploadedStyleIcon?.secure_url,
                    public_id: uploadedStyleIcon?.public_id,
                  }
                : undefined,
              price: style.price,
            }
          : undefined,
      cufflinks:
        cufflinks && cufflinks.name.trim() !== "" && cufflinks.price !== undefined
          ? {
              name: cufflinks.name,
              image: cufflinks.image
                ? {
                    url: uploadedCufflinkImage?.secure_url,
                    public_id: uploadedCufflinkImage?.public_id,
                  }
                : undefined,
              icon: cufflinks.icon
                ? {
                    url: uploadedCufflinkIcon?.secure_url,
                    public_id: uploadedCufflinkIcon?.public_id,
                  }
                : undefined,
              price: cufflinks.price,
            }
          : undefined,
      fabricId: fabricObjectId, // Store the ObjectId for fabricId
      colorId: colorObjectId, // Store the ObjectId for fabricId
    });

    await cuff.save();

    return {
      message: "Cuff has been successfully created.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating cuff.",
      success: false,
    };
  }
};


// Delete Cuff entry and its images from Cloudinary
export const deleteCuff = async (cuffId: string) => {
  try {
    await connectToDatabase();

    const cuff = await CuffModel.findById(cuffId);

    if (!cuff) {
      return {
        message: "Cuff not found with this Id!",
        success: false,
      };
    }

    // Helper function to delete image if it exists
    const deleteImageIfExists = async (publicId: string | undefined) => {
      if (publicId) {
        await cloudinary.v2.uploader.destroy(publicId);
      }
    };

    // Conditionally delete images from Cloudinary if they exist
    await deleteImageIfExists(cuff.style?.image?.public_id);
    await deleteImageIfExists(cuff.style?.icon?.public_id);
    await deleteImageIfExists(cuff.cufflinks?.image?.public_id);
    await deleteImageIfExists(cuff.cufflinks?.icon?.public_id);

    // Delete cuff document from MongoDB
    await CuffModel.findByIdAndDelete(cuffId);

    return {
      message:
        "Successfully deleted cuff and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting cuff.",
      success: false,
    };
  }
};

// Update Cuff entry (name, price, and images)
export const updateCuff = async (
  cuffId: string,
  newStyleName: string,
  newStyleImage: string, // Base64 string for style image upload (if updated)
  newStyleIcon: string, // Base64 string for style icon upload (if updated)
  newStylePrice: number,
  newCufflinkName: string,
  newCufflinkImage: string, // Base64 string for cufflink image upload (if updated)
  newCufflinkIcon: string, // Base64 string for cufflink icon upload (if updated)
  newCufflinkPrice: number,
  newWatchName: string,
  newWatchPrice: number
) => {
  try {
    await connectToDatabase();

    const cuff = await CuffModel.findById(cuffId);

    if (!cuff) {
      return {
        message: "Cuff not found with this Id!",
        success: false,
      };
    }

    // Update style if required
    if (newStyleName) {
      cuff.style.name = newStyleName;
    }
    if (newStylePrice !== undefined) {
      cuff.style.price = newStylePrice;
    }

    if (newCufflinkName) {
      cuff.cufflinks.name = newCufflinkName;
    }
    if (newCufflinkPrice !== undefined) {
      cuff.cufflinks.price = newCufflinkPrice;
    }

    if (newWatchName) {
      cuff.watch_compatible.name = newWatchName;
    }
    if (newWatchPrice !== undefined) {
      cuff.watch_compatible.price = newWatchPrice;
    }

    // Upload new style image and icon to Cloudinary if updated
    if (newStyleImage || newStyleIcon) {
      if (newStyleImage) {
        const styleImageBuffer = base64ToBuffer(newStyleImage);
        const styleImageFormData = new FormData();
        styleImageFormData.append(
          "file",
          new Blob([styleImageBuffer], { type: "image/jpeg" })
        );
        styleImageFormData.append("upload_preset", "style_images");

        const styleImageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: styleImageFormData }
        );
        const uploadedStyleImage = await styleImageResponse.json();
        cuff.style.image = {
          url: uploadedStyleImage.secure_url,
          public_id: uploadedStyleImage.public_id,
        };
      }

      if (newStyleIcon) {
        const styleIconBuffer = base64ToBuffer(newStyleIcon);
        const styleIconFormData = new FormData();
        styleIconFormData.append(
          "file",
          new Blob([styleIconBuffer], { type: "image/jpeg" })
        );
        styleIconFormData.append("upload_preset", "style_icons");

        const styleIconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: styleIconFormData }
        );
        const uploadedStyleIcon = await styleIconResponse.json();
        cuff.style.icon = {
          url: uploadedStyleIcon.secure_url,
          public_id: uploadedStyleIcon.public_id,
        };
      }
    }

    // Upload new cufflink image and icon to Cloudinary if updated
    if (newCufflinkImage || newCufflinkIcon) {
      if (newCufflinkImage) {
        const cufflinkImageBuffer = base64ToBuffer(newCufflinkImage);
        const cufflinkImageFormData = new FormData();
        cufflinkImageFormData.append(
          "file",
          new Blob([cufflinkImageBuffer], { type: "image/jpeg" })
        );
        cufflinkImageFormData.append("upload_preset", "cufflink_images");

        const cufflinkImageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: cufflinkImageFormData }
        );
        const uploadedCufflinkImage = await cufflinkImageResponse.json();
        cuff.cufflinks.image = {
          url: uploadedCufflinkImage.secure_url,
          public_id: uploadedCufflinkImage.public_id,
        };
      }

      if (newCufflinkIcon) {
        const cufflinkIconBuffer = base64ToBuffer(newCufflinkIcon);
        const cufflinkIconFormData = new FormData();
        cufflinkIconFormData.append(
          "file",
          new Blob([cufflinkIconBuffer], { type: "image/jpeg" })
        );
        cufflinkIconFormData.append("upload_preset", "cufflink_icons");

        const cufflinkIconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: cufflinkIconFormData }
        );
        const uploadedCufflinkIcon = await cufflinkIconResponse.json();
        cuff.cufflinks.icon = {
          url: uploadedCufflinkIcon.secure_url,
          public_id: uploadedCufflinkIcon.public_id,
        };
      }
    }

    // Save the updated cuff
    await cuff.save();

    return {
      message: "Successfully updated the cuff!",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating cuff.",
      success: false,
    };
  }
};

export const fetchAllCuffs = async () => {
  try {
    const cuffs = await CuffModel.find();
    return cuffs;
  } catch (error: any) {
    console.log("Error fetching cuffs:", error);
    return {
      success: false,
      message: error.message || "An error occurred while fetching cuffs.",
    };
  }
};

export const getCuffsByColorAndFabric = async (fabricId: string, colorId: string) => {
  try {
    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    const cuffs = await CuffModel.find({ fabricId: fabricObjectId, colorId: colorObjectId  })
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(cuffs));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
