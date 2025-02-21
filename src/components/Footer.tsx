import React from "react";
import Marquee from "react-fast-marquee";

// List the images in the public/footer folder.
// Update the filenames as needed.
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
    return (
        <footer className="footer bg-dark-900">
            <div className="">
                <div className="py-6 backdrop-blur-md">
                    <Marquee>
                        {images.map((src, index) => (
                            <img className="mr-16" key={index} src={src} alt={`Footer image ${index + 1}`} />
                        ))}
                    </Marquee>
                </div>
            </div>
        </footer>
    );
};

export default Footer;