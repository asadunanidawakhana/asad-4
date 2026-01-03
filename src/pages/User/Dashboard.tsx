import { useEffect, useState } from 'react';
import { Package, Clock, ShoppingCart, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orderService, type Order } from '../../services/orderService';
import Loader from '../../components/Loader';

export default function DashboardOverview() {
    const { user } = useAuth();
    const { itemCount } = useCart();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getUserOrders(user!.id);
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const recentOrders = orders.slice(0, 5); // Show top 5

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pending Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Cart Items</p>
                        <p className="text-2xl font-bold text-gray-900">{itemCount}</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Link to="/dashboard/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                {orders.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-mono text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} items
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p className="font-bold text-gray-900">PKR {order.total.toLocaleString()}</p>
                                    <Link to={`/dashboard/orders`} className="text-gray-400 hover:text-primary-600">
                                        <ExternalLink className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="mb-4">No orders found.</p>
                        <Link to="/shop" className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
