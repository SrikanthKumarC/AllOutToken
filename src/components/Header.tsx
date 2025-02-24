// create a header component that is a navbar with a logo and a button
"use client"
import '@rainbow-me/rainbowkit/styles.css';
import Image from "next/image";
import Icon from "./Helpers/Icon";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TelegramLogo, XLogo, TwitterLogo, DiscordLogo, DotsThreeCircleVertical, X } from "@phosphor-icons/react";
import './walletStyle.css';
import { Button, Drawer } from 'antd';
import { useState } from "react";
const Header = () => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };  
    return (
        <nav className="w-full flex justify-between items-center p-4">
            <div className="flex items-center">
                <Image src="/logo.png" alt="logo" width={50} height={50} />
            </div>
            <div className="flex items-center gap-4">
                <Icon><TelegramLogo size={24} /></Icon>
                <Icon><DiscordLogo size={24} /></Icon>
                <Icon><XLogo size={24} /></Icon>
                <div>
                    <ConnectButton accountStatus="address" label="Connect Wallet" chainStatus="none" showBalance={false} />
                </div>
                <div className="rounded-full lg:hidden flex transition-all duration-300 hover:bg-[#2b2f33] bg-[#2A2D30] cursor-pointer p-4 px-4 items-center justify-center">
                    <img src="/menu.svg" alt="menu" className="w-6 h-6" onClick={showDrawer} />
                </div>
            </div>
            <Drawer
                footer={<div className="text-white flex pb-12 justify-center bottom-0 items-center gap-4">
                    <Icon><TelegramLogo size={24} /></Icon>
                    <Icon><DiscordLogo size={24} /></Icon>
                    <Icon><XLogo size={24} /></Icon>
                </div>}
                style={{ background: "#1B2226", color: "white" }} closeIcon={<X size={24} color='white' />} styles={{ body: { backgroundColor: "#1B2226" } }} title="" placement="left" onClose={() => setOpen(false)} open={open}>
                <div className="flex justify-center items-center cursor-pointer bg-gray-400 rounded-full py-4 text-black">
                    <ConnectButton accountStatus="address" label="Connect Wallet" chainStatus="none" showBalance={false} />
                </div>

            </Drawer>
        </nav>
    );
}

export default Header;