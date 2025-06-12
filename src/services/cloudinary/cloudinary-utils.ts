import { env } from '~/env';

export type CloudinaryImageId = string;

export function getCloudinaryImageUrl(imageId: CloudinaryImageId) {
    return `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${imageId}`;
}

export function getCloudinaryScaledImageUrl(imageId: CloudinaryImageId) {
    return `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_120,h_120/${imageId}`;
}
