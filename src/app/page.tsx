'use client'
import Header from "@/components/Header";
  import Image from "next/image";
import { FileText } from "@phosphor-icons/react";
import Footer from "@/components/Footer";
import { outfit } from "@/app/layout";
export default function Home() {
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(14, 17, 23, 0.698), rgba(14, 17, 23, 0.698)), url('/background.png')",
      }}
      className="min-h-screen bg-cover bg-center text-white  "
    >
      <div className="sm:px-10 px-4 md:px-16 lg:px-32 xl:px-40">
        <Header />
        <div className="grid grid-cols-2 gap-4 mt-24">
          <aside className="rounded-lg p-4">
            <h1 className={`${outfit.className} text-6xl font-bold py-2 mt-12 leading-[4.5rem]`}>
              Discover the next
              big in Crypto
            </h1>
            <p className="text-lg text-[#FFFFFFCC] mt-4 leading-8 mb-10 font-semibold">
              Invest in cutting-edge blockchain projects and be part of the future of web3.0 finance
            </p>
            <button className="text-[#1ee8b7] flex gap-2 items-center backdrop-blur-lg bg-[#1ee8b726] font-bold uppercase px-10 rounded-full py-4">
              <FileText size={24} />
              whitepaper
              </button>

            <section className="flex flex-col mt-8 gap-4 text-[#FFFFFFCC] font-semibold">
              <h2>Total Supply: <span>100000</span></h2>
              <h2>Soft Cap: <span>10 ETH</span></h2>
              <h2>Hard Cap: <span>40 ETH</span></h2>
            </section>
          </aside>
          <aside className="bg-[#1a1d21] rounded-lg p-4">
            <p>Placeholder</p>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
