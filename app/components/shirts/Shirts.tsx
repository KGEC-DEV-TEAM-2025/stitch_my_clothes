import Image from "next/image";

const Shirts = () => {
  const fabrics = [
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748665/d67b1100-0c6f-48d0-b633-9c448d8dc368.png",
      alt: "Fabric 1",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748985/Screenshot_2025-02-05_151644_tin9jw.png",
      alt: "Fabric 2",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748988/Screenshot_2025-02-05_151511_jdrysm.png",
      alt: "Fabric 3",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748949/Screenshot_2025-02-05_151631_nkr94u.png",
      alt: "Fabric 4",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748939/Screenshot_2025-02-05_151556_e5gu5z.png",
      alt: "Fabric 5",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738749051/Screenshot_2025-02-05_151356_o24zxe.png",
      alt: "Fabric 6",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738749007/Screenshot_2025-02-05_151331_od6ig3.png",
      alt: "Fabric 3",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748950/Screenshot_2025-02-05_151541_qbhw9z.png",
      alt: "Fabric 4",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738749039/Screenshot_2025-02-05_151610_iweviv.png",
      alt: "Fabric 5",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738749051/Screenshot_2025-02-05_151356_o24zxe.png",
      alt: "Fabric 6",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4" id="about">
      <h1 className="text-4xl text-[#646464] font-bold font-play mb-10 text-center">
        Discover New Shirts
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 ">
        {fabrics.map((fabric, index) => (
          <div key={index} className="relative shadow-md shadow-black/30">
            <Image
              src={fabric.src}
              alt={fabric.alt}
              width={500}
              height={500}
              className="object-cover w-full h-[250px]"
            />
          </div>
        ))}
        
      </div>
      <div className="mt-12 mb-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-[#646464] mb-4">
            New Shirts available
          </h1>
          <p className="max-w-5xl text-[#505050] text-lg leading-relaxed text-center mb-7">
            From selecting the perfect fabric to choosing unique patterns and colors, we provide a seamless
            experience for crafting your ideal shirt. Our commitment to quality
            and attention to detail ensures that each piece is tailored to
            perfection. Explore our user-friendly interface and start designing
            your custom shirt today. Experience the satisfaction of wearing a
            garment that is uniquely yours.{" "} 

          </p>
          <button className="bg-[#c40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300">
            Buy
          </button>
        </div>
    </div>
  );
};

export default Shirts;
