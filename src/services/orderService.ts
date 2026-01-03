import { supabase } from './supabaseClient';
import type { CartItem } from '../context/CartContext';

export interface Order {
    id: string;
    user_id: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shipping_address: any;
    payment_method: string;
    created_at: string;
    items?: OrderItem[];
    user?: {
        email: string;
    };
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    product?: {
        name: string;
        image_url?: string;
    };
}

export const orderService = {

    async createOrder(userId: string, items: CartItem[], total: number, shippingAddress: any, paymentMethod: string) {
        if (!items.length) throw new Error("No items in order");

        // 1. Create Order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: userId,
                    total,
                    status: 'pending',
                    shipping_address: shippingAddress,
                    payment_method: paymentMethod
                }
            ])
            .select()
            .single();

        if (orderError) throw orderError;
        if (!orderData) throw new Error("Failed to create order");

        const orderId = orderData.id;

        // 2. Create Order Items
        const orderItems = items.map(item => ({
            order_id: orderId,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            // Technically should rollback order here but standard Supabase JS client doesn't support transactions easily without RPC.
            // For now, logging error.
            console.error("Error creating items", itemsError);
            throw itemsError;
        }

        return orderData;
    },

    async getUserOrders(userId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
            *,
            items:order_items (
                *,
                product:products (name, image_url)
            )
        `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    },

    async getAllOrders() {
        // Admin only function typically
        const { data, error } = await supabase
            .from('orders')
            .select(`
            *,
            user:profiles (email),
            items:order_items (
                *,
                product:products (name, image_url)
            )
        `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    },

    async updateOrderStatus(orderId: string, status: string) {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) throw error;
    },

    async getOrderById(orderId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
          *,
          user:profiles (email),
          items:order_items (
              *,
              product:products (name, image_url)
          )
      `)
            .eq('id', orderId)
            .single();

        if (error) throw error;
        return data as Order;
    }
};
