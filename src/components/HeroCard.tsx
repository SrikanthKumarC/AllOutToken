'use client'

import React, { useState, useEffect } from "react";
import { outfit } from "@/app/layout";
import Image from "next/image";
import { ArrowDownRight } from "@phosphor-icons/react";
import ReactCardFlip from 'react-card-flip';
const HeroCard = () => {
    const endDate = new Date("2025-06-01");
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    // Function to calculate the remaining time
    const calculateTimeRemaining = () => {
        const now = new Date();
        let diff = endDate.getTime() - now.getTime();

        // If the end date has passed, show zeros.
        if (diff < 0) diff = 0;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * 1000 * 60 * 60 * 24;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * 1000 * 60;
        const seconds = Math.floor(diff / 1000);

        return { days, hours, minutes, seconds };
    };

    // State to hold the remaining time
    const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining());

    // Update the countdown every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (

        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div key={"front"} className="relative backdrop-blur-sm bg-opacity-10 rounded-xl p-10 ml-[65px]">
                <div className="absolute inset-0 bg-[#ffffff1a] backdrop-blur-sm rounded-xl -z-10"></div>

                <img className="absolute top-0 left-0 -z-20" src="/left-hero-bg.png" alt="AOT" />
                <img className="absolute top-0 right-0 -z-20" src="/right-hero-bg.png" alt="AOT" />
                <div className="absolute top-[-65px] left-[-65px]">
                    <div className="relative w-[130px] h-[130px]">
                        <div className="absolute inset-0 bg-[#6236ffcc] rounded-full animate-spin-slow backdrop-blur-lg "></div>
                        <div className="absolute w-full h-full flex items-center justify-center">
                            <Image
                                src="/circle-text.svg"
                                alt="AOT"
                                width={100}
                                height={100}
                                className="animate-spin-slow-reverse"
                            />
                            <ArrowDownRight className="absolute cursor-pointer hover:rotate-[-45deg] transition-transform duration-300 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-bold" weight="bold" size={20} />
                        </div>
                    </div>
                </div>

                <p className="absolute block ml-[45px] top-[20px]">STAGE 1: 20% BONUS!</p>
                <div className="z-10 mt-8">
                    <h1 className="text-white text-lg font-bold mb-4">PRE-SALE ENDS IN</h1>
                    <div className="flex justify-between items-baseline text-white font-mono">
                        <div className="flex items-baseline">
                            <span className={`text-5xl font-bold ${outfit.className}`}>{timeLeft.days}</span>
                            <span className="text-2xl font-bold">d</span>
                        </div>
                        <span className={`text-6xl mx-1 ${outfit.className} text-[#ffffff33]`}>:</span>
                        <div>
                            <span className={`text-5xl font-bold  ${outfit.className}`}>{timeLeft.hours}</span>
                            <span className="text-2xl font-bold">h</span>
                        </div>
                        <span className={`text-6xl  leading-2 ${outfit.className} text-[#ffffff33]`}>:</span>
                        <div>
                            <span className={`text-5xl leading-2 font-bold  ${outfit.className}`}>{timeLeft.minutes}</span>
                            <span className="text-2xl font-bold">m</span>
                        </div>
                        <span className={`text-6xl  ${outfit.className} text-[#ffffff33]`}>:</span>
                        <div>
                            <span className={`text-5xl font-bold  ${outfit.className}`}>{timeLeft.seconds}</span>
                            <span className="text-2xl font-bold">s</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full mt-4">
                        <div className="w-full relative h-5 bg-[#ffffff33] rounded-full">
                            {/* Filled Progress Bar */}
                            <div className="h-full flex items-center justify-end bg-[#1ee8b7] rounded-full text-right" style={{ width: '20%' }}>
                                <span className="text-black pr-2 text-[12px] font-bold">20%</span>
                            </div>

                            {/* Text at the end of the progress */}
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-black">

                            </div>
                        </div>
                    </div>


                    {/* Progress Bar */}
                    <div className="flex justify-between mt-4">
                        <p>Raised: <span>20000</span></p>
                        <p>Goal: <span>100000</span></p>
                    </div>
                    <p className="mb-6"></p>
                    <div className="flex justify-between">
                        <p>Token Name</p>
                        <p className="uppercase">Allout Token</p>
                    </div>



                    <hr className="border-[#ffffff33] w-full border-l my-2" />

                    <div className="flex justify-between">
                        <p>Token Symbol</p>
                        <p>AOT</p>
                    </div>
                    <hr className="border-[#ffffff33] w-full border-l my-2" />

                    <div className="flex justify-between">
                        <p>Current Stage</p>
                        <p>0.001</p>
                    </div>
                    <hr className="border-[#ffffff33] w-full border-l my-2" />

                    <div className="flex justify-between">
                        <p>Next Stage</p>
                        <p>0.002</p>
                    </div>
                    <hr className="border-[#ffffff33] w-full border-l my-2" />

                    <button onClick={handleFlip} className="bg-[#1ee8b7] text-black font-semibold
            w-full uppercase px-10 rounded-full py-4 mt-8 hover:bg-[#1ee8b7]/80 transition-colors duration-300">BUY AOT NOW</button>
                </div>
            </div>
            <div key={"back"} className="relative backdrop-blur-sm bg-opacity-10 rounded-xl p-10 ml-[65px]">
                <div className="absolute inset-0 bg-[#ffffff1a] backdrop-blur-sm rounded-xl -z-10"></div>

                <img className="absolute top-0 left-0 -z-20" src="/left-hero-bg.png" alt="AOT" />
                <img className="absolute top-0 right-0 -z-20" src="/right-hero-bg.png" alt="AOT" />

            </div>
        </ReactCardFlip>

    )
}

export default HeroCard;
