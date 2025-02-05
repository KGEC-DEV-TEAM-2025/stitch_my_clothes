import Image from "next/image";


const DiverseShirt = () => {
  const fabrics = [
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738749117/e430f03e-d3c2-41df-b52b-b450b54ab7ea.png",
      alt: "Fabric 1",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738749039/Screenshot_2025-02-05_151610_iweviv.png",
      alt: "Fabric 2",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738749051/Screenshot_2025-02-05_151356_o24zxe.png",
      alt: "Fabric 3",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738749038/Screenshot_2025-02-05_151459_y3696q.png",
      alt: "Fabric 4",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738749007/Screenshot_2025-02-05_151331_od6ig3.png",
      alt: "Fabric 5",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738748986/Screenshot_2025-02-05_151416_jimnh4.png",
      alt: "Fabric 6",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-5xl font-play text-[#646464] mb-10 text-center">
        New Fabrics
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 ">
        {fabrics.map((fabric, index) => (
          <div key={index} className="relative shadow-md shadow-black/30">
            
              <Image
                src={fabric.src}
                alt={fabric.alt}
                width={1200}
                height={1200}
                className="object-cover w-full h-[250px]"
              />
         
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiverseShirt;
