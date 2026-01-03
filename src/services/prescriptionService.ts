import { supabase } from './supabaseClient';

export interface Prescription {
    id: string;
    user_id: string;
    file_url: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    created_at: string;
    user?: {
        email: string;
    };
}

export const prescriptionService = {

    async uploadPrescription(userId: string, file: File, notes?: string) {
        // 1. Upload File
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('prescriptions')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('prescriptions')
            .getPublicUrl(filePath);

        // 3. Save Record
        const { data, error: dbError } = await supabase
            .from('prescriptions')
            .insert([
                {
                    user_id: userId,
                    file_url: publicUrl,
                    status: 'pending',
                    notes: notes
                }
            ])
            .select()
            .single();

        if (dbError) throw dbError;
        return data;
    },

    async getUserPrescriptions(userId: string) {
        const { data, error } = await supabase
            .from('prescriptions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Prescription[];
    },

    async getAllPrescriptions() {
        const { data, error } = await supabase
            .from('prescriptions')
            .select(`
        *,
        user:profiles (email)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Prescription[];
    },

    async updateStatus(id: string, status: 'approved' | 'rejected') {
        const { error } = await supabase
            .from('prescriptions')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }
};
