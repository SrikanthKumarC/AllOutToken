import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';
import sharp from 'sharp';

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

const validateImage = async (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size must be less than 10MB');
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    try {
        // Get image metadata using sharp
        const metadata = await sharp(buffer).metadata();
        
        // Check dimensions (minimum 50x50px)
        if (!metadata.width || !metadata.height || metadata.width < 50 || metadata.height < 50) {
            throw new Error('Image dimensions must be at least 50x50 pixels');
        }

        // Optionally optimize the image for token use
        const optimizedBuffer = await sharp(buffer)
            .resize(500, 500, { // Resize to a reasonable size for tokens
                fit: 'inside',
                withoutEnlargement: true
            })
            .toBuffer();

        return optimizedBuffer;
    } catch (error) {
        throw new Error('Invalid image file');
    }
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Validate and optimize image
        const optimizedImageBuffer = await validateImage(file);

        // Create form data for Pinata
        const pinataFormData = new FormData();
        pinataFormData.append('file', optimizedImageBuffer, {
            filename: file.name,
            contentType: file.type,
        });

        // Upload to Pinata
        const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', pinataFormData, {
            maxBodyLength: Infinity,
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                ...pinataFormData.getHeaders()
            }
        });

        const imageUrl = `${PINATA_GATEWAY}${res.data.IpfsHash}`;

        // Create and upload metadata following Solana token standard
        const metadata = {
            name: formData.get('name'),
            symbol: formData.get('symbol'),
            description: formData.get('description'),
            image: imageUrl,
            external_url: '',
            attributes: [],
            properties: {
                files: [
                    {
                        uri: imageUrl,
                        type: file.type,
                    }
                ],
                category: 'image',
                maxSupply: null,
                creators: null
            }
        };

        // Upload metadata to Pinata
        const metadataRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                'Content-Type': 'application/json'
            }
        });

        const metadataUrl = `${PINATA_GATEWAY}${metadataRes.data.IpfsHash}`;
        console.log('Metadata URL:', metadataUrl);
        console.log('Metadata:', metadata);

        return NextResponse.json({
            imageUrl: imageUrl,
            metadataUrl: metadataUrl
        });

    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Upload failed' },
            { status: 500 }
        );
    }
}