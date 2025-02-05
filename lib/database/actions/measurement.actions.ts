"use server"
import { connectToDatabase } from "../connect";
import MeasurementModel from "../models/ProductShirtModel/measurementshirt.model";
// import { createMeasurement } from "./measurement.actions"; // if needed, otherwise remove duplicate
import { addToCart } from "../actions/cart.actions"; // import addToCart from cart actions

export async function createMeasurement(measurements: any) {
  try {
    await connectToDatabase();
    console.log(measurements);
    
    const measurement = new MeasurementModel({
      collar : measurements.shirt.collar.value.value,
      cuff : measurements.shirt.cuff.value.value,
      elbow : measurements.shirt.elbow.value.value,
      forearm : measurements.shirt.forearm.value.value,
      halfChest : measurements.shirt.halfChest.value.value,
      halfHips : measurements.shirt.halfHips.value.value,
      halfWaist : measurements.shirt.halfWaist.value.value,
      sleevesLength : measurements.shirt.sleevesLength.value.value,
      chest: measurements.body.chest.value.value,
      elbowWidth: measurements.body.elbowWidth.value.value,
      hips : measurements.body.hips.value.value,
      neck : measurements.body.neck.value.value,
      shoulder : measurements.body.shoulder.value.value,
      upperArm : measurements.body.upperArm.value.value,
      waist : measurements.body.waist.value.value
    });
    await measurement.save();
    
    return {
      id: measurement._id,
      message: "Measurements created successfully",
      success: true
    };
  } catch (error: any) {
    console.error("Error creating measurement:", error);
    throw new Error(error.message || "Failed to create measurement");
  }
}

// New method: Once measurement is saved, add measurement and shirt details to the cart
export async function saveMeasurementAndAddToCart(data: any, clerkId: string) {
    try {
      // data is expected to have: data.measurements and data.shirt (shirt details to add to cart)
      const measurementResult = await createMeasurement(data.measurements);
      
      // Append measurement id to shirt details before adding to cart
      // This assumes that your shirt model or product sub-document can hold a measurementId property.
      data.shirt.measurementId = measurementResult.id;
      
      // Add shirt details to the cart
      const cartResult = await addToCart(data.shirt, clerkId);
      
      return {
        measurement: measurementResult,
        cart: cartResult
      };
    } catch (error: any) {
      console.error("Error saving measurement and updating cart:", error);
      throw new Error(error.message || "Failed to process measurement and cart update");
    }
  }
  