'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const ConnectWalletButton = () => {
    return (
        <WalletMultiButton
            className="rounded-full transition-all duration-300 hover:bg-[#2b2f33] bg-[#2A2D30] cursor-pointer p-4 px-4"
        />
    )
}

export default ConnectWalletButton 