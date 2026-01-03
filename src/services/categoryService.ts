import { supabase } from './supabaseClient';

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    created_at?: string;
}

export const categoryService = {
    async getAllCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as Category[];
    },

    async getCategoryById(id: string) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Category;
    },

    async createCategory(category: Omit<Category, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('categories')
            .insert([category])
            .select()
            .single();

        if (error) throw error;
        return data as Category;
    },

    async updateCategory(id: string, updates: Partial<Category>) {
        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Category;
    },

    async deleteCategory(id: string) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
