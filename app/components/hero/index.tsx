import React from "react";
import { galleryImages } from "./data";
import Image from "next/image";
import Link from "next/link";
export default function Hero() {
  return (
    <div className="bg-[#f5f5f0]">
      <div className="w-full lg:h-[500px] flex lg:flex-row flex-col">
        {galleryImages.map((e) => (
          <Image
          src={e.src}
          key={e.id}
          alt={e.alt}
            className="w-full lg:w-1/3 h-full object-cover"
            width={1000}
            height={1000}
          />
        ))}
      </div>
      <div className="mt-10 mb-10 flex flex-col items-center justify-center">
        <div className="text-center md:max-w-5xl max-w-3xl space-y-8">
          <h1 className="text-4xl font-bold text-[#646464]">
            Craft Your Perfect shirt
          </h1>
          <p className="text-3xl text-[#505050] mb-8">Today</p>
          <p className="text-[#505050] text-lg leading-relaxed mb-7">
            Welcome to Stitch My Clothes, the ultimate destination for custom
            shirt enthusiasts! Our platform offers an extensive range of
            customization options, allowing you to create a shirt that truly
            represents your personal style and taste. From selecting the perfect
            fabric to choosing unique patterns and colors, we provide a seamless
            experience for crafting your ideal shirt. Our commitment to quality
            and attention to detail ensures that each piece is tailored to
            perfection. Explore our user-friendly interface and start designing
            your custom shirt today. Experience the satisfaction of wearing a
            garment that is uniquely yours.{" "}
          </p>
          <Link href={'/fabric-new'}>
          <button className="bg-[#C40600] mt-6 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300">
            
            Start Designing
           
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
