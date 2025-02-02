"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

interface Product {
  name: string;
  description: string;
  price: number;
  imageSrc: string;
}

const products: Product[] = [
  {
    name: "Lightweight Summer Jacket",
    description: "Light and comfortable.",
    price: 69.99,
    imageSrc: "/g1.jpg",
  },
  {
    name: "Classic Blue Jeans",
    description: "Durable and stylish.",
    price: 49.99,
    imageSrc: "/g2.webp",
  },
  {
    name: "White Linen Shirt",
    description: "Breathable and elegant.",
    price: 39.99,
    imageSrc: "/g3.webp",
  },
  {
    name: "Hoodie",
    description: "Cozy and warm.",
    price: 79.99,
    imageSrc: "/g2.webp",
  },
  {
    name: "Another Jacket",
    description: "Stylish and warm.",
    price: 89.99,
    imageSrc: "/g3.webp",
  },
  {
    name: "Cargo Pants",
    description: "Practical and comfortable.",
    price: 59.99,
    imageSrc: "/g2.webp",
  },
  {
    name: "Dress Shirt",
    description: "Formal and elegant.",
    price: 49.99,
    imageSrc: "/g1.jpg",
  },
  {
    name: "Sweater",
    description: "Soft and warm.",
    price: 69.99,
    imageSrc: "/g2.webp",
  },
];

const Explore = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="p-4 bg-[#f5f5f0]">
      <h1 className="text-5xl font-bold my-10 text-center">
        Discover New Shirts
      </h1>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.name} className="p-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="relative h-96">
                <Image
                  src={product.imageSrc}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
               
                <h3 className="font-bold text-xl mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-base mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex flex-col items-start justify-center gap-y-2">
                  <p className="text-gray-800 font-bold text-lg">
                    ${product.price.toFixed(2)}
                  </p>
                  <button className="bg-black text-white font-bold py-2 px-4 rounded">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Explore;
