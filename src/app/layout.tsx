'use client'

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})


import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { AntdRegistry } from '@ant-design/nextjs-registry';

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };
const config = getDefaultConfig({
  appName: 'AllOutToken',
  projectId: '9c18163ef5535a0bbdeed386bb61c521',
  chains: [mainnet, polygon, optimism, arbitrum, base],
});


const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased dark`}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme({ accentColor: '#2A2D30', borderRadius:"large", })} modalSize="compact">
              <AntdRegistry>
                {children}
              </AntdRegistry>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
