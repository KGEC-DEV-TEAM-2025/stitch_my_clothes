import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { href: "/shop", label: "Shop All" },
    { href: "/shirts", label: "Shirts" },
    { href: "/accessories", label: "Accessories" },
  ];

  const collectionLinks = [
    { href: "/casual", label: "Casual Collection" },
    { href: "/limited", label: "Limited Edition" },
  ];

  const exploreLinks = [
    { href: "/summer", label: "Summer Collection" },
    { href: "/formal", label: "Formal Wear" },
  ];

  return (
    <footer className="bg-[#f5f5f0] md:py-14 px-4 space-y-10">
 
        <div className="flex flex-col items-center justify-between lg:flex-row ">
          <div className="flex flex-row items-center space-x-20">
          <div>
            <h4 className="font-bold text-2xl mb-2">Shop</h4>
            <ul className="text-md text-gray-500">
              {shopLinks.map((link) => (
                <li key={link.href} className="">
                  <Link href={link.href}>
                    <p className="hover:underline">{link.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-2xl mb-2">Collections</h4>
            <ul className="text-md text-gray-500">
              {collectionLinks.map((link) => (
                <li key={link.href} className="mb-1">
                  <Link href={link.href}>
                    <p className="hover:underline">{link.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-2xl mb-2">Explore</h4>
            <ul className="text-md text-gray-500">
              {exploreLinks.map((link) => (
                <li key={link.href} className="mb-1">
                  <Link href={link.href}>
                    <p className="hover:underline">{link.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          </div>
          <div className="text-center md:text-left mb-4 md:mb-0 mt-10 lg:mt-0">
          <h4 className="font-bold text-2xl mb-2">
            Subscribe to Our Newsletter
          </h4>
          <p className="text-md text-gray-500 mb-2">
            Stay updated with the latest trends and exclusive offers from Stich
            My Clothes.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md px-3 py-2 text-md w-full md:w-auto" 
            />
            <button className="bg-black text-white px-4 rounded-md ml-2 hover:bg-gray-800 text-md">
              {" "}
          
              Subscribe
            </button>
            <div>
            <Image src={'/logo 40.png'} alt="logo-footer" width={150} height={150} className="ml-4"/>
            </div>
          </div>
        </div>
        </div>

        <hr className="border-t-1 border-black" />

        <div className="text-center">
          <p className="text-md text-gray-500">
            © {currentYear} Stich My Clothes. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 text-md text-gray-500 justify-center">
            <Link href="/terms">
              <p className="hover:underline">Terms and Conditions</p>
            </Link>
            <Link href="/privacy">
              <p className="hover:underline">Privacy Policy</p>
            </Link>
            <Link href="/refund">
              <p className="hover:underline">Refund and Return Policy</p>
            </Link>
            <Link href="/shipping">
              <p className="hover:underline">Shipping Policy</p>
            </Link>
          </div>
        </div>
    
    </footer>
  );
};

export default Footer;
