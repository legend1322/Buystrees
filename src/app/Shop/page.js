"use client";
import IndexCarousel from "@/components/shop/IndexCarousel";
import { slides } from "@/components/shop/product-data";
import ProductCardSlider from "@/components/shop/cardsSlider";
import CardSlider from "@/components/shop/cardsSlider";
// import SaleBanner from "../components/SaleBanner";

export default function Home() {
  const selectedCategory = "Tools"; 
  const selectedCategory2 = "Pots"; 
  const selectedCategory3 = "Saplings"; 
  const selectedCategory4 = "Fertilizers"; 


  return (
    
    <>
    {/* <Layout> */}
    {/* <div className="h-[40vh]"></div> */}
    <IndexCarousel slides={slides} />

    {/* <SaleBanner /> */}


    <div className="h-[10vh]"></div>
    <CardSlider category={selectedCategory} /> 

        <div className="h-[40vh]"></div>
    <CardSlider category={selectedCategory2} />    

        <div className="h-[40vh]"></div>
    <CardSlider category={selectedCategory3} />    

        <div className="h-[40vh]"></div>
    <CardSlider category={selectedCategory4} />    

    <div className="h-[40vh]"></div>
    {/* </Layout> */}

    </>
  );
}
