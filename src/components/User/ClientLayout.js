"use client";

import Header from "@/components/User/Header";
import Footer from "@/components/User/Footer";


export default function Layout({ children }) {
  
  return (
    <>
    
    <main className="scroll-smooth">
    <Header />
      {children}
      <Footer />
      </main>
  </>
  );
}
