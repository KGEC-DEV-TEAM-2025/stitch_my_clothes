"use client";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import CartDrawer from "../cartDrawer/CartDrawer";
import AccountPopUp from "../accountPopUp/AccountPopUp";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const scrollToAbout = (event: React.MouseEvent) => { // Add event parameter
    event.preventDefault(); // Prevent default link behavior
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="w-full bg-[#f5f5f0] shadow-md px-4 py-2 flex justify-between items-center fixed top-0 z-10">
      <div className="flex items-center">
        <Image src={"/logo.png"} alt="logo" width={100} height={80} />
      </div>

      <div className="flex items-center space-x-4">
        <div className="md:block hidden lg:flex items-center justify-end space-x-6 text-[#4a2b2b] font-medium">
          <a href="#" onClick={scrollToAbout}>About</a> 
          <Link href="/history">History</Link>
          <Link href="/form">Customise</Link>
        </div>
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-[#e8e6da] shadow-lg flex items-center justify-center">
            <CartDrawer />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">1</span>
          </div>
        </div>
        <AccountPopUp />
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            <Menu className="text-[#4a2b2b] h-8 w-8" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#f5f5f0] shadow-md rounded-b-md z-10" ref={mobileMenuRef}>
          <div className="flex flex-col text-[#4a2b2b] font-medium p-4 space-y-2">
            <a href="#" onClick={scrollToAbout}> 
              About
            </a>
            <Link href="/history">History</Link> 
            <Link href="/form">Customise</Link>
          </div>
        </div>
      )}
    </nav>
  );
}