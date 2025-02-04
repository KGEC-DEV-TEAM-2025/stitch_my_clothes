"use client";
import React, { useState, useEffect } from "react";
import { BodyMeasurements, MeasurementField } from "@/app/utils/data/measurement";
import Image from "next/image";

interface BodyMeasurementsFormProps {
  initialMeasurements?: BodyMeasurements;
  onChange: (measurements: BodyMeasurements) => void;
}

const createDefaultMeasurementField = (): MeasurementField => ({
  value: { value: null, unit: "inch" }, // Ensure this is structured as expected
  description: "",
});

const BodyMeasurementsForm: React.FC<BodyMeasurementsFormProps> = ({ initialMeasurements, onChange }) => {
  const initialBodyMeasurements = initialMeasurements || {
    neck: createDefaultMeasurementField(),
    chest: createDefaultMeasurementField(),
    waist: createDefaultMeasurementField(),
    hips: createDefaultMeasurementField(),
    sleeveLength: createDefaultMeasurementField(),
    elbowWidth: createDefaultMeasurementField(),
    upperArm: createDefaultMeasurementField(),
    shoulder: createDefaultMeasurementField(),
  };

  const imageMapping: { [key in keyof BodyMeasurements]: string } = {
    neck: '/c1.webp',
    chest: '/c2.webp',
    waist: '/c3.webp',
    hips: '/c4.webp',
    sleeveLength: '/c2.webp',
    elbowWidth: '/c1.webp',
    upperArm: '/c4.webp',
    shoulder: '/c1.webp',
  };

  const descriptionMapping: { [key in keyof BodyMeasurements]: string } = {
    neck: "Measure around the base of the neck where the neck sits.",
    chest: "Measure across the chest from armpit to armpit.",
    waist: "Measure around the natural waist, which is usually the narrowest point of the torso.",
    hips: "Measure around the fullest part of the hips.",
    sleeveLength: "Measure from the shoulder seam to the desired cuff length.",
    elbowWidth: "Measure around the elbow joint.",
    upperArm: "Measure around the fullest part of the forearm.",
    shoulder: "Measure from the lower left corner of the shoulder"
  };

  const [BodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements>(initialBodyMeasurements);
  const [activeField, setActiveField] = useState<keyof BodyMeasurements>("neck"); // Default to 'neck'
  const [currentImage, setCurrentImage] = useState<string | null>(imageMapping.neck);
  const [currentDescription, setCurrentDescription] = useState<string | null>(descriptionMapping.neck);

  // Update image and description when activeField changes
  useEffect(() => {
    if (activeField) {
      setCurrentImage(imageMapping[activeField] || null);
      setCurrentDescription(descriptionMapping[activeField] || null);
    }
  }, [activeField]);

  const handleChange = (typedField: keyof BodyMeasurements, key: string, value: string) => {
    // Update only the relevant field
    const updatedMeasurements = {
      ...BodyMeasurements,
      [typedField]: {
        ...BodyMeasurements[typedField],
        value: {
          ...BodyMeasurements[typedField].value,
          [key]: value, // Update the 'value' or 'unit' depending on the key
        },
      },
    };

    setBodyMeasurements(updatedMeasurements);
    onChange(updatedMeasurements);  // Propagate the change
  };

  const renderMeasurementFields = () => {
    return Object.keys(BodyMeasurements).map((field) => {
      const typedField = field as keyof BodyMeasurements;
      const measurementField = BodyMeasurements[typedField] as MeasurementField;

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
        <div className="flex flex-col w-1/2 space-y-2">
          {renderMeasurementFields()}
        </div>
        <div className="sm:w-1/2 w-1/3 flex flex-col items-center space-y-10">
          <Image src={currentImage || imageMapping.neck} alt="" width={500} height={500} className="object-cover" />
          <p className="sm:max-w-lg w-full font-semibold sm:text-lg text-sm text-center">{currentDescription || descriptionMapping.neck}</p>
        </div>
      </div>
    </div>
  );
};

export default BodyMeasurementsForm;
