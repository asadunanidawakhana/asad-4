import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService, type Order } from '../../services/orderService';
import Loader from '../../components/Loader';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    async function fetchOrders() {
        try {
            const data = await orderService.getUserOrders(user!.id);
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loader />;

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't placed an order yet.</p>
                <Link to="/shop" className="text-primary-600 font-medium hover:underline">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-gray-500">Order #</span>
                                    <span className="font-mono font-medium text-gray-900">{order.id.slice(0, 8)}</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <StatusBadge status={order.status} />
                                <p className="text-lg font-bold text-gray-900">PKR {order.total}</p>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            <ul className="divide-y divide-gray-100">
                                {order.items?.map((item) => (
                                    <li key={item.id} className="py-3 flex items-center">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                            <img src={item.product?.image_url || 'https://via.placeholder.com/50?text=?'} alt="Product" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">PKR {item.price * item.quantity}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    const icons: any = {
        pending: Clock,
        processing: Package,
        shipped: Truck,
        delivered: CheckCircle,
        cancelled: XCircle
    };

    const Icon = icons[status] || Clock;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            <Icon className="w-3 h-3 mr-1.5" />
            {status}
        </span>
    );
}
