import React, { useState } from "react";
import { DD_Option } from "@/app/utils/data/Interface";
import Image from "next/image";

const collarStyles: DD_Option[] = [
  { name: "Spread Collar", id: 1 },
  { name: "Prince Charlie", id: 2 },
  { name: "Madmen", id: 3 },
  { name: "Bandhgala", id: 4 },
  { name: "Hipster", id: 5 },
  { name: "Bandhgala", id: 6 },
  { name: "Hipster", id: 7 },
];

const categories = ["Collar", "Sleeves", "Cuff", "Pocket", "Fit"];

const ShirtCustomizer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleOptionSelect = (id: number) => {
    setSelectedOption(id);
  };

  const handleClosePopover = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-1/2 bg-gray-100 flex items-center justify-center">
        <Image src={'/collar.jpg'} alt="collar" width={500} height={1000}/>
      </div>

      <div className="lg:w-1/2 bg-white p-6 relative">
        <h1 className="text-2xl font-bold mb-4">Customize Your Shirt</h1>
        <div className="space-y-4">
          {categories.map((category) => (
            <button
              key={category}
              className="w-full py-4 px-6 border rounded-lg text-left shadow-sm hover:shadow-md"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Popover */}
        {selectedCategory && (
          <div className="absolute top-0 right-0 w-full bg-white p-6 shadow-md z-10">
            <h2 className="text-xl font-semibold mb-4">{selectedCategory} Options</h2>
            {selectedCategory === "Collar" && (
              <div className="grid grid-cols-3 gap-2"> 
                {collarStyles.map((style) => (
                  <div 
                    key={style.id} 
                    className={`border rounded py-8 cursor-pointer flex flex-col items-center justify-center gap-y-4 ${selectedOption === style.id ? 'border-black' : ''}`}
                    onClick={() => handleOptionSelect(style.id)}
                  >
                    <Image src={'/collar.jpg'} alt={style.name} width={100} height={100}/>
                    <p>{style.name}</p>
                  </div>
                ))}
              </div>
            )}
            <button className="mt-4 bg-black text-white px-4 py-2 rounded" onClick={handleClosePopover}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShirtCustomizer;