"use client";
import React, { useState, useEffect } from "react";
import { ShirtMeasurements, MeasurementField } from "@/app/utils/data/measurement";
import Image from "next/image";

interface ShirtMeasurementsFormProps {
  initialMeasurements?: ShirtMeasurements;
  onChange: (measurements: ShirtMeasurements) => void;
}

const createDefaultMeasurementField = (): MeasurementField => ({
  value: { value: null, unit: "inch" },  // Ensure this is structured as expected
  description: "",
});

const ShirtMeasurementsForm: React.FC<ShirtMeasurementsFormProps> = ({ initialMeasurements, onChange }) => {
  const initialShirtMeasurements = initialMeasurements || {
    collar: createDefaultMeasurementField(),
    halfChest: createDefaultMeasurementField(),
    halfWaist: createDefaultMeasurementField(),
    halfHips: createDefaultMeasurementField(),
    sleevesLength: createDefaultMeasurementField(),
    elbow: createDefaultMeasurementField(),
    forearm: createDefaultMeasurementField(),
    cuff: createDefaultMeasurementField(),
  };

  const imageMapping: { [key in keyof ShirtMeasurements]: string } = {
    collar: '/c1.webp',
    halfChest: '/c2.webp',
    halfWaist: '/c3.webp',
    halfHips: '/c4.webp',
    sleevesLength: '/c2.webp',
    elbow: '/c1.webp',
    forearm: '/c4.webp',
    cuff: '/c3.webp',
  };

  const descriptionMapping: { [key in keyof ShirtMeasurements]: string } = {
    collar: "Measure around the base of the neck where the collar sits.",
    halfChest: "Measure across the chest from armpit to armpit.",
    halfWaist: "Measure around the natural waist, which is usually the narrowest point of the torso.",
    halfHips: "Measure around the fullest part of the hips.",
    sleevesLength: "Measure from the shoulder seam to the desired cuff length.",
    elbow: "Measure around the elbow joint.",
    forearm: "Measure around the fullest part of the forearm.",
    cuff: "Measure around the wrist where the cuff will sit.",
  };

  const [shirtMeasurements, setShirtMeasurements] = useState(initialShirtMeasurements);
  const [activeField, setActiveField] = useState<keyof ShirtMeasurements>("collar");  // Default to 'collar'
  const [currentImage, setCurrentImage] = useState<string | null>(imageMapping.collar);
  const [currentDescription, setCurrentDescription] = useState<string | null>(descriptionMapping.collar);

  useEffect(() => {
    // Set initial image and description when the activeField changes
    setCurrentImage(imageMapping[activeField] || null);
    setCurrentDescription(descriptionMapping[activeField] || null);
  }, [activeField]);

  const handleChange = (typedField: keyof ShirtMeasurements, key: string, value: string) => {
    // Update only the relevant field
    const updatedMeasurements = {
      ...shirtMeasurements,
      [typedField]: {
        ...shirtMeasurements[typedField],
        value: {
          ...shirtMeasurements[typedField].value,
          [key]: value, // Update the 'value' or 'unit' depending on the key
        },
      },
    };

    setShirtMeasurements(updatedMeasurements);
    onChange(updatedMeasurements);  // Propagate the change
  };

  const renderMeasurementFields = () => {
    return Object.keys(shirtMeasurements).map((field) => {
      const typedField = field as keyof ShirtMeasurements;
      const measurementField = shirtMeasurements[typedField] as MeasurementField;

      return (
        <div key={field} className="space-y-2">
          <button
            onClick={() => setActiveField(typedField)}  // Change active field on button click
            className="block bg-[#f5f5f0] w-full text-black px-4 py-2 rounded-lg shadow-md border text-sm md:text-lg font-semibold"
          >
            {field.replace(/([A-Z])/g, " $1")}
          </button>

          {/* Show fields when they are active */}
          {activeField === typedField && (
            <div className="flex flex-col pb-6">
              <div className="flex items-center justify-between space-x-2">
                <input
                  type="number"
                  className="rounded-md sm:w-full w-2/3 shadow-sm sm:text-sm outline-none p-2"
                  placeholder="Enter Value"
                  value={measurementField?.value?.value ?? ""}  // Correctly reference 'value'
                  onChange={(e) => handleChange(typedField, "value", e.target.value)}  // Update 'value'
                />

                <select
                  className="outline-none p-2 w-1/3 rounded-md shadow-sm sm:text-sm"
                  value={measurementField?.value?.unit || "inch"}  // Correctly reference 'unit'
                  onChange={(e) => handleChange(typedField, "unit", e.target.value)}  // Update 'unit'
                >
                  <option value="inch" className="outline-none">inches</option>
                </select>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="rounded-lg p-8 space-y-14">
      <h2 className="text-4xl text-center font-bold">Shirt Measurements</h2>
      <div className="flex gap-x-10">
        <div className="flex flex-col sm:w-1/2 w-2/3 space-y-2">
          {renderMeasurementFields()}
        </div>
        <div className="sm:w-1/2 w-1/3 flex flex-col items-center space-y-10">
          <Image src={currentImage || imageMapping.collar} alt="" width={500} height={500} className="object-cover" />
          <p className="sm:max-w-lg w-full font-semibold sm:text-lg text-sm text-center">{currentDescription || descriptionMapping.collar}</p>
        </div>
      </div>
    </div>
  );
};

export default ShirtMeasurementsForm;
