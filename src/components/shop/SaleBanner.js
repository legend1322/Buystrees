"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

const SaleBanner = () => {
  return (
    <motion.div
      className="relative bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white overflow-hidden rounded-2xl shadow-lg p-8 sm:p-12"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left Section: Text */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            🚀 Big Sale! Up to 70% Off 🎉
          </h1>
          <p className="text-lg sm:text-xl">
            Grab your favorites at unbelievable prices. Limited time offer!
          </p>
          <div>
            <Button className="bg-black hover:bg-opacity-80 text-white py-3 px-6 text-lg rounded-xl shadow-md">
              Shop Now
            </Button>
          </div>
        </div>

        {/* Right Section: Image/Graphics */}
        <div className="relative flex justify-center items-center">
          <motion.img
            src="/images/fertilizer.png"
            alt="Sale Graphic"
            className="w-3/4 sm:w-2/3 md:w-full max-w-md drop-shadow-2xl"
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-pink-400 opacity-30 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-yellow-400 opacity-30 blur-3xl rounded-full -z-10"></div>
    </motion.div>
  );
};

export default SaleBanner;
