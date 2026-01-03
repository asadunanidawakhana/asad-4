import { supabase } from './supabaseClient';

export interface Ticket {
    id: string;
    user_id: string;
    subject: string;
    message: string;
    status: 'open' | 'in-progress' | 'closed';
    created_at: string;
    user?: {
        email: string;
        full_name?: string;
    };
}

export const supportService = {
    // Create a new ticket
    async createTicket(subject: string, message: string, userId: string) {
        const { data, error } = await supabase
            .from('support_tickets')
            .insert([{
                user_id: userId,
                subject,
                message,
                status: 'open'
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Ticket;
    },

    // Get tickets for a specific user
    async getUserTickets(userId: string) {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Ticket[];
    },

    // Get all tickets (Admin)
    async getAllTickets() {
        // Note: This requires the profiles table or Auth join to query user details if not directly accessible,
        // but typically RLS prevents reading auth.users. 
        // We'll rely on our new profiles table if available, or just get data.
        // For now, let's assume we can fetch basic data.
        const { data, error } = await supabase
            .from('support_tickets')
            .select(`
        *,
        user:user_id (email)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Ticket[];
    },

    // Update ticket status (Admin)
    async updateTicketStatus(id: string, status: 'open' | 'in-progress' | 'closed') {
        const { data, error } = await supabase
            .from('support_tickets')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Ticket;
    }
};
