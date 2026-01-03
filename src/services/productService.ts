import { supabase } from './supabaseClient';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category_id?: string;
    image_url: string;
    sku?: string;
    is_active: boolean;
    created_at?: string;
    // Joined fields
    category?: {
        name: string;
        slug: string;
    };
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
}

// Removed Dummy Data

export const productService = {
    async getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*, category:categories(name, slug)')
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }
        return data as Product[];
    },

    async getProductById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*, category:categories(name, slug)')
            .eq('id', id)
            .single();

        if (error) {
            return null;
        }
        return data as Product;
    },

    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*');

        if (error) {
            return [];
        }
        return data as Category[];
    },

    async getProductsByCategory(slug: string) {
        // This is a bit complex with joins, usually easier to get category ID first or filter client side for small apps
        // For now, let's filter client side or fetch simple
        const { data, error } = await supabase
            .from('products')
            .select('*, category:categories!inner(slug)')
            .eq('is_active', true)
            .eq('categories.slug', slug); // This syntax might need adjustment based on exact relationship name

        // Fallback logic
        if (error) {
            console.warn('DB Error', error);
            return [];
        }
        return data as Product[];
    }
};
