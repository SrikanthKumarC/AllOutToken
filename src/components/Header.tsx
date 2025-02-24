"use client"
import Image from "next/image";
import Icon from "./Helpers/Icon";
import { TelegramLogo, XLogo, DiscordLogo, X } from "@phosphor-icons/react";
import './walletStyle.css';
import { Drawer } from 'antd';
import { useState } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";

const ConnectWalletButton = dynamic(
    () => import('@/components/ConnectWalletButton'),
    { ssr: false }
);

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
            <Link href="/" className="flex items-center cursor-pointer">
                <Image src="/logo.png" alt="logo" width={50} height={50} />
            </Link>
            <div className="flex items-center gap-4">
                <Icon><TelegramLogo size={24} /></Icon>
                <Icon><DiscordLogo size={24} /></Icon>
                <Icon><XLogo size={24} /></Icon>
                <Link href="/solana-token-creator" className="hidden lg:block hover:bg-[#2b2f33] bg-[#2A2D30] p-4 rounded-full">Create Token</Link>
                <ConnectWalletButton />
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
                style={{ background: "#1B2226", color: "white" }}
                closeIcon={<X size={24} color='white' />}
                styles={{ body: { backgroundColor: "#1B2226" } }}
                title=""
                placement="left"
                onClose={onClose}
                open={open}
            >
                <div className="flex flex-col gap-4">
                    <Link href="/" className="block hover:bg-[#2b2f33] bg-[#2A2D30] p-4 rounded-full">Home</Link>
                        <Link href="/solana-token-creator" className="block hover:bg-[#2b2f33] bg-[#2A2D30] p-4 rounded-full">Create Token</Link>
                    <div className="flex justify-center items-center cursor-pointer hover:bg-[#2b2f33] bg-[#2A2D30] rounded-full py-4 text-black">
                        <ConnectWalletButton />
                    </div>
                </div>
            </Drawer>
        </nav>
    );
}

export default Header;