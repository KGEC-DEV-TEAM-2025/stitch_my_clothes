"use client";

import React, { useState } from "react";
import ShirtMeasurementsForm from "../components/shirtMeasurement/ShirtMeasurementsForm";
import BodyMeasurementsForm from "../components/bodyMeasurement/BodyMeasurementsForm";
import {
  Measurement,
  ShirtMeasurements,
  BodyMeasurements,
} from "@/app/utils/data/measurement"; // Import correct types
import { createMeasurement } from "@/lib/database/actions/measurement.actions";
import { toast } from "sonner";

const Page = () => {
  const [shirtMeasurements, setShirtMeasurements] = useState<ShirtMeasurements | undefined>(undefined);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShirtMeasurementsChange = (measurements: ShirtMeasurements) => {
    setShirtMeasurements(measurements);
    console.log("Shirt Measurements:", measurements);
  };

  const handleBodyMeasurementsChange = (measurements: BodyMeasurements) => {
    setBodyMeasurements(measurements);
    console.log("Body Measurements:", measurements);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that shirt measurements include required fields (collar and cuff)
    if (!shirtMeasurements || shirtMeasurements.collar === undefined || shirtMeasurements.cuff === undefined) {
      toast("Please fill in your shirt measurements, including both collar and cuff details.");
      return;
    }

    if (!bodyMeasurements) {
      toast("Please fill in your body measurements.");
      return;
    }

    const combinedMeasurements: Measurement = {
      shirt: shirtMeasurements,
      body: bodyMeasurements,
    };
    console.log("Combined Measurements:", combinedMeasurements);

    try {
      setIsSubmitting(true);
      const response = await createMeasurement(combinedMeasurements);
      if (response.success) {
        toast(response.message);
      }
    } catch (error: any) {
      toast(error.message || "Failed to create measurement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-28 px-4 py-2">
      <div>
        <ShirtMeasurementsForm onChange={handleShirtMeasurementsChange} />
      </div>
      <div>
        <BodyMeasurementsForm onChange={handleBodyMeasurementsChange} />
      </div>
      <div className="flex items-center justify-center">
        <button type="submit" disabled={isSubmitting} className="bg-[#c40600] px-4 py-2 text-white rounded-lg font-semibold">
          {isSubmitting ? "Saving..." : "Save Measurements"}
        </button>
      </div>
    </form>
  );
};

export default Page;