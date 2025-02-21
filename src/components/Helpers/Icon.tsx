import { ReactNode } from "react";

interface IconProps {
    children: ReactNode;
}

const Icon = ({ children }: IconProps) => {
    return <div className="rounded-full transition-all duration-300 hover:bg-[#2b2f33] bg-[#2A2D30] cursor-pointer p-4 px-4 flex items-center justify-center">{children}</div>;
};

export default Icon;
