'use client'
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const images = [
    "/footer/footer1.png",
    "/footer/footer2.png",
    "/footer/footer3.png",
    "/footer/footer4.png",
    "/footer/footer5.png",
    "/footer/footer6.png",
    "/footer/footer7.png",
    "/footer/footer8.png"
];

const Footer = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only render the marquee once the component has mounted
    if (!mounted) return null;

    return (
        <footer className="footer bg-dark-900">
            <div>
                <div className="py-6 backdrop-blur-md bg-[#ffffff0d]">
                    <Marquee speed={75}>
                        {images.map((src, index) => (
                            <img className="mr-32" key={index} src={src} alt={`Footer image ${index + 1}`} />
                        ))}
                    </Marquee>
                </div>
            </div>
        </footer>
    );
};

export default Footer;