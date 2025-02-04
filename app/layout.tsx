import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Preloader from "./components/Preloader";
import localFont from 'next/font/local'
import { Toaster } from "@/components/ui/sonner"

// In your layout
<Toaster />
import { ClerkProvider } from '@clerk/nextjs'

const play = localFont({
  src: [
    {
      path: './fonts/Play-Bold.ttf',
    },
    {
      path: './fonts/Play-Regular.ttf',
    },
  ],
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className={play.className}>
      <body
        className={`antialiased`} 
      >
        <Preloader /> 
        <Navbar />
        {children}
        <Toaster/>
      </body>
    </html>
    </ClerkProvider>
  );
}