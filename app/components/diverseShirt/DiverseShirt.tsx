
import Image from 'next/image'

const DiverseShirt = () => {
  const fabrics = [
    { 
      src: '/fab1.webp', 
      alt: 'Fabric 1',
      
    },
    { 
      src: '/fab3.webp', 
      alt: 'Fabric 2',
      
    },
    { 
      src: '/fab2.jpg', 
      alt: 'Fabric 3',
      
    },
    { 
      src: '/fab4.webp', 
      alt: 'Fabric 4',
      
    },
    { 
      src: '/fab5.webp', 
      alt: 'Fabric 5',
      
    },
    { 
      src: '/fab6.jpg', 
      alt: 'Fabric 6',
      
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4"> 
      <h1 className="text-5xl font-bold mb-10 text-center"> 
        New Fabrics
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 "> 
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
    </div>
  );
};

export default DiverseShirt;