"use client";

import React, { useState } from "react";
import ShirtMeasurementsForm from "../components/shirtMeasurement/ShirtMeasurementsForm";
import BodyMeasurementsForm from "../components/bodyMeasurement/BodyMeasurementsForm";
import { Measurement, ShirtMeasurements, BodyMeasurements } from "@/app/utils/data/measurement";
import { createMeasurement } from "@/lib/database/actions/measurement.actions";
import { toast } from "sonner";

const Page = () => {
  const [shirtMeasurements, setShirtMeasurements] = useState<ShirtMeasurements | undefined>(undefined);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShirtMeasurementsChange = (measurements: ShirtMeasurements) => {
    setShirtMeasurements(measurements);
  };

  const handleBodyMeasurementsChange = (measurements: BodyMeasurements) => {
    setBodyMeasurements(measurements);
  };

  const handleSave = async () => {
    // Validate measurements
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
    <div className="pt-28 px-4 py-2">
      <ShirtMeasurementsForm onChange={handleShirtMeasurementsChange} />
      <BodyMeasurementsForm onChange={handleBodyMeasurementsChange} />
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-[#c40600] px-4 py-2 text-white rounded-lg font-semibold"
        >
          {isSubmitting ? "Saving..." : "Save Measurements"}
        </button>
      </div>
    </div>
  );
};

export default Page;