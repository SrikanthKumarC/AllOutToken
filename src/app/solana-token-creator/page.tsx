'use client'
import React, { useState, useEffect } from "react";
import ClientOnly from "@/components/ClientOnly";
import Header from "@/components/Header";

// Add these imports at the top
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

interface TokenFormData {
    name: string;
    symbol: string;
    decimals: number;
    image: File | null;
    supply: string;
    description: string;
    revokeFreeze: boolean;
    revokeMint: boolean;
    telegramLink: string;
    websiteLink: string;
    twitterLink: string;
}

const CreateToken = () => {
    const { connected, select, publicKey, wallets } = useWallet();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [formData, setFormData] = useState<TokenFormData>({
        name: '',
        symbol: '',
        decimals: 6,
        image: null,
        supply: '',
        description: '',
        revokeFreeze: false,
        revokeMint: false,
        telegramLink: '',
        websiteLink: '',
        twitterLink: '',
    });
    console.log(formData);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    useEffect(() => {
        if (publicKey) {
            setWalletAddress(publicKey.toString());
        }
    }, [publicKey]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!connected) {
            try {
                // Find Phantom wallet adapter
                const phantomWallet = wallets.find(wallet => wallet.adapter.name === 'Phantom');
                if (phantomWallet) {
                    await select(phantomWallet.adapter.name);
                } else {
                    console.error('Phantom wallet not found');
                    // Optionally show a message to user to install Phantom
                    window.open('https://phantom.app/', '_blank');
                }
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                return;
            }
            return; // Return here to prevent form submission before wallet connection
        }

        // Create FormData object for handling file upload
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                submitData.append(key, value);
            }
        });

        try {
            console.log(submitData);
            return;
            // Example API call - replace with your actual API endpoint
            const response = await fetch('/api/create-token', {
                method: 'POST',
                body: submitData,
            });

            if (!response.ok) {
                throw new Error('Failed to create token');
            }

            const data = await response.json();
            console.log('Token created successfully:', data);

            // Handle successful submission (e.g., show success message, redirect, etc.)
        } catch (error) {
            console.error('Error creating token:', error);
            // Handle error (e.g., show error message)
        }
    };

    const renderConnectButton = () => {
        return (
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3b4bdf] to-[#5c6dff] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
                {connected ? 'Create Token' : 'Connect Wallet'}
            </button>
        );
    };

    return (
        <div
            style={{
                backgroundImage:
                    "linear-gradient(rgba(14, 17, 23, 0.698), rgba(14, 17, 23, 0.698)), url('/background.png')",
            }}
            className="min-h-screen bg-cover bg-center text-white"
        >
            <ClientOnly>
                <Header />
                <div className="bg-transparent backdrop-blur-10 p-8 border-gray-500 border rounded-[20px] shadow-lg w-full max-w-lg mx-auto mt-24">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Token Name and Symbol in grid */}
                        <h1 className="text-white text-2xl font-bold">Solana Token Creator</h1>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#2A2D30] border border-[#3e4246] rounded-lg p-3 text-white focus:outline-none focus:border-[#3b4bdf]"
                                    placeholder="Token Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Symbol</label>
                                <input
                                    type="text"
                                    name="symbol"
                                    value={formData.symbol}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#2A2D30] border border-[#3e4246] rounded-lg p-3 text-white focus:outline-none focus:border-[#3b4bdf]"
                                    placeholder="Token Symbol"
                                    required
                                />
                            </div>
                        </div>

                        {/* Decimals and Image Upload in grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Decimals</label>
                                <input
                                    type="number"
                                    name="decimals"
                                    value={formData.decimals}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#2A2D30] border border-[#3e4246] rounded-lg p-3 text-white focus:outline-none focus:border-[#3b4bdf]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Image</label>
                                <div className="relative h-[46px]">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                    />
                                    <div className="w-full h-full bg-[#2A2D30] border border-[#3e4246] rounded-lg p-3 text-white flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Supply */}
                        <div>
                            <label className="block text-white mb-2">Supply</label>
                            <input
                                type="number"
                                name="supply"
                                value={formData.supply}
                                onChange={handleInputChange}
                                className="w-full bg-[#2A2D30] border border-[#3e4246] rounded-lg p-3 text-white focus:outline-none focus:border-[#3b4bdf]"
                                placeholder="Enter token supply"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full bg-[#2A2D30] border border-[#3e4246] rounded-lg p-3 text-white focus:outline-none focus:border-[#3b4bdf] min-h-[100px]"
                                placeholder="Enter token description"
                            />
                        </div>

                        {/* Revoke Options */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#2A2D30] border border-[#3e4246] rounded-lg p-6">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <h3 className="text-white text-lg">Revoke Freeze</h3>
                                        <p className="text-[#64748b] mt-1">Revoke Freeze allows you to create a liquidity pool</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="revokeFreeze"
                                                checked={formData.revokeFreeze}
                                                onChange={handleCheckboxChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-7 bg-[#0f1137] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#3b4bdf]"></div>
                                        </label>
                                        <span className="text-white whitespace-nowrap">(0.1 SOL)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#2A2D30] border border-[#3e4246] rounded-lg p-6">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <h3 className="text-white text-lg">Revoke Mint</h3>
                                        <p className="text-[#64748b] mt-1">Mint Authority allows you to increase tokens supply</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="revokeMint"
                                                checked={formData.revokeMint}
                                                onChange={handleCheckboxChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-7 bg-[#0f1137] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#3b4bdf]"></div>
                                        </label>
                                        <span className="text-white whitespace-nowrap">(0.1 SOL)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Show More Options Button */}
                        <button
                            type="button"
                            onClick={() => setShowMoreOptions(!showMoreOptions)}
                            className="w-full text-[#3b4bdf] py-2 flex items-center justify-center gap-2"
                        >
                            {showMoreOptions ? 'Hide More Options' : 'Show More Options'}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 transition-transform ${showMoreOptions ? 'rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Additional Options */}
                        {showMoreOptions && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white mb-2">Telegram link</label>
                                    <input
                                        type="url"
                                        name="telegramLink"
                                        value={formData.telegramLink}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2A2D30] border border-[#3e4246] rounded-lg p-3 text-white focus:outline-none focus:border-[#3b4bdf]"
                                        placeholder="(Optional)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white mb-2">Website link</label>
                                    <input
                                        type="url"
                                        name="websiteLink"
                                        value={formData.websiteLink}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2A2D30] border border-[#3e4246] rounded-lg p-3 text-white focus:outline-none focus:border-[#3b4bdf]"
                                        placeholder="(Optional)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white mb-2">Twitter or X link</label>
                                    <input
                                        type="url"
                                        name="twitterLink"
                                        value={formData.twitterLink}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2A2D30] border border-[#3e4246] rounded-lg p-3 text-white focus:outline-none focus:border-[#3b4bdf]"
                                        placeholder="(Optional)"
                                    />
                                </div>

                                <p className="text-[#64748b] text-sm">
                                    tip: coin data cannot be changed after creation
                                </p>
                            </div>
                        )}

                        {/* Wrap the Select Wallet button with ClientOnly if it triggers wallet connection */}
                        <ClientOnly>
                            {renderConnectButton()}
                        </ClientOnly>
                    </form>
                </div>
            </ClientOnly>
        </div>
    );
};

// Wrap the component with required providers
const CreateTokenWithWallet = () => {
    // You can add more wallets to this array
    const wallets = [new PhantomWalletAdapter()];

    // Configure the network (devnet or mainnet-beta)
    const endpoint = clusterApiUrl('devnet');

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <CreateToken />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default CreateTokenWithWallet;

