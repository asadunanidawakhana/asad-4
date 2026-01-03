import { supabase } from './supabaseClient';

export interface WishlistItem {
    id: string;
    product_id: string;
    created_at: string;
    product?: {
        id: string;
        name: string;
        price: number;
        image_url?: string; // Matching schema now
    };
}

export const wishlistService = {
    async getWishlist(userId: string) {
        const { data, error } = await supabase
            .from('wishlist')
            .select(`
                *,
                product:products (id, name, price, image_url, stock_quantity)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as WishlistItem[];
    },

    async addToWishlist(userId: string, productId: string) {
        const { error } = await supabase
            .from('wishlist')
            .insert([{ user_id: userId, product_id: productId }]);

        if (error) {
            // Ignore unique constraint violation (already in wishlist)
            if (error.code === '23505') return;
            throw error;
        }
    },

    async removeFromWishlist(userId: string, productId: string) {
        const { error } = await supabase
            .from('wishlist')
            .delete()
            .match({ user_id: userId, product_id: productId });

        if (error) throw error;
    },

    async checkInWishlist(userId: string, productId: string) {
        const { data, error } = await supabase
            .from('wishlist')
            .select('id')
            .match({ user_id: userId, product_id: productId })
            .maybeSingle();

        if (error) throw error;
        return !!data;
    }
};
