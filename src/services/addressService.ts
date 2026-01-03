import { supabase } from './supabaseClient';

export interface Address {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    zip_code: string;
    is_default: boolean;
    created_at?: string;
}

export const addressService = {
    async getUserAddresses(userId: string) {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false });

        if (error) throw error;
        return data as Address[];
    },

    async addAddress(address: Omit<Address, 'id' | 'created_at'>) {
        // If setting as default, unset others first
        if (address.is_default) {
            await this.clearDefault(address.user_id);
        }

        const { data, error } = await supabase
            .from('addresses')
            .insert([address])
            .select()
            .single();

        if (error) throw error;
        return data as Address;
    },

    async updateAddress(id: string, updates: Partial<Address>) {
        if (updates.is_default && updates.user_id) {
            await this.clearDefault(updates.user_id);
        }

        const { data, error } = await supabase
            .from('addresses')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Address;
    },

    async deleteAddress(id: string) {
        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async clearDefault(userId: string) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', userId);
    }
};
