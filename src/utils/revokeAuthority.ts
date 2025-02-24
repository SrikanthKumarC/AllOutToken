import { PublicKey } from '@solana/web3.js';
import { AuthorityType, createSetAuthorityInstruction } from '@solana/spl-token';

export async function revokeAuthority(
    mintAddress: PublicKey,
    currentAuthority: PublicKey,
    authorityType: AuthorityType
) {
    const instruction = createSetAuthorityInstruction(
        mintAddress,           // mint account
        currentAuthority,      // current authority
        authorityType,  // authority type
        null                   // new authority (null to revoke)
    );

    return instruction;
} 