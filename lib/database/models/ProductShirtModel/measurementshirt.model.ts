import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for Measurement
export interface IMeasurement extends Document {
  collar: number;
  halfChest: number;
  halfWaist: number;
  halfHips: number;
  sleevesLength: number;
  elbow: number;
  forearm: number;
  cuff: number;
  neck: number;
  chest: number;
  waist: number;
  hips: number;
  elbowWidth: number;
  upperArm: number;
  shoulder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define Mongoose Schema
const MeasurementSchema: Schema = new Schema(
  {
    collar: { type: Number, required: true },
    halfChest: { type: Number, required: true },
    halfWaist: { type: Number, required: true },
    halfHips: { type: Number, required: true },
    sleevesLength: { type: Number, required: true },
    elbow: { type: Number, required: true },
    forearm: { type: Number, required: true },
    cuff: { type: Number, required: true },
    neck: { type: Number, required: true },
    chest: { type: Number, required: true },
    waist: { type: Number, required: true },
    hips: { type: Number, required: true },
    elbowWidth: { type: Number, required: true },
    upperArm: { type: Number, required: true },
    shoulder: { type: Number, required: true },
  },
  { timestamps: true }
);

// Define the Mongoose Model
const MeasurementModel: Model<IMeasurement> =
  mongoose.models.Measurement ||
  mongoose.model<IMeasurement>("Measurement", MeasurementSchema);

export default MeasurementModel;
