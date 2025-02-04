// pages/index.tsx
"use client";

import React, { useState } from "react";
import ShirtMeasurementsForm from "../components/shirtMeasurement/ShirtMeasurementsForm";
import BodyMeasurementsForm from "../components/bodyMeasurement/BodyMeasurementsForm";
import {
  Measurement,
  ShirtMeasurements,
  BodyMeasurements,
} from "@/app/utils/data/measurement"; // Import correct types
import { createMeasurement} from "@/lib/database/actions/measurement.actions";
import { toast } from "sonner";

const Page = () => {
  const [shirtMeasurements, setShirtMeasurements] = useState<ShirtMeasurements | undefined>(undefined);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements | undefined>(undefined);
 

  const handleShirtMeasurementsChange = (measurements: ShirtMeasurements) => {
    setShirtMeasurements(measurements);
    console.log("Shirt Measurements:", measurements);
  };

  const handleBodyMeasurementsChange = (measurements: BodyMeasurements) => {
    setBodyMeasurements(measurements);
    console.log("Body Measurements:", measurements);
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const combinedMeasurements: Measurement = {
      shirt: shirtMeasurements,
      body: bodyMeasurements,
    };
    console.log("Combined Measurements:", combinedMeasurements);
    try{
      const response = await createMeasurement(combinedMeasurements);
      if(response.success){
        toast(response.message);
      }
    }catch(error:any){
      throw new Error(error.message || "Failed to create measurement");
    }
    
    
    // Here you would typically call your onSave function or API to save the data
    // onSave(combinedMeasurements);
  };

  return (
    <form onSubmit={handleSubmit} className="pt-28 px-4 py-2">
      <div>
        <ShirtMeasurementsForm 
          onChange={handleShirtMeasurementsChange} 
        />
      </div>
      
        <div>
          <BodyMeasurementsForm 
            onChange={handleBodyMeasurementsChange} 
          />
        </div>
      
      <div className="flex items-center justify-center">
      <button type="submit" className="bg-[#c40600] px-4 py-2 text-white rounded-lg font-semibold">Save Measurements</button>
      </div>
    </form>
  );
};

export default Page;