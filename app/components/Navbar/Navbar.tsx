'use client'
import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import CartDrawer from '../cartDrawer/CartDrawer';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full bg-[#f5f5f0] shadow-md px-4 py-2 flex justify-between items-center fixed top-0 z-10"> 
      <div className="flex items-center">
        <Image src={'/logo.png'} alt='logo' width={80} height={80}  /> 
      </div>

     
      
     
      <div className="md:block hidden lg:flex items-center space-x-6 text-[#4a2b2b] font-medium"> 
        <Link href="/about">About</Link>
        <Link href="/history">History</Link>
        <Link href="/customise">Customise</Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-[#e8e6da] shadow-lg flex items-center justify-center">
            <ShoppingCart className="text-[#4a2b2b]" />
            <CartDrawer />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">1</span>
          </div>
        </div>
        <button className="bg-[#e8e6da] text-[#4a2b2b] px-4 py-1 rounded-sm shadow-lg">Login</button>
        <div className="md:hidden">
        <button onClick={toggleMobileMenu}>

          <Menu className="text-[#4a2b2b] h-8 w-8" />
        </button>
      </div>
      </div>
      

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#f5f5f0] shadow-md rounded-b-md z-10">
          <div className="flex flex-col text-[#4a2b2b] font-medium p-4 space-y-2">
            <Link href="/about" onClick={toggleMobileMenu}>About</Link>
            <Link href="/history" onClick={toggleMobileMenu}>History</Link>
            <Link href="/customise" onClick={toggleMobileMenu}>Customise</Link>
            
          </div>
        </div>
      )}
    </nav>
  );
}