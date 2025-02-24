'use client'
// import Header from "@/components/Header";
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
import { FileText } from "@phosphor-icons/react";
import dynamic from "next/dynamic";



// import Footer from "@/components/Footer";
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
import { outfit } from "@/app/layout";
// import HeroCard from "@/components/HeroCard";
const HeroCard = dynamic(() => import("@/components/HeroCard"), { ssr: false });
const Home = () => {
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(14, 17, 23, 0.698), rgba(14, 17, 23, 0.698)), url('/background.png')",
      }}
      className="min-h-screen bg-cover bg-center text-white  "
    >
      <div className="sm:px-10 px-4 md:px-16 lg:px-32 xl:px-40 mb-[70px]">
        <Header />
        <div className="grid lg:grid-cols-2 gap-4 mt-24 grid-cols-1">
          <aside className="rounded-lg p-4">
            <h1 className={`${outfit.className} text-6xl font-bold py-2 mt-12 leading-[4.5rem]`}>
              Discover the next
              big in Crypto
            </h1>
            <p className="text-lg text-[#FFFFFFCC] mt-4 leading-8 mb-10 font-semibold">
              Invest in cutting-edge blockchain projects and be part of the future of web3.0 finance
            </p>
            <button className="text-[#1ee8b7] hover:bg-[#1ee8b64c] flex gap-2 items-center backdrop-blur-lg bg-[#1ee8b726] font-bold uppercase px-10 rounded-full py-4">
              <FileText size={24} />
              whitepaper
            </button>

            <section className="flex flex-col mt-8 gap-4 text-[#FFFFFFCC] font-semibold">
              <h2>Total Supply: <span>100000</span></h2>

              <h2>Soft Cap: <span>10 ETH</span></h2>
              <h2>Hard Cap: <span>40 ETH</span></h2>
            </section>
          </aside>
          <aside className="">
            <HeroCard />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
