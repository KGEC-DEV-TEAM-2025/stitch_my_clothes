import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  collarStyles,
  sleeveStyles,
  cuffStyles,
  pocketStyles,
  fitStyles,
  DD_Option,
  categories,
  ButtonStyles,
  BodyStyles,
} from "@/app/utils/data/data"; // Update import path
import Image from "next/image";
import { jsPDF } from "jspdf"; // Import jsPDF

const ShirtCustomizer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(1); // Default to id: 1
  const [selectedImages, setSelectedImages] = useState<{
    [key: string]: string;
  }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0); // State to track the total price

  useEffect(() => {
    // Automatically select id 1 for each category and set the images to overlap
    const images: { [key: string]: string } = {};
    let initialTotal = 0;
    categories.forEach((category) => {
      const categoryOptions = getCategoryOptions(category.name);
      const defaultOption = categoryOptions.find((option) => option.id === 1); // Default to option with id: 1
      if (defaultOption) {
        images[category.name] = defaultOption.imageUrl2; // Store imageUrl2 for each category
        initialTotal += defaultOption.price; // Add price for default option
      }
    });
    setSelectedImages(images);
    setTotalPrice(initialTotal); // Set initial total price based on selected default options
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleOptionSelect = (
    id: number,
    imageUrl2: string,
    categoryName: string,
    price: number
  ) => {
    setSelectedOption(id);
    setSelectedImages((prevState) => ({
      ...prevState,
      [categoryName]: imageUrl2, // Update the image for the selected category
    }));
    // Update total price
    setTotalPrice((prevState) => prevState + price);
  };

  const handleClosePopover = () => {
    setSelectedCategory(null);
  };

  const getCategoryOptions = (category: string) => {
    switch (category) {
      case "Collar":
        return collarStyles;
      case "Sleeves":
        return sleeveStyles;
      case "Cuff":
        return cuffStyles;
      case "Pocket":
        return pocketStyles;
      case "Fit":
        return fitStyles;
      case "Button":
        return ButtonStyles;
      case "Body":
        return BodyStyles;
      default:
        return [];
    }
  };

  // Handle the submit button (generate PDF receipt)
  const handleSubmit = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");

    // Title
    doc.setFontSize(18);
    doc.text("Shirt Customization Receipt", 20, 20);

    // Add categories and selected options
    let yPosition = 40;
    categories.forEach((category) => {
      const selectedCategoryOption = getCategoryOptions(category.name).find(
        (option) => option.id === selectedOption
      );
      if (selectedCategoryOption) {
        doc.setFontSize(12);
        doc.text(`${category.name}:`, 20, yPosition);
        doc.text(`  ${selectedCategoryOption.name}`, 30, yPosition + 10);
        doc.text(
          `  Price: $${selectedCategoryOption.price}`,
          30,
          yPosition + 20
        );
        yPosition += 40;
      }
    });

    // Add total price
    doc.setFontSize(14);
    doc.text(`Total Price: $${totalPrice}`, 20, yPosition);

    // Save the PDF
    doc.save("shirt-customization-receipt.pdf");
  };

  return (
    <div className="flex flex-col lg:flex-row pt-28">
      {/* Left section: All category imageUrl2 images overlapping */}
      <div className="lg:w-1/2 bg-gray-100 flex h-screen items-center justify-center relative mb-4 lg:mb-0">
        {/* All category imageUrl2 images overlap in the box */}
        {categories.map((category) => {
          const imageUrl2 = selectedImages[category.name]; // Get the image for this category
          return (
            <div
              key={category.name}
              className="absolute w-full h-full flex items-center justify-center"
            >
              {imageUrl2 && (
                <Image
                  src={imageUrl2}
                  alt={`${category.name} - Default Option`}
                  width={600}
                  height={100}
                  style={{ objectFit: "cover", opacity: 1 }} // Full opacity for the overlapping image
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Right section: Customize options */}
      <div className="lg:w-1/2 bg-white p-6  relative">
        <h1 className="text-2xl font-bold mb-4">Customize Your Shirt</h1>
        <div className="space-y-4">
          {categories.map((category) => (
            <button
              key={category.name}
              className="w-full py-4 px-6 border rounded-lg text-left shadow-sm hover:shadow-md"
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Popover for options */}
        {selectedCategory && (
          <div className="absolute top-0 right-0 w-full bg-white p-6 shadow-md z-10">
            <h2 className="text-xl font-semibold mb-4">
              {selectedCategory} Options
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {getCategoryOptions(selectedCategory).map((style: DD_Option) => (
                <div
                  key={style.id}
                  className={`border rounded py-8 cursor-pointer flex flex-col items-center justify-center gap-y-4 ${
                    selectedOption === style.id ? "border-black" : ""
                  }`}
                  onClick={() =>
                    handleOptionSelect(
                      style.id,
                      style.imageUrl2,
                      selectedCategory,
                      style.price
                    )
                  } // Passing price to the function
                >
                  <Image
                    src={style.imageUrl1}
                    alt={style.imageAlt1}
                    width={100}
                    height={100}
                  />
                  <p>{style.name}</p>
                  <p>${style.price}</p> {/* Display price */}
                </div>
              ))}
            </div>
            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded"
              onClick={handleClosePopover}
            >
              Close
            </button>
          </div>
        )}

        {/* Total Price Display */}
        <div className="fixed bottom-0 flex flex-col items-start p-8">
          <div className="mt-4 text-xl font-semibold">
            <p>Total Price: ${totalPrice}</p>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#c40600] text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Submit & Download the PDF
            </button>
          </div>
          <div className="mt-4 w-full">
            <Link href="/measurement">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                Next
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShirtCustomizer;
