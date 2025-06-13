
import { SoupIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { getCloudinaryScaledImageUrl } from '~/services/cloudinary/cloudinary-utils';

type MenuItemImageProps = { imageId: string | undefined | null, sizeInPx?: number }

export const MenuItemImage: React.FC<MenuItemImageProps> = ({ imageId, sizeInPx = 60 }) => {

    if (!imageId) {
        return <div className={`flex items-center justify-center min-w-[${sizeInPx}px] min-h-[${sizeInPx}px] w-[${sizeInPx}px] h-[${sizeInPx}px] rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
            {/* {type === 'dish' ? <SoupIcon /> : <WineIcon />} */}
            <SoupIcon />
        </div>
    }

    return (
        <div className={`flex items-center justify-center min-w-[${sizeInPx}px] min-h-[${sizeInPx}px] w-[${sizeInPx}px] h-[${sizeInPx}px] rounded-xl  overflow-hidden`}>
            <Image
                src={getCloudinaryScaledImageUrl(imageId)}
                alt={'Menu item image'}
                width={sizeInPx}
                height={sizeInPx}
                className="object-contain"
            />
        </div>
    )
}
