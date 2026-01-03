import { supabase } from './supabaseClient';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    author_id: string;
    image?: string;
    created_at: string;
    is_published: boolean;
    author?: {
        full_name: string;
    };
}

export const blogService = {
    async getAllBlogs(isAdmin = false) {
        let query = supabase
            .from('blogs')
            .select(`
                *,
                author:profiles(full_name)
            `)
            .order('created_at', { ascending: false });

        if (!isAdmin) {
            query = query.eq('is_published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as BlogPost[];
    },

    async getBlogBySlug(slug: string) {
        const { data, error } = await supabase
            .from('blogs')
            .select(`
                *,
                author:profiles(full_name)
            `)
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data as BlogPost;
    },

    async createBlog(blog: Partial<BlogPost>, imageFile?: File) {
        let imageUrl = blog.image;

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `blog-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(`blogs/${fileName}`, imageFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(`blogs/${fileName}`);

            imageUrl = publicUrl;
        }

        const { data, error } = await supabase
            .from('blogs')
            .insert([{ ...blog, image: imageUrl }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateBlog(id: string, updates: Partial<BlogPost>, imageFile?: File) {
        let imageUrl = updates.image;

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `blog-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(`blogs/${fileName}`, imageFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(`blogs/${fileName}`);

            imageUrl = publicUrl;
        }

        const { data, error } = await supabase
            .from('blogs')
            .update({ ...updates, image: imageUrl })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteBlog(id: string) {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
