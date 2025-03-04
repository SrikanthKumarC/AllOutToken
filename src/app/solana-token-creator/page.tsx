'use client'
import React, { useState, useCallback } from "react";
import ClientOnly from "@/components/ClientOnly";
import Header from "@/components/Header";
import {
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import {
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getMinimumBalanceForRentExemptMint,
    AuthorityType,
    createSetAuthorityInstruction,
} from "@solana/spl-token";
import {
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } from "@solana/spl-token";

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
    const { connection } = useConnection();
    const { connected, publicKey, sendTransaction } = useWallet();
    const [tokenMintAddress, setTokenMintAddress] = useState<string | null>(null);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
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
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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

        // Create preview URL for the image
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImagePreview(null);
        }
    };

    const createToken = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploadError(null);
        
        if (!publicKey) {
            alert('Wallet not connected!');
            return;
        }

        try {
            // First upload the image and get metadata URI
            let metadataUrl = '';
            if (formData.image) {
                setIsUploading(true);
                try {
                    const uploadFormData = new FormData();
                    uploadFormData.append('image', formData.image);
                    uploadFormData.append('name', formData.name);
                    uploadFormData.append('symbol', formData.symbol);
                    uploadFormData.append('description', formData.description);

                    const uploadResponse = await fetch('/api/upload-image', {
                        method: 'POST',
                        body: uploadFormData
                    });

                    if (!uploadResponse.ok) {
                        throw new Error('Failed to upload image');
                    }

                    const response = await uploadResponse.json();
                    // No need for conversion since API now returns HTTP URLs
                    metadataUrl = response.metadataUrl;
                } catch (error) {
                    setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
                    setIsUploading(false);
                    return;
                }
                setIsUploading(false);
            }

            const lamports = await getMinimumBalanceForRentExemptMint(connection);
            const mintKeypair = Keypair.generate();

            const tx = new Transaction();

            tx.add(
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: MINT_SIZE,
                    lamports,
                    programId: TOKEN_PROGRAM_ID,
                }),
                createInitializeMintInstruction(
                    mintKeypair.publicKey,
                    Number(formData.decimals),
                    publicKey,
                    publicKey, // Freeze authority
                    TOKEN_PROGRAM_ID,
                )
            );

            const associatedTokenAccount = await getAssociatedTokenAddress(
                mintKeypair.publicKey,
                publicKey
            );

            tx.add(
                createAssociatedTokenAccountInstruction(
                    publicKey,
                    associatedTokenAccount,
                    publicKey,
                    mintKeypair.publicKey
                )
            );

            const mintAmount = Number(formData.supply) * Math.pow(10, Number(formData.decimals));
            tx.add(
                createMintToInstruction(
                    mintKeypair.publicKey,
                    associatedTokenAccount,
                    publicKey,
                    mintAmount
                )
            );

            tx.add(
                createCreateMetadataAccountV3Instruction(
                    {
                        metadata: (
                            await PublicKey.findProgramAddress(
                                [
                                    Buffer.from("metadata"),
                                    PROGRAM_ID.toBuffer(),
                                    mintKeypair.publicKey.toBuffer(),
                                ],
                                PROGRAM_ID,
                            )
                        )[0],
                        mint: mintKeypair.publicKey,
                        mintAuthority: publicKey,
                        payer: publicKey,
                        updateAuthority: publicKey,
                    },
                    {
                        createMetadataAccountArgsV3: {
                            data: {
                                name: formData.name,
                                symbol: formData.symbol,
                                uri: metadataUrl,
                                creators: null,
                                sellerFeeBasisPoints: 0,
                                collection: null,
                                uses: null,
                            },
                            isMutable: false,
                            collectionDetails: null,
                        },
                    },
                )
            );

            if (formData.revokeFreeze) {
                tx.add(
                    createSetAuthorityInstruction(
                        mintKeypair.publicKey,
                        publicKey,
                        AuthorityType.FreezeAccount,
                        null
                    )
                );
            }

            if (formData.revokeMint) {
                tx.add(
                    createSetAuthorityInstruction(
                        mintKeypair.publicKey,
                        publicKey,
                        AuthorityType.MintTokens,
                        null
                    )
                );
            }

            const signature = await sendTransaction(tx, connection, {
                signers: [mintKeypair],
            });

            setTokenMintAddress(mintKeypair.publicKey.toString());
            const successMessage = `Token created and minted successfully!\nMint address: ${mintKeypair.publicKey.toString()}\n${formData.revokeFreeze ? '✓ Freeze authority revoked\n' : ''
                }${formData.revokeMint ? '✓ Mint authority revoked' : ''}`;

            alert(successMessage);
            console.log('Transaction signature:', signature);
        } catch (error) {
            console.error('Error creating token:', error);
            if (error instanceof Error) {
                alert(`Failed to create token: ${error.message}`);
            } else {
                alert('Failed to create token: An unknown error occurred.');
            }
        }
    }, [
        publicKey,
        connection,
        formData,
        sendTransaction,
    ]);

    const renderConnectButton = () => {
        return (
            <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-[#3b4bdf] to-[#5c6dff] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? 'Uploading Image...' : connected ? 'Create Token' : 'Connect Wallet'}
            </button>
        );
    };

    const renderError = () => {
        if (!uploadError) return null;
        return (
            <div className="text-red-500 text-sm mt-2 text-center">
                {uploadError}
            </div>
        );
    };

    return (
        <div
            style={{
                backgroundImage:
                    "linear-gradient(rgba(14, 17, 23, 0.698), rgba(14, 17, 23, 0.698)), url('/background.png')",
            }}
            className="min-h-screen px-4 bg-cover bg-center text-white pb-14"
        >
            <ClientOnly>
                <Header />
                <div className="bg-transparent backdrop-blur-10 p-8 border-gray-500 border rounded-[20px] shadow-lg w-full max-w-lg mx-auto mt-12">
                    <form onSubmit={createToken} className="space-y-6">
                        <h1 className="text-white text-2xl text-center font-bold">Solana Token Creator</h1>
                        {tokenMintAddress && <p className="text-center">Token created successfully! Mint address: {tokenMintAddress}</p>}
                        {renderError()}
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
                                        {imagePreview ? (
                                            <div className="flex items-center gap-2">
                                                <img src={imagePreview} alt="Preview" className="h-6 w-6 object-cover rounded" />
                                                <span className="text-sm">Image uploaded</span>
                                            </div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

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

                        <ClientOnly>
                            {renderConnectButton()}
                        </ClientOnly>
                    </form>
                </div>
            </ClientOnly>
        </div>
    );
};

const CreateTokenWithWallet = () => {

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

