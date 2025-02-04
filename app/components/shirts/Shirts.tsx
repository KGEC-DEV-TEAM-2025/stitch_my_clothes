import Image from "next/image";

const Shirts = () => {
  const fabrics = [
    {
      src: "/archive/stylish-groom-getting-ready-in-morning-putting-on-2021-08-29-11-41-08-utc.JPG",
      alt: "Fabric 1",
    },
    {
      src: "/archive/stylish-groom-putting-on-shirt-with-cufflinks-and-2021-08-29-09-26-04-utc.JPG",
      alt: "Fabric 2",
    },
    {
      src: "/archive/portrait-of-a-man-in-shirt-2021-08-28-04-59-59-utc.jpg",
      alt: "Fabric 3",
    },
    {
      src: "/archive/relaxed-young-man-with-checkered-shirt-posing-2021-08-26-23-05-04-utc.jpg",
      alt: "Fabric 4",
    },
    {
      src: "/archive/row-of-hangers-with-shirts-in-a-store-2022-12-16-21-40-20-utc.jpg",
      alt: "Fabric 5",
    },
    {
      src: "/archive/shirts-2022-11-10-08-14-58-utc.jpg",
      alt: "Fabric 6",
    },
    {
      src: "/archive/shirt-hanging-on-rail-at-clothes-shop-2021-08-30-20-34-51-utc.jpg",
      alt: "Fabric 3",
    },
    {
      src: "/archive/stylish-groom-putting-on-shirt-with-cufflinks-and-2021-08-29-09-25-58-utc.JPG",
      alt: "Fabric 4",
    },
    {
      src: "/archive/groom-buttoning-cuffs-of-the-shirt-2023-03-02-19-26-01-utc.jpg",
      alt: "Fabric 5",
    },
    {
      src: "/archive/portrait-of-a-young-man-in-a-suit-and-with-a-bow-t-2022-11-12-08-15-04-utc.jpg",
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
