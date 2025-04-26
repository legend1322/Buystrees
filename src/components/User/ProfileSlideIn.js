

"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

const ProfileSlideIn = ({ user, isVisible, onClose }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      drawerRef.current?.focus();
    }
  }, [isVisible]);

  return (
    <div
      className={`fixed top-[99px] left-0 h-full w-80 max-w-full bg-white border-r border-green-400 shadow-xl transition-transform duration-500 z-50 
      ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      ref={drawerRef}
    >
      
      <div className="w-full  text-white rounded-bl-lg ">        
          <button
            className="absolute right-0 px-3 py-1  bg-green-400 border  hover:bg-green-600 text-white font-medium rounded-bl-lg"
            onClick={onClose}
          >
            X
          </button>
        </div>

      <div className="p-6 flex flex-col  justify-between">
        <div className="border-b-2 border-green-400 pb-4 mb-4">
          <h2 className="text-xl font-bold text-green-600 mb-4">Profile</h2>
          <p className="text-sm mb-1">
            <strong>Name:</strong> {user?.name || "Not provided"}
          </p>
          <p className="text-sm mb-1">
            <strong>Email:</strong> {user?.email || "Not provided"}
          </p>
          
          {/* Add additional fields here as needed */}
        </div>

        <div className="  w-full flex flex-col gap-4">    
          <div className=" bg-green-400 text-center rounded-lg py-1 hover:bg-green-600">
          <Link href="/Shop/orders" className="block  font-bold text-black  ">
            View Orders
          </Link>
          </div>
          <div className=" bg-green-400 text-center rounded-lg py-1 hover:bg-green-600">
          <Link href="/Seller/Register" className="block  font-bold text-black  ">
            Become a seller
          </Link>
          </div>
    
        </div>
 

      </div>
    </div>
  );
};

export default ProfileSlideIn;
