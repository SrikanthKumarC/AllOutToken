'use client'

import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

export default function WalletProviderComponent({ children }: { children: React.ReactNode }) {
    // You can add more wallets to this array
    const wallets = [new PhantomWalletAdapter()];

    // Configure the network (devnet or mainnet-beta)
    const endpoint = clusterApiUrl('devnet');

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
} 