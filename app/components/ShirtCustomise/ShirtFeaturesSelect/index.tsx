"use client";
import useProductData from "@/hooks/shirt-details";
import { createShirt } from "@/lib/database/actions/admin/ShirtArea/Shirt/shirt.actions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const sections = [
  "bottom",
  "back",
  "placket",
  "pocket",
  "sleeves",
  "fit",
  "collarStyle",
  "collarHeight",
  "collarButton",
  "cuffStyle",
  "cuffLinks",
];

interface ProductItem {
  _id: string;
  name: string;
  icon?: { url: string };
  image?: { url: string };
  price?: number;
}

interface ProductData {
  bottom?: ProductItem[];
  back?: ProductItem[];
  placket?: ProductItem[];
  pocket?: ProductItem[];
  sleeves?: ProductItem[];
  fit?: ProductItem[];
  collarStyle?: ProductItem[];
  collarHeight?: {
    _id: string;
    name: string;
    icon: { url: string };
    price: number;
  }[];
  collarButton?: ProductItem[];
  cuffStyle?: ProductItem[];
  cuffLinks?: ProductItem[];
}
interface ShirtItem {
  name: string;
  image: string;
  price: number;
}

interface Shirt {
  bottom?: ShirtItem;
  back?: ShirtItem;
  placket?: ShirtItem;
  pocket?: ShirtItem;
  collarStyle?: ShirtItem;
  collarHeight?: ShirtItem;
  collarButton?: ShirtItem;
  cuffStyle?: ShirtItem;
  cuffLinks?: ShirtItem;
  fit?: ShirtItem;
  sleeves?: ShirtItem;
}

const ShirtCustomizer = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { data, loading } = useProductData() as {
    data: ProductData;
    loading: boolean;
  };
  const [activeSection, setActiveSection] = useState<keyof ProductData | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: ProductItem;
  }>({});
  const [watchCompatible, setWatchCompatible] = useState(false);
  const [isCollarOpen, setIsCollarOpen] = useState(true);
  const [isCuffOpen, setIsCuffOpen] = useState(true);
  const [longSleeveSelected, setLongSleeveSelected] = useState(false);
  const [isBackPopupOpen, setIsBackPopupOpen] = useState(false);
  const [selectedBackImage, setSelectedBackImage] = useState<string | null>(
    null
  );
  const [shirt, setShirt] = useState<Shirt>({});

  const handleCreateShirt = async () => {
    const price = totalPrice;
    try {
      const colorId = localStorage.getItem("colorId");
      const fabricId = localStorage.getItem("fabricId");

      if (!colorId || !fabricId) {
        toast.error("Color ID and Fabric ID are required.");
        return;
      }

      const response = await createShirt(
        price,
        shirt.bottom,
        shirt.back,
        shirt.sleeves,
        shirt.cuffStyle,
        shirt.cuffLinks,
        shirt.collarStyle,
        shirt.collarHeight,
        shirt.collarButton,
        shirt.placket,
        shirt.pocket,
        shirt.fit,
        watchCompatible,
        colorId,
        fabricId
      );

      if (response.success) {
        toast.success("Shirt created successfully!");
      } else {
        toast.error(response.message || "Failed to create the shirt.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  const assignItemToSection = (section: keyof Shirt, item: ProductItem) => {
    setShirt((prev) => {
      const updatedShirt = {
        ...prev,
        [section]: {
          name: item.name,
          image: item.image?.url,
          price: item.price,
        },
      };
      localStorage.setItem(section, JSON.stringify(item));
      return updatedShirt;
    });
  };

  const calculateTotalPrice = (items: Record<string, ProductItem>) => {
    return Object.values(items).reduce(
      (total, item) => total + (item.price || 0),
      0
    );
  };

  useEffect(() => {
    console.log(shirt);
  }, [shirt]);

  useEffect(() => {
    // Retrieve from localStorage if available and set default selections
    sections.forEach((section) => {
      if (section === "cuffStyle" || section === "cuffLinks") return;

      const savedItem = localStorage.getItem(section);
      if (savedItem) {
        const item = JSON.parse(savedItem);
        assignItemToSection(section as keyof Shirt, item); // Assign to the shirt object

        setSelectedItems((prev) => {
          const updatedItems = { ...prev, [section]: item };
          const newTotalPrice = calculateTotalPrice(updatedItems);
          setTotalPrice(newTotalPrice);
          return updatedItems;
        });
      } else if (data && data[section as keyof ProductData]?.length) {
        const defaultItem = data[section as keyof ProductData]![0];
        assignItemToSection(section as keyof Shirt, defaultItem); // Assign to the shirt object

        setSelectedItems((prev) => {
          const updatedItems = { ...prev, [section]: defaultItem };
          localStorage.setItem(section, JSON.stringify(defaultItem));
          const newTotalPrice = calculateTotalPrice(updatedItems);
          setTotalPrice(newTotalPrice);
          return updatedItems;
        });
      }
    });
  }, [data]);

  const handleSelect = (section: keyof ProductData, item: ProductItem) => {
    assignItemToSection(section as keyof Shirt, item); // Assign to the shirt object

    if (section === "sleeves" && item.name.toLowerCase().includes("long")) {
      setLongSleeveSelected(true);
    }

    if (section === "sleeves" && item.name.toLowerCase().includes("short")) {
      setLongSleeveSelected(false);
      setSelectedItems((prev) => {
        const updatedItems = { ...prev };
        delete updatedItems["cuffStyle"];
        delete updatedItems["cuffLinks"];
        return updatedItems;
      });

      localStorage.removeItem("cuffStyle");
      localStorage.removeItem("cuffLinks");
    }

    if (section === "back") {
      setIsBackPopupOpen(true);
      setSelectedBackImage(item.image?.url); // Adjust if item.image is not an object with 'url'

      setSelectedItems((prev) => {
        const updatedItems = { ...prev, [section]: item };
        localStorage.setItem(section, JSON.stringify(item));
        const newTotalPrice = calculateTotalPrice(updatedItems);
        setTotalPrice(newTotalPrice);
        return updatedItems;
      });
      return;
    }

    setSelectedItems((prev) => {
      const updatedItems = { ...prev, [section]: item };
      localStorage.setItem(section, JSON.stringify(item));
      const newTotalPrice = calculateTotalPrice(updatedItems);
      setTotalPrice(newTotalPrice);
      return updatedItems;
    });
  };

  const handleToggle = () => {
    setWatchCompatible((prev) => !prev);
  };

  const toggleCollarSection = () => {
    setIsCollarOpen((prev) => !prev);
  };

  const toggleCuffSection = () => {
    setIsCuffOpen((prev) => !prev);
  };

  const getZIndex = (section: string, index: number) => {
    if (section === "collarStyle") return 50;
    if (section === "collarButton") return 60;
    if (section === "cuffStyle") return 70;
    if (section === "cuffLinks") return 80;
    if (section === "placket" || section === "pocket") return 40;
    if (section === "sleeves") return 30;
    if (section === "fit") return 20;
    if (section === "bottom") return 20;
    return index;
  };

  const closeBackPopup = () => {
    setIsBackPopupOpen(false);
    setSelectedBackImage(null);
  };

  return (
    <div className="mt-[5rem] flex-row justify-between items-start flex w-full h-fit">
      <div className="relative flex justify-center items-center w-full h-[89vh]">
        {Object.entries(selectedItems).map(([section, item], index) =>
          item.image?.url ? (
            <img
              key={index}
              src={item.image.url}
              alt={item.name}
              className="absolute top-0 left-0 w-[40vw] h-auto object-cover rounded-none"
              style={{
                transform: "translate(-50%, -50%)",
                left: "50%",
                top: "50%",
                zIndex: getZIndex(section, index),
              }}
            />
          ) : null
        )}
      </div>

      <div className="fixed bottom-4 right-[20rem] bg-white p-4 shadow-lg rounded-lg flex items-center space-x-4">
        <div className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</div>
        <button
          onClick={handleCreateShirt}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>

      {/* Button to close the back popup */}
      {isBackPopupOpen && selectedBackImage && (
        <div className="w-fit h-fit fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-xl font-bold">Selected Back</h3>
            <img
              src={selectedBackImage}
              alt="Selected Back"
              className="w-[30rem] h-auto object-cover"
            />
            <button
              onClick={closeBackPopup}
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="p-[.5rem] mt-[1.5rem] w-[20%] bg-white h-full flex flex-col justify-start items-center">
        <h2 className="text-xl font-bold">Shirt Customizer</h2>
        <div className="flex flex-col justify-center w-full">
          {sections
            .filter(
              (section) =>
                ![
                  "collarStyle",
                  "collarHeight",
                  "collarButton",
                  "cuffStyle",
                  "cuffLinks",
                ].includes(section)
            )
            .map((section) => (
              <div
                key={section}
                className={`flex flex-col justify-center items-center w-full p-2 cursor-pointer rounded hover:bg-gray-200 ${
                  activeSection === section ? "bg-gray-300" : ""
                }`}
                onClick={() => setActiveSection(section as keyof ProductData)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </div>
            ))}

          {["collarStyle", "collarHeight", "collarButton"].some((section) =>
            sections.includes(section)
          ) && (
            <div>
              <h3
                className="text-md text-center font-bold mb-[.2rem] cursor-pointer"
                onClick={toggleCollarSection}
              >
                Collar {isCollarOpen ? "▲" : "▼"}
              </h3>
              {isCollarOpen && (
                <div>
                  {["collarStyle", "collarHeight", "collarButton"].map(
                    (section) =>
                      sections.includes(section) && (
                        <div
                          key={section}
                          className={`flex flex-col justify-center items-center w-full p-2 cursor-pointer rounded hover:bg-gray-200 ${
                            activeSection === section ? "bg-gray-300" : ""
                          }`}
                          onClick={() =>
                            setActiveSection(section as keyof ProductData)
                          }
                        >
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          )}

          {["cuffStyle", "cuffLinks"].some((section) =>
            sections.includes(section)
          ) && (
            <div className="mt-4">
              <h3
                className="text-center text-md font-bold mb-2 cursor-pointer"
                onClick={toggleCuffSection}
              >
                Cuff {isCuffOpen ? "▲" : "▼"}
              </h3>
              {isCuffOpen && longSleeveSelected && (
                <div>
                  {["cuffStyle", "cuffLinks"].map(
                    (section) =>
                      sections.includes(section) && (
                        <div
                          key={section}
                          className={`flex flex-col justify-center items-center w-full p-2 cursor-pointer rounded hover:bg-gray-200 ${
                            activeSection === section ? "bg-gray-300" : ""
                          }`}
                          onClick={() =>
                            setActiveSection(section as keyof ProductData)
                          }
                        >
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </div>
                      )
                  )}
                  <div className="flex items-center justify-center">
                    <span className="mr-2 text-lg">Watch Compatible:</span>
                    <button
                      onClick={handleToggle}
                      className={`py-2 px-4 rounded-full ${
                        watchCompatible ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {watchCompatible ? "Yes" : "No"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {activeSection && (
        <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg overflow-y-auto transition-transform transform translate-x-0 z-[100]">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold capitalize">{activeSection}</h3>
            <button
              onClick={() => setActiveSection(null)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="p-4">
            {data[activeSection]?.length === 0 ? (
              <p className="text-center text-gray-500">
                No items available in {activeSection}.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {data[activeSection]?.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelect(activeSection, item)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedItems[activeSection]?._id === item._id
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.icon?.url && (
                      <img
                        src={item.icon.url}
                        alt={item.name}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    )}
                    <p className="text-center">{item.name}</p>
                    <p className="text-center">{item.price}$</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShirtCustomizer;
