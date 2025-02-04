"use server"

import {connectToDatabase} from "../connect";
import MeasurementModel from "../models/ProductShirtModel/measurementshirt.model";

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

export async function getMeasurementById(id: string) {
    try {
        await connectToDatabase();
        const measurement = await MeasurementModel.findById(id);
        if (!measurement) {
            throw new Error("Measurement not found");
        }
        return measurement;
    } catch (error: any) {
        console.error("Error fetching measurement:", error);
        throw new Error(error.message || "Failed to fetch measurement");
    }
}