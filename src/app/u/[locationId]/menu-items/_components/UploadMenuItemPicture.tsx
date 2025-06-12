'use client';

import { ExternalLinkIcon, ImageIcon, Loader2, TrashIcon } from 'lucide-react';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { type z } from 'zod';
import { Button } from '~/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { type menuItemFormSchema } from '~/domain/menu-items';
import { toast } from '~/hooks/use-toast';
import { getCloudinaryImageUrl } from '~/services/cloudinary/cloudinary-utils';

export function UploadMenuItemPicture() {
    const form = useFormContext<z.infer<typeof menuItemFormSchema>>();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = (result: CloudinaryUploadWidgetResults) => {
        setIsUploading(true);

        try {
            if (result.event !== 'success') {
                toast({
                    title: 'Upload failed',
                    description: 'The image upload was not successful. Please try again.',
                    variant: 'destructive',
                });
                return;
            }

            if (!result.info) {
                toast({
                    title: 'Upload failed',
                    description: 'Could not get image information from upload.',
                    variant: 'destructive',
                });
                return;
            }

            // Handle both object and string responses
            let publicId: string | undefined;
            if (typeof result.info === 'object' && result.info !== null) {
                publicId = result.info.public_id;
            } else if (typeof result.info === 'string') {
                publicId = result.info;
            }

            if (!publicId) {
                toast({
                    title: 'Upload failed',
                    description: 'Could not get image ID from upload result',
                    variant: 'destructive',
                });
                return;
            }

            form.setValue('imageId', publicId, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });

            toast({
                title: 'Image uploaded',
                description: 'The image was successfully uploaded.',
                variant: 'default',
            });
        } catch {
            // TODO report error to Sentry
            toast({
                title: 'Upload error',
                description: 'An unexpected error occurred while uploading the image.',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <FormField
            control={form.control}
            name="imageId"
            render={({ field }) => {
                return (
                    <FormItem>
                        <FormLabel>Picture</FormLabel>
                        <FormControl>
                            <div className="flex flex-col gap-4">
                                {field.value ? (
                                    <div className="relative group">
                                        <div className="relative w-[200px] h-[200px]">
                                            <Image
                                                src={getCloudinaryImageUrl(field.value ?? '')}
                                                alt="Menu item image"
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="w-8 h-8 p-0"
                                                onClick={() =>
                                                    window.open(`${getCloudinaryImageUrl(field.value ?? '')}`, '_blank')
                                                }
                                            >
                                                <ExternalLinkIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-8 h-8 p-0"
                                                onClick={() => {
                                                    field.onChange('');
                                                    form.setValue('imageId', '', {
                                                        shouldDirty: true,
                                                        shouldTouch: true,
                                                        shouldValidate: true,
                                                    });
                                                }}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <CldUploadWidget
                                        uploadPreset="menu-item-picture"
                                        options={{
                                            maxFiles: 1,
                                            resourceType: 'image',
                                            clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
                                            maxFileSize: 5000000, // 5MB
                                        }}
                                        onSuccess={handleUpload}
                                    >
                                        {({ open }) => (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                className="w-[200px] h-[200px] border-2 border-dashed"
                                                onClick={() => open()}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="h-8 w-8 animate-spin" />
                                                ) : (
                                                    <ImageIcon className="h-8 w-8" />
                                                )}
                                            </Button>
                                        )}
                                    </CldUploadWidget>

                                )}
                            </div>
                        </FormControl>
                        <FormDescription>
                            Upload a picture of your menu item (use a square picture for best results).
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
