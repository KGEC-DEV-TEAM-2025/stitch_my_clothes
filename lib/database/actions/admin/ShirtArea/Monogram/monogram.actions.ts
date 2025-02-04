import connectToDatabase from "@/lib/database/connect";
import MonogramModel from "@/lib/database/models/shirtModel/MonogramModel";
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

// Create new Monogram entry
export const createMonogram = async (
  enabled: boolean,
  style: { name: string; image: string; price: number },
  position: { name: string; image: string; price: number },
  color: { name: string; image: string; price: number },
  block: string,
  script: { text: string; design: string },
  colorId: string, // Color ID
  fabricId: string // Fabric ID
) => {
  try {
    await connectToDatabase();

    // Upload style image
    const styleImageBuffer = base64ToBuffer(style.image);
    const styleFormData = new FormData();
    styleFormData.append(
      "file",
      new Blob([styleImageBuffer], { type: "image/jpeg" })
    );
    styleFormData.append("upload_preset", "monogram_images");

    const styleResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: styleFormData,
      }
    );
    const styleImage = await styleResponse.json();

    // Upload position image
    const positionImageBuffer = base64ToBuffer(position.image);
    const positionFormData = new FormData();
    positionFormData.append(
      "file",
      new Blob([positionImageBuffer], { type: "image/jpeg" })
    );
    positionFormData.append("upload_preset", "monogram_images");

    const positionResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: positionFormData,
      }
    );
    const positionImage = await positionResponse.json();

    // Upload color image
    const colorImageBuffer = base64ToBuffer(color.image);
    const colorFormData = new FormData();
    colorFormData.append(
      "file",
      new Blob([colorImageBuffer], { type: "image/jpeg" })
    );
    colorFormData.append("upload_preset", "monogram_images");

    const colorResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: colorFormData,
      }
    );
    const colorImage = await colorResponse.json();

    // Upload script design image
    const scriptImageBuffer = base64ToBuffer(script.design);
    const scriptFormData = new FormData();
    scriptFormData.append(
      "file",
      new Blob([scriptImageBuffer], { type: "image/jpeg" })
    );
    scriptFormData.append("upload_preset", "monogram_images");

    const scriptResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: scriptFormData,
      }
    );
    const scriptImage = await scriptResponse.json();

    // Create new monogram in the database
    await new MonogramModel({
      enabled,
      style: {
        name: style.name,
        image: {
          url: styleImage.secure_url,
          public_id: styleImage.public_id,
        },
        price: style.price,
      },
      position: {
        name: position.name,
        image: {
          url: positionImage.secure_url,
          public_id: positionImage.public_id,
        },
        price: position.price,
      },
      color: {
        name: color.name,
        image: {
          url: colorImage.secure_url,
          public_id: colorImage.public_id,
        },
        price: color.price,
      },
      block,
      script: {
        text: script.text,
        design: {
          url: scriptImage.secure_url,
          public_id: scriptImage.public_id,
        },
      },
      colorId, // Store color ID
      fabricId, // Store fabric ID
    }).save();

    return {
      message: `Monogram has been successfully created.`,
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating monogram.",
      success: false,
    };
  }
};

// Delete Monogram entry and its image from Cloudinary
export const deleteMonogram = async (monogramId: string) => {
  try {
    await connectToDatabase();

    const monogram = await MonogramModel.findById(monogramId);

    if (!monogram) {
      return {
        message: "Monogram not found with this Id!",
        success: false,
      };
    }

    // Delete images from Cloudinary
    await cloudinary.v2.uploader.destroy(monogram.style.image.public_id);
    await cloudinary.v2.uploader.destroy(monogram.position.image.public_id);
    await cloudinary.v2.uploader.destroy(monogram.color.image.public_id);
    await cloudinary.v2.uploader.destroy(monogram.script.design.public_id);

    // Delete monogram document from MongoDB
    await MonogramModel.findByIdAndDelete(monogramId);

    return {
      message:
        "Successfully deleted monogram and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting monogram.",
      success: false,
    };
  }
};

// Update the monogram's fields by its ID
export const updateMonogram = async (
  monogramId: string,
  enabled: boolean,
  style: { name: string; image: string; price: number },
  position: { name: string; image: string; price: number },
  color: { name: string; image: string; price: number },
  block: string,
  script: { text: string; design: string }
) => {
  try {
    await connectToDatabase();

    const monogram = await MonogramModel.findById(monogramId);

    if (!monogram) {
      return {
        message: "Monogram not found with this Id!",
        success: false,
      };
    }

    if (enabled !== undefined) {
      monogram.enabled = enabled;
    }

    if (style) {
      // Upload new style image if provided
      const styleImageBuffer = base64ToBuffer(style.image);
      const styleFormData = new FormData();
      styleFormData.append(
        "file",
        new Blob([styleImageBuffer], { type: "image/jpeg" })
      );
      styleFormData.append("upload_preset", "monogram_images");

      const styleResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: styleFormData,
        }
      );

      const styleImage = await styleResponse.json();
      monogram.style = {
        name: style.name,
        image: {
          url: styleImage.secure_url,
          public_id: styleImage.public_id,
        },
        price: style.price,
      };
    }

    if (position) {
      // Upload new position image if provided
      const positionImageBuffer = base64ToBuffer(position.image);
      const positionFormData = new FormData();
      positionFormData.append(
        "file",
        new Blob([positionImageBuffer], { type: "image/jpeg" })
      );
      positionFormData.append("upload_preset", "monogram_images");

      const positionResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: positionFormData,
        }
      );

      const positionImage = await positionResponse.json();
      monogram.position = {
        name: position.name,
        image: {
          url: positionImage.secure_url,
          public_id: positionImage.public_id,
        },
        price: position.price,
      };
    }

    if (color) {
      // Upload new color image if provided
      const colorImageBuffer = base64ToBuffer(color.image);
      const colorFormData = new FormData();
      colorFormData.append(
        "file",
        new Blob([colorImageBuffer], { type: "image/jpeg" })
      );
      colorFormData.append("upload_preset", "monogram_images");

      const colorResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: colorFormData,
        }
      );

      const colorImage = await colorResponse.json();
      monogram.color = {
        name: color.name,
        image: {
          url: colorImage.secure_url,
          public_id: colorImage.public_id,
        },
        price: color.price,
      };
    }

    if (block) {
      monogram.block = block;
    }

    if (script) {
      // Upload new script design image if provided
      const scriptImageBuffer = base64ToBuffer(script.design);
      const scriptFormData = new FormData();
      scriptFormData.append(
        "file",
        new Blob([scriptImageBuffer], { type: "image/jpeg" })
      );
      scriptFormData.append("upload_preset", "monogram_images");

      const scriptResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: scriptFormData,
        }
      );

      const scriptImage = await scriptResponse.json();
      monogram.script = {
        text: script.text,
        design: {
          url: scriptImage.secure_url,
          public_id: scriptImage.public_id,
        },
      };
    }

    await monogram.save();

    return {
      message: "Monogram has been updated successfully.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error updating monogram.",
      success: false,
    };
  }
};

export const getMonogramsByColorAndFabric = async (
  colorId: mongoose.Types.ObjectId,
  fabricId: mongoose.Types.ObjectId
) => {
  try {
    await connectToDatabase();

    const monograms = await MonogramModel.find({ colorId, fabricId })
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(monograms));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};
