'use client';

import { CldUploadWidget } from 'next-cloudinary';

export function UploadMenuItemPicture() {
    return <CldUploadWidget uploadPreset="menu-item-picture">
        {({ open }) => {
            return (
                <button onClick={() => open()}>
                    Upload an Image
                </button>
            );
        }}
    </CldUploadWidget>
}