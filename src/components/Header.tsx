// create a header component that is a navbar with a logo and a button
"use client"
import Image from "next/image";
import Icon from "./Helpers/Icon";

import { TelegramLogo, XLogo, TwitterLogo, DiscordLogo, DotsThreeCircleVertical } from "@phosphor-icons/react";


export default function Header() {
    return (
        <nav className="flex justify-between items-center p-4">
            <div className="flex items-center">
                <Image src="/logo.png" alt="logo" width={50} height={50} />
            </div>
            <div className="flex items-center gap-4">
                <Icon><TelegramLogo size={24} /></Icon>
                <Icon><DiscordLogo size={24} /></Icon>
                <Icon><XLogo size={24} /></Icon>
                <Icon>TODO wallet</Icon>
                <Icon><DotsThreeCircleVertical size={24} /></Icon>


            </div>
        </nav>
    );
}   