import Image from "next/image";

const Shirts = () => {
  const fabrics = [
    {
      src: "/g2.webp",
      alt: "Fabric 1",
    },
    {
      src: "/g3.webp",
      alt: "Fabric 2",
    },
    {
      src: "/g1.jpg",
      alt: "Fabric 3",
    },
    {
      src: "/g2.webp",
      alt: "Fabric 4",
    },
    {
      src: "/g3.webp",
      alt: "Fabric 5",
    },
    {
      src: "/g1.jpg",
      alt: "Fabric 6",
    },
    {
      src: "/g1.jpg",
      alt: "Fabric 3",
    },
    {
      src: "/g2.webp",
      alt: "Fabric 4",
    },
    {
      src: "/g3.webp",
      alt: "Fabric 5",
    },
    {
      src: "/g1.jpg",
      alt: "Fabric 6",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-5xl font-bold mb-10 text-center">
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
              className="object-cover w-full h-full"
            />
          </div>
        ))}
        
      </div>
      <div className="mt-12 mb-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            New Shirts available
          </h1>
          <p className="max-w-3xl text-gray-500 leading-relaxed mb-7">
            From selecting the perfect fabric to choosing unique patterns and colors, we provide a seamless
            experience for crafting your ideal shirt. Our commitment to quality
            and attention to detail ensures that each piece is tailored to
            perfection. Explore our user-friendly interface and start designing
            your custom shirt today. Experience the satisfaction of wearing a
            garment that is uniquely yours.{" "} 

          </p>
          <button className="bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300">
            Buy
          </button>
        </div>
    </div>
  );
};

export default Shirts;
