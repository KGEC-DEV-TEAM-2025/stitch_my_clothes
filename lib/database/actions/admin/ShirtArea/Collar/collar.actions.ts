"use server";

import connectToDatabase from "@/lib/database/connect";
import CollarModel from "@/lib/database/models/shirtModel/CollarModel";
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

// Create new Collar entry
export const createCollar = async (
  style: {
    name?: string;
    image?: string; // Base64 string for style image upload
    icon?: string; // Base64 string for style icon upload
    price?: number;
  },
  height: {
    name?: string;
    icon?: string; // Base64 string for height icon upload
    price?: number;
  },
  collarButton: {
    name?: string;
    image?: string; // Base64 string for button image upload
    icon?: string; // Base64 string for button icon upload
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
    let uploadedHeightIcon;
    let uploadedCollarButtonImage, uploadedCollarButtonIcon;

    // Optional validation for style, height, and collarButton
    if (
      style &&
      style.name &&
      style.name.trim() !== "" &&
      (style.price || style.price === 0)
    ) {
      if (style.image) {
        const styleImageBuffer = base64ToBuffer(style.image);
        const styleImageFormData = new FormData();
        styleImageFormData.append(
          "file",
          new Blob([styleImageBuffer], { type: "image/jpeg" })
        );
        styleImageFormData.append("upload_preset", "collar_style_images");

        const styleImageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: styleImageFormData }
        );
        uploadedStyleImage = await styleImageResponse.json();
      }

      if (style.icon) {
        const styleIconBuffer = base64ToBuffer(style.icon);
        const styleIconFormData = new FormData();
        styleIconFormData.append(
          "file",
          new Blob([styleIconBuffer], { type: "image/jpeg" })
        );
        styleIconFormData.append("upload_preset", "collar_style_icons");

        const styleIconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: styleIconFormData }
        );
        uploadedStyleIcon = await styleIconResponse.json();
      }
    }

    if (
      height &&
      height.name &&
      height.name.trim() !== "" &&
      (height.price || height.price === 0)
    ) {
      if (height.icon) {
        const heightIconBuffer = base64ToBuffer(height.icon);
        const heightIconFormData = new FormData();
        heightIconFormData.append(
          "file",
          new Blob([heightIconBuffer], { type: "image/jpeg" })
        );
        heightIconFormData.append("upload_preset", "collar_height_icons");

        const heightIconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: heightIconFormData }
        );
        uploadedHeightIcon = await heightIconResponse.json();
      }
    }

    if (
      collarButton &&
      collarButton.name &&
      collarButton.name.trim() !== "" &&
      (collarButton.price || collarButton.price === 0)
    ) {
      if (collarButton.image) {
        const collarButtonImageBuffer = base64ToBuffer(collarButton.image);
        const collarButtonImageFormData = new FormData();
        collarButtonImageFormData.append(
          "file",
          new Blob([collarButtonImageBuffer], { type: "image/jpeg" })
        );
        collarButtonImageFormData.append(
          "upload_preset",
          "collar_button_images"
        );

        const collarButtonImageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: collarButtonImageFormData }
        );
        uploadedCollarButtonImage = await collarButtonImageResponse.json();
      }

      if (collarButton.icon) {
        const collarButtonIconBuffer = base64ToBuffer(collarButton.icon);
        const collarButtonIconFormData = new FormData();
        collarButtonIconFormData.append(
          "file",
          new Blob([collarButtonIconBuffer], { type: "image/jpeg" })
        );
        collarButtonIconFormData.append("upload_preset", "collar_button_icons");

        const collarButtonIconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          { method: "POST", body: collarButtonIconFormData }
        );
        uploadedCollarButtonIcon = await collarButtonIconResponse.json();
      }
    }

    // Save the collar with the uploaded images and other data
    const collar = new CollarModel({
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
      height:
        height && height.name.trim() !== "" && height.price !== undefined
          ? {
              name: height.name,
              icon: height.icon
                ? {
                    url: uploadedHeightIcon?.secure_url,
                    public_id: uploadedHeightIcon?.public_id,
                  }
                : undefined,
              price: height.price,
            }
          : undefined,
      collar_button:
        collarButton &&
        collarButton.name.trim() !== "" &&
        collarButton.price !== undefined
          ? {
              name: collarButton.name,
              image: collarButton.image
                ? {
                    url: uploadedCollarButtonImage?.secure_url,
                    public_id: uploadedCollarButtonImage?.public_id,
                  }
                : undefined,
              icon: collarButton.icon
                ? {
                    url: uploadedCollarButtonIcon?.secure_url,
                    public_id: uploadedCollarButtonIcon?.public_id,
                  }
                : undefined,
              price: collarButton.price,
            }
          : undefined,
      fabricId: fabricObjectId, // Store the ObjectId for fabricId
      colorId: colorObjectId, // Store the ObjectId for fabricId
    });

    await collar.save();

    return {
      message: "Collar has been successfully created.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating collar.",
      success: false,
    };
  }
};

// Delete Collar entry and its images from Cloudinary
export const deleteCollar = async (collarId: string) => {
  try {
    await connectToDatabase();

    const collar = await CollarModel.findById(collarId);

    if (!collar) {
      return {
        message: "Collar not found with this Id!",
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
    await deleteImageIfExists(collar.style?.image?.public_id);
    await deleteImageIfExists(collar.style?.icon?.public_id);
    await deleteImageIfExists(collar.height?.icon?.public_id);
    await deleteImageIfExists(collar.collar_button?.image?.public_id);
    await deleteImageIfExists(collar.collar_button?.icon?.public_id);

    // Delete collar document from MongoDB
    await CollarModel.findByIdAndDelete(collarId);

    return {
      message:
        "Successfully deleted collar and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting collar.",
      success: false,
    };
  }
};

// Update Collar details (style, height, and collar button)
export const updateCollar = async (
  collarId: string,
  newStyle: {
    name: string;
    image: string; // Base64 string for style image upload (if updated)
    icon: string; // Base64 string for style icon upload (if updated)
    price: number;
  },
  newHeight: {
    name: string;
    icon: string; // Base64 string for height icon upload (if updated)
    price: number;
  },
  newCollarButton: {
    name: string;
    image: string; // Base64 string for button image upload (if updated)
    icon: string; // Base64 string for button icon upload (if updated)
    price: number;
  }
) => {
  try {
    await connectToDatabase();

    const collar = await CollarModel.findById(collarId);

    if (!collar) {
      return {
        message: "Collar not found with this Id!",
        success: false,
      };
    }

    // Update Style
    if (newStyle.name) {
      collar.style.name = newStyle.name;
    }

    if (newStyle.price !== undefined) {
      collar.style.price = newStyle.price;
    }

    if (newStyle.image || newStyle.icon) {
      // Upload new style image and icon to Cloudinary if updated
      if (newStyle.image) {
        const styleImageBuffer = base64ToBuffer(newStyle.image);
        const styleImageFormData = new FormData();
        styleImageFormData.append(
          "file",
          new Blob([styleImageBuffer], { type: "image/jpeg" })
        );
        styleImageFormData.append("upload_preset", "collar_style_images");

        const styleImageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: styleImageFormData,
          }
        );

        const uploadedStyleImage = await styleImageResponse.json();
        collar.style.image = {
          url: uploadedStyleImage.secure_url,
          public_id: uploadedStyleImage.public_id,
        };
      }

      if (newStyle.icon) {
        const styleIconBuffer = base64ToBuffer(newStyle.icon);
        const styleIconFormData = new FormData();
        styleIconFormData.append(
          "file",
          new Blob([styleIconBuffer], { type: "image/jpeg" })
        );
        styleIconFormData.append("upload_preset", "collar_style_icons");

        const styleIconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: styleIconFormData,
          }
        );

        const uploadedStyleIcon = await styleIconResponse.json();
        collar.style.icon = {
          url: uploadedStyleIcon.secure_url,
          public_id: uploadedStyleIcon.public_id,
        };
      }
    }

    // Update Height
    if (newHeight.name) {
      collar.height.name = newHeight.name;
    }

    if (newHeight.price !== undefined) {
      collar.height.price = newHeight.price;
    }

    if (newHeight.icon) {
      const heightIconBuffer = base64ToBuffer(newHeight.icon);
      const heightIconFormData = new FormData();
      heightIconFormData.append(
        "file",
        new Blob([heightIconBuffer], { type: "image/jpeg" })
      );
      heightIconFormData.append("upload_preset", "collar_height_icons");

      const heightIconResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: heightIconFormData,
        }
      );

      const uploadedHeightIcon = await heightIconResponse.json();
      collar.height.icon = {
        url: uploadedHeightIcon.secure_url,
        public_id: uploadedHeightIcon.public_id,
      };
    }

    // Update Collar Button
    if (newCollarButton.name) {
      collar.collar_button.name = newCollarButton.name;
    }

    if (newCollarButton.price !== undefined) {
      collar.collar_button.price = newCollarButton.price;
    }

    if (newCollarButton.image || newCollarButton.icon) {
      if (newCollarButton.image) {
        const collarButtonImageBuffer = base64ToBuffer(newCollarButton.image);
        const collarButtonImageFormData = new FormData();
        collarButtonImageFormData.append(
          "file",
          new Blob([collarButtonImageBuffer], { type: "image/jpeg" })
        );
        collarButtonImageFormData.append(
          "upload_preset",
          "collar_button_images"
        );

        const collarButtonImageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: collarButtonImageFormData,
          }
        );

        const uploadedCollarButtonImage =
          await collarButtonImageResponse.json();
        collar.collar_button.image = {
          url: uploadedCollarButtonImage.secure_url,
          public_id: uploadedCollarButtonImage.public_id,
        };
      }

      if (newCollarButton.icon) {
        const collarButtonIconBuffer = base64ToBuffer(newCollarButton.icon);
        const collarButtonIconFormData = new FormData();
        collarButtonIconFormData.append(
          "file",
          new Blob([collarButtonIconBuffer], { type: "image/jpeg" })
        );
        collarButtonIconFormData.append("upload_preset", "collar_button_icons");

        const collarButtonIconResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
          {
            method: "POST",
            body: collarButtonIconFormData,
          }
        );

        const uploadedCollarButtonIcon = await collarButtonIconResponse.json();
        collar.collar_button.icon = {
          url: uploadedCollarButtonIcon.secure_url,
          public_id: uploadedCollarButtonIcon.public_id,
        };
      }
    }

    await collar.save();

    return {
      message: "Collar successfully updated.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating collar.",
      success: false,
    };
  }
};

export const getAllCollars = async () => {
  try {
    await connectToDatabase();

    const collars = await CollarModel.find()
      .sort({ updatedAt: -1 }) // Sort by the latest updated entries
      .lean();

    return JSON.parse(JSON.stringify(collars));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

export const getCollarsByColorAndFabric = async (fabricId: string, colorId: string) => {
  try {
    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId); // Convert fabricId to ObjectId
    const colorObjectId = new mongoose.Types.ObjectId(colorId); // Convert fabricId to ObjectId

    const collars = await CollarModel.find({ fabricId: fabricObjectId, colorId: colorObjectId })
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(collars));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
