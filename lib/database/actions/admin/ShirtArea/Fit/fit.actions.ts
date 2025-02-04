"use server";

import connectToDatabase from "@/lib/database/connect";
import FitModel from "@/lib/database/models/shirtModel/FitModel";
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

// Create new Fit entry
export const createFit = async (
  fitName: string,
  image: string, // Base64 string for image upload
  icon: string, // Base64 string for icon upload
  price: number,
  fabricId: string, // Fabric ID
  colorId: string // Fabric ID
) => {
  try {
    await connectToDatabase();

    if (!fitName || !image || !icon || !price || !fabricId) {
      return {
        message:
          "Fit name, image, icon, price, color ID, and fabric ID are required.",
        success: false,
      };
    }

    // Check if fit already exists
    const existingFit = await FitModel.findOne({ name: fitName });
    if (existingFit) {
      return {
        message: "Fit with this name already exists.",
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
    imageFormData.append("upload_preset", "fit_images");

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
    iconFormData.append("upload_preset", "fit_icons");

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

    // Create a new fit in the database
    await new FitModel({
      name: fitName,
      image: {
        url: uploadedImage.secure_url, // Store Cloudinary image URL
        public_id: uploadedImage.public_id, // Store Cloudinary public_id
      },
      icon: {
        url: uploadedIcon.secure_url, // Store Cloudinary icon URL
        public_id: uploadedIcon.public_id, // Store Cloudinary public_id
      },
      price,
      fabricId: fabricObjectId, // Store fabric ID
      colorId: colorObjectId, // Store fabric ID
    }).save();

    return {
      message: `Fit ${fitName} has been successfully created.`,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating fit.",
      success: false,
    };
  }
};

// Update the fit's name, image, or icon by its ID
export const updateFit = async (
  fitId: string,
  newFitName: string,
  newImage: string, // Base64 string for image upload (if updated)
  newIcon: string, // Base64 string for icon upload (if updated)
  newPrice: number
) => {
  try {
    await connectToDatabase();

    const fit = await FitModel.findById(fitId);

    if (!fit) {
      return {
        message: "Fit not found with this Id!",
        success: false,
      };
    }

    if (newFitName) {
      fit.name = newFitName;
    }

    if (newPrice) {
      fit.price = newPrice;
    }

    if (newImage || newIcon) {
      // Upload new image and/or icon to Cloudinary
      const bufferImage = newImage ? base64ToBuffer(newImage) : null;
      const bufferIcon = newIcon ? base64ToBuffer(newIcon) : null;

      let formDataImage = null;
      let formDataIcon = null;

      if (newImage) {
        formDataImage = new FormData();
        formDataImage.append(
          "file",
          new Blob([bufferImage!], { type: "image/jpeg" })
        );
        formDataImage.append("upload_preset", "fit_images");
      }

      if (newIcon) {
        formDataIcon = new FormData();
        formDataIcon.append(
          "file",
          new Blob([bufferIcon!], { type: "image/jpeg" })
        );
        formDataIcon.append("upload_preset", "fit_icons");
      }

      const [responseImage, responseIcon] = await Promise.all([
        formDataImage
          ? fetch(
              `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
              {
                method: "POST",
                body: formDataImage,
              }
            )
          : null,
        formDataIcon
          ? fetch(
              `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
              {
                method: "POST",
                body: formDataIcon,
              }
            )
          : null,
      ]);

      const uploadedImage = responseImage ? await responseImage.json() : null;
      const uploadedIcon = responseIcon ? await responseIcon.json() : null;

      if (uploadedImage) {
        fit.image = {
          url: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
        };
      }

      if (uploadedIcon) {
        fit.icon = {
          url: uploadedIcon.secure_url,
          public_id: uploadedIcon.public_id,
        };
      }
    }

    // Save the updated fit
    await fit.save();

    return {
      message: "Successfully updated the fit!",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating fit.",
      success: false,
    };
  }
};

export const getAllFits = async () => {
  try {
    await connectToDatabase();

    const fits = await FitModel.find().sort({ updatedAt: -1 }).lean();

    return JSON.parse(JSON.stringify(fits));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

export const deleteFit = async (fitId: string) => {
  try {
    await connectToDatabase();

    const fit = await FitModel.findById(fitId);

    if (!fit) {
      return {
        message: "Fit not found with this Id!",
        success: false,
      };
    }

    // Delete images from Cloudinary
    const imagePublicId = fit.image.public_id;
    const iconPublicId = fit.icon.public_id;
    await cloudinary.v2.uploader.destroy(imagePublicId);
    await cloudinary.v2.uploader.destroy(iconPublicId);

    // Delete fit document from MongoDB
    await FitModel.findByIdAndDelete(fitId);

    return {
      message:
        "Successfully deleted fit and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting fit.",
      success: false,
    };
  }
};

export const getFitsByColorAndFabric = async (fabricId: string, colorId: string) => {
  try {
    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId); // Convert string to ObjectId
    const colorObjectId = new mongoose.Types.ObjectId(colorId); // Convert string to ObjectId

    const fits = await FitModel.find({ fabricId: fabricObjectId, colorId: colorObjectId }) // Correct field name
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(fits));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
