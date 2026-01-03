import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Users, Package, ArrowRight, Clock } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        users: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // 1. Fetch Stats
            const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
            const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

            // Calculate Revenue (Sum of total from all orders)
            // Note: For large datasets, this should be a database function or summarized table.
            // For now, fetching all 'total' fields is okay for small scale.
            const { data: revenueData } = await supabase.from('orders').select('total');
            const totalRevenue = revenueData?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

            setStats({
                revenue: totalRevenue,
                orders: ordersCount || 0,
                products: productsCount || 0,
                users: usersCount || 0
            });

            // 2. Fetch Recent Orders
            // Using the updated relation (user:profiles)
            const { data: orders } = await supabase
                .from('orders')
                .select(`
                    *,
                    user:profiles (email, full_name)
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentOrders(orders || []);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">PKR {stats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.orders}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Products</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.products}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                        <Package className="w-6 h-6 text-orange-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.users}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-sm text-primary-700 font-medium hover:underline flex items-center">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.user?.full_name || 'User'}</div>
                                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">PKR {order.total}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                                                'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p>No orders found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
