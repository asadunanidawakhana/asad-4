import { supabase } from './supabaseClient';

export const storageService = {
    /**
     * Uploads an image file to the 'images' bucket.
     * @param file The file object to upload
     * @param folder The folder path within the bucket (e.g., 'products', 'categories')
     * @returns The public URL of the uploaded image
     */
    async uploadImage(file: File, folder: string = 'uploads'): Promise<string> {
        try {
            // Create a unique file name
            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload the file
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get the public URL
            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(fileName);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
};
